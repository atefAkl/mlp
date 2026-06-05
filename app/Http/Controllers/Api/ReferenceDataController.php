<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CompanyField;
use App\Models\Country;
use App\Models\PackageRange;
use App\Models\Position;
use App\Models\Round;
use App\Models\Stack;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReferenceDataController extends Controller
{
    private function modelMap(): array
    {
        return [
            'countries' => Country::class,
            'stacks' => Stack::class,
            'positions' => Position::class,
            'rounds' => Round::class,
            'company_fields' => CompanyField::class,
            'package_ranges' => PackageRange::class,
        ];
    }

    private function resolveModel(string $resource): string
    {
        $map = $this->modelMap();

        if (!array_key_exists($resource, $map)) {
            abort(404, 'Reference resource not found.');
        }

        return $map[$resource];
    }

    public function index()
    {
        return response()->json([
            'countries' => Country::query()->orderBy('name')->get(),
            'stacks' => Stack::query()->orderBy('name')->get(),
            'positions' => Position::query()->orderBy('name')->get(),
            'rounds' => Round::query()->orderBy('name')->get(),
            'company_fields' => CompanyField::query()->orderBy('name')->get(),
            'package_ranges' => PackageRange::query()->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request, string $resource)
    {
        $modelClass = $this->resolveModel($resource);

        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique((new $modelClass())->getTable(), 'name'),
            ],
        ]);

        $item = $modelClass::query()->create([
            'name' => $request->name,
        ]);

        return response()->json($item, 201);
    }

    public function update(Request $request, string $resource, int $id)
    {
        $modelClass = $this->resolveModel($resource);
        $item = $modelClass::query()->findOrFail($id);

        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique((new $modelClass())->getTable(), 'name')->ignore($item->id),
            ],
        ]);

        $item->update([
            'name' => $request->name,
        ]);

        return response()->json($item);
    }

    public function destroy(string $resource, int $id)
    {
        $modelClass = $this->resolveModel($resource);
        $item = $modelClass::query()->findOrFail($id);
        $item->delete();

        return response()->json([
            'message' => 'Reference item deleted successfully.',
        ]);
    }
}
