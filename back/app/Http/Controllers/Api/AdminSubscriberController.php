<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubscriptionResource;
use App\Jobs\SendSubscriptionEmailJob;
use App\Models\Subscription;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AdminSubscriberController extends Controller
{
    private function withRelations(): array
    {
        return [
            'country',
            'traineeDetail.stack',
            'traineeDetail.round',
            'trainerDetail.position',
            'companyDetail.companyField',
            'companyDetail.packageRange',
            'timeSlots',
        ];
    }

    private function applyFilters(Builder $query, Request $request, bool $allowTypeFilter = true): Builder
    {
        if ($allowTypeFilter && $request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('name')) {
            $query->where('full_name', 'like', '%' . $request->name . '%');
        }

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        if ($request->filled('round_id')) {
            $query->whereHas('traineeDetail', function ($q) use ($request) {
                $q->where('round_id', $request->round_id);
            });
        }

        return $query;
    }

    private function buildFilteredQuery(Request $request): Builder
    {
        $query = Subscription::query()->with($this->withRelations());

        return $this->applyFilters($query, $request, true);
    }

    public function stats()
    {
        $totalsByType = Subscription::query()
            ->selectRaw('type, COUNT(*) as total')
            ->groupBy('type')
            ->pluck('total', 'type');

        $totalsByStatus = Subscription::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $fromDate = Carbon::now()->subDays(6)->startOfDay();

        $dailyCountsRaw = Subscription::query()
            ->selectRaw('DATE(created_at) as date_key, COUNT(*) as total')
            ->where('created_at', '>=', $fromDate)
            ->groupBy('date_key')
            ->orderBy('date_key')
            ->pluck('total', 'date_key')
            ->all();

        $dailyCounts = [];

        for ($i = 6; $i >= 0; $i--) {
            $day = Carbon::now()->subDays($i)->toDateString();
            $dailyCounts[] = [
                'date' => $day,
                'total' => (int) ($dailyCountsRaw[$day] ?? 0),
            ];
        }

        return response()->json([
            'total_subscribers' => Subscription::query()->count(),
            'totals_by_type' => $totalsByType,
            'totals_by_status' => $totalsByStatus,
            'daily_counts_last_7_days' => $dailyCounts,
        ]);
    }

    public function trends(Request $request)
    {
        $request->validate([
            'interval' => ['nullable', Rule::in(['daily', 'weekly'])],
            'days' => 'nullable|integer|min:1|max:90',
            'type' => ['nullable', Rule::in(['trainee', 'trainer', 'company'])],
            'status' => ['nullable', Rule::in(['pending', 'accepted', 'rejected', 'maybe'])],
        ]);

        $interval = $request->input('interval', 'daily');
        $days = (int) $request->input('days', 30);
        $fromDate = Carbon::now()->subDays($days - 1)->startOfDay();

        $query = Subscription::query()->where('created_at', '>=', $fromDate);

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $driver = DB::connection()->getDriverName();

        if ($interval === 'weekly') {
            if ($driver === 'sqlite') {
                $bucketExpression = "strftime('%Y-W%W', created_at)";
            } else {
                $bucketExpression = "DATE_FORMAT(created_at, '%x-W%v')";
            }
        } else {
            if ($driver === 'sqlite') {
                $bucketExpression = "DATE(created_at)";
            } else {
                $bucketExpression = "DATE(created_at)";
            }
        }

        $data = $query
            ->selectRaw($bucketExpression . ' as bucket, COUNT(*) as total')
            ->groupBy('bucket')
            ->orderBy('bucket')
            ->get();

        return response()->json([
            'interval' => $interval,
            'from_date' => $fromDate->toDateString(),
            'to_date' => Carbon::now()->toDateString(),
            'filters' => [
                'type' => $request->type,
                'status' => $request->status,
            ],
            'data' => $data,
        ]);
    }

    public function index(Request $request)
    {
        $query = $this->buildFilteredQuery($request);

        $perPage = max(1, (int) $request->input('per_page', 15));
        $paginated = $query->latest()->paginate($perPage);

        return SubscriptionResource::collection($paginated);
    }

    public function grouped(Request $request)
    {
        $request->validate([
            'type' => ['nullable', Rule::in(['trainee', 'trainer', 'company'])],
            'status' => ['nullable', Rule::in(['pending', 'accepted', 'rejected', 'maybe'])],
            'name' => 'nullable|string|max:255',
            'date' => 'nullable|date',
            'round_id' => 'nullable|integer|exists:rounds,id',
            'per_type_limit' => 'nullable|integer|min:1|max:100',
        ]);

        $limit = (int) $request->input('per_type_limit', 20);
        $types = $request->filled('type')
            ? [$request->type]
            : ['trainee', 'trainer', 'company'];

        $groups = [];

        foreach ($types as $type) {
            $baseQuery = Subscription::query()->with($this->withRelations())->where('type', $type);
            $baseQuery = $this->applyFilters($baseQuery, $request, false);

            $total = (clone $baseQuery)->count();
            $items = (clone $baseQuery)->latest()->limit($limit)->get();

            $groups[$type] = [
                'total' => $total,
                'items' => SubscriptionResource::collection($items),
            ];
        }

        return response()->json([
            'filters' => [
                'type' => $request->input('type'),
                'status' => $request->input('status'),
                'name' => $request->input('name'),
                'date' => $request->input('date'),
                'round_id' => $request->input('round_id'),
            ],
            'groups' => $groups,
        ]);
    }

    public function selection(Request $request)
    {
        $request->validate([
            'action' => ['required', Rule::in(['select_all', 'select_none', 'invert'])],
            'selected_ids' => 'nullable|array',
            'selected_ids.*' => 'integer|exists:subscriptions,id',
            'type' => ['nullable', Rule::in(['trainee', 'trainer', 'company'])],
            'status' => ['nullable', Rule::in(['pending', 'accepted', 'rejected', 'maybe'])],
            'name' => 'nullable|string|max:255',
            'date' => 'nullable|date',
            'round_id' => 'nullable|integer|exists:rounds,id',
        ]);

        $matchingIds = $this->buildFilteredQuery($request)->pluck('id')->values();
        $selectedIds = collect($request->input('selected_ids', []))->map(fn ($id) => (int) $id)->values();

        if ($request->action === 'select_none') {
            $resolved = collect();
        } elseif ($request->action === 'select_all') {
            $resolved = $matchingIds;
        } else {
            $resolved = $matchingIds->diff($selectedIds)->values();
        }

        return response()->json([
            'action' => $request->action,
            'matching_count' => $matchingIds->count(),
            'selected_count' => $resolved->count(),
            'selected_ids' => $resolved,
        ]);
    }

    public function show(string $type, Subscription $subscription)
    {
        if ($subscription->type !== $type) {
            return response()->json(['message' => 'Subscriber type mismatch.'], 422);
        }

        $subscription->load([
            'country',
            'traineeDetail.stack',
            'traineeDetail.round',
            'trainerDetail.position',
            'companyDetail.companyField',
            'companyDetail.packageRange',
            'timeSlots',
            'files',
            'statusLogs.changedBy',
        ]);

        return new SubscriptionResource($subscription);
    }

    public function updateStatus(Request $request, Subscription $subscription)
    {
        $request->validate([
            'status' => ['required', Rule::in(['accepted', 'rejected', 'maybe'])],
            'scheduled_at' => 'required_if:status,accepted|nullable|date',
            'reason' => 'required_if:status,rejected,maybe|nullable|string',
        ]);

        $fromStatus = $subscription->status;

        $subscription->update([
            'status' => $request->status,
            'scheduled_at' => $request->status === 'accepted' ? $request->scheduled_at : null,
            'status_reason' => in_array($request->status, ['rejected', 'maybe']) ? $request->reason : null,
        ]);

        $subscription->statusLogs()->create([
            'from_status' => $fromStatus,
            'to_status' => $request->status,
            'reason' => $request->reason,
            'changed_by' => optional($request->user())->id,
        ]);

        SendSubscriptionEmailJob::dispatch(
            $subscription,
            $request->status,
            [
                'reason' => $request->reason,
                'scheduled_at' => $request->scheduled_at,
            ]
        );

        return response()->json([
            'message' => 'Subscriber status updated successfully.',
            'subscriber' => new SubscriptionResource(
                $subscription->fresh()->load($this->withRelations())
            ),
        ]);
    }

    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|exists:subscriptions,id',
            'status' => ['required', Rule::in(['rejected', 'maybe'])],
            'reason' => 'required|string',
        ]);

        $subscriptions = Subscription::query()->whereIn('id', $request->ids)->get();

        foreach ($subscriptions as $subscription) {
            $fromStatus = $subscription->status;

            $subscription->update([
                'status' => $request->status,
                'scheduled_at' => null,
                'status_reason' => $request->reason,
            ]);

            $subscription->statusLogs()->create([
                'from_status' => $fromStatus,
                'to_status' => $request->status,
                'reason' => $request->reason,
                'changed_by' => optional($request->user())->id,
            ]);

            SendSubscriptionEmailJob::dispatch(
                $subscription,
                $request->status,
                ['reason' => $request->reason]
            );
        }

        return response()->json([
            'message' => 'Bulk status update completed successfully.',
            'updated_count' => $subscriptions->count(),
        ]);
    }

    public function resendEmail(Request $request, Subscription $subscription)
    {
        $request->validate([
            'event_type' => ['nullable', Rule::in(['submitted', 'accepted', 'rejected', 'maybe'])],
            'reason' => 'nullable|string',
            'scheduled_at' => 'nullable|date',
        ]);

        $eventType = $request->input('event_type', $subscription->status === 'pending' ? 'submitted' : $subscription->status);

        SendSubscriptionEmailJob::dispatch(
            $subscription,
            $eventType,
            [
                'reason' => $request->input('reason', $subscription->status_reason),
                'scheduled_at' => $request->input('scheduled_at', optional($subscription->scheduled_at)?->toDateTimeString()),
            ]
        );

        return response()->json([
            'message' => 'Subscription email has been queued.',
            'event_type' => $eventType,
        ]);
    }
}
