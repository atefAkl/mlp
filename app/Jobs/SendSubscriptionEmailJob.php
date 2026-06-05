<?php

namespace App\Jobs;

use App\Mail\SubscriptionAcceptedMail;
use App\Mail\SubscriptionMaybeMail;
use App\Mail\SubscriptionRejectedMail;
use App\Mail\SubscriptionSubmittedMail;
use App\Models\Subscription;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendSubscriptionEmailJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 5;

    public int $maxExceptions = 3;

    public function backoff(): array
    {
        return [10, 30, 120, 300];
    }

    public function __construct(
        public Subscription $subscription,
        public string $eventType,
        public array $payload = []
    ) {
        $this->onQueue('emails');
    }

    public function handle(): void
    {
        $this->subscription->loadMissing([
            'country',
            'traineeDetail.stack',
            'traineeDetail.round',
            'trainerDetail.position',
            'companyDetail.companyField',
            'companyDetail.packageRange',
            'timeSlots',
            'files',
        ]);

        $email = $this->subscription->email;

        if ($this->eventType === 'submitted') {
            Mail::to($email)->send(new SubscriptionSubmittedMail($this->subscription));

            return;
        }

        if ($this->eventType === 'accepted') {
            Mail::to($email)->send(
                new SubscriptionAcceptedMail(
                    $this->subscription,
                    $this->payload['scheduled_at'] ?? null
                )
            );

            return;
        }

        if ($this->eventType === 'rejected') {
            Mail::to($email)->send(
                new SubscriptionRejectedMail(
                    $this->subscription,
                    (string) ($this->payload['reason'] ?? '')
                )
            );

            return;
        }

        if ($this->eventType === 'maybe') {
            Mail::to($email)->send(
                new SubscriptionMaybeMail(
                    $this->subscription,
                    (string) ($this->payload['reason'] ?? '')
                )
            );
        }
    }

    public function failed(Throwable $exception): void
    {
        Log::error('Failed to send subscription email job', [
            'subscription_id' => $this->subscription->id,
            'event_type' => $this->eventType,
            'error' => $exception->getMessage(),
        ]);
    }
}
