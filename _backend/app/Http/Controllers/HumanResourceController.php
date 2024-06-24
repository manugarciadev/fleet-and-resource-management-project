<?php

namespace App\Http\Controllers;

use App\Models\HumanResource;
use App\Http\Requests\StoreHumanResourceRequest;
use App\Http\Requests\UpdateHumanResourceRequest;

class HumanResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //$humanResources = HumanResource::all();
        //return $humanResources;

        $humanResources = HumanResource::with('resource', 'employee.user')->get();
        return response()->json($humanResources);
    }

  
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHumanResourceRequest $request)
    {
        $humanResources = HumanResource::create($request->all());
        return $humanResources;
    }

    /**
     * Display the specified resource.
     */
    public function show(HumanResource $humanResource)
    {
        return $humanResource;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHumanResourceRequest $request, HumanResource $humanResource)
    {
        $humanResource->update($request->all());
        return $humanResource;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HumanResource $humanResource)
    {
        $humanResource->delete();
        return ['msg' => 'Human Resource foi removido com sucesso'];
    }
}
