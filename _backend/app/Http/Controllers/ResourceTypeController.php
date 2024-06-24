<?php

namespace App\Http\Controllers;

use App\Models\ResourceType;
use App\Http\Requests\StoreResourceTypeRequest;
use App\Http\Requests\UpdateResourceTypeRequest;

class ResourceTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $resourceType = ResourceType::all();
        return $resourceType;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreResourceTypeRequest $request)
    {
        $resourceType = ResourceType::create($request->all());
        return $resourceType;
    }

    /**
     * Display the specified resource.
     */
    public function show(ResourceType $resourceType)
    {
        return $resourceType;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateResourceTypeRequest $request, ResourceType $resourceType)
    {
        $resourceType->update($request->all());
        return $resourceType;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ResourceType $resourceType)
    {
        $resourceType->delete();
        return ['msg' => 'O Resource Type foi removido com sucesso'];
    }
}
