<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Http\Requests\StoreResourceRequest;
use App\Http\Requests\UpdateResourceRequest;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $resource = Resource::all();
        return $resource;
     
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreResourceRequest $request)
    {
        $resource = Resource::create($request->all());
        return $resource;
    }

    /**
     * Display the specified resource.
     */
    public function show(Resource $resource)
    {
        return $resource;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateResourceRequest $request, Resource $resource)
    {
        $resource->update($request->all());
        return $resource;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resource $resource)
    {
        $resource->delete();
        return ['msg' => 'O utilizador foi removido com sucesso'];
    }
}
