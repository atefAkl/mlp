<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index()
    {
        return response()->json(Permission::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name',
            'description' => 'nullable|string',
            'group' => 'required|string',
        ]);

        $permission = Permission::create([
            'name' => $request->name, 
            'description' => $request->description,
            'group' => $request->group,
            'guard_name' => 'web'
        ]);

        return response()->json([
            'message' => 'Permission created successfully',
            'permission' => $permission
        ], 201);
    }

    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name,' . $permission->id,
            'description' => 'nullable|string',
            'group' => 'required|string',
        ]);

        $permission->name = $request->name;
        $permission->description = $request->description;
        $permission->group = $request->group;
        $permission->save();

        return response()->json([
            'message' => 'Permission updated successfully',
            'permission' => $permission
        ]);
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();
        return response()->json(['message' => 'Permission deleted successfully']);
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:permissions,id'
        ]);

        Permission::whereIn('id', $request->ids)->delete();

        return response()->json(['message' => 'Permissions deleted successfully']);
    }
}
