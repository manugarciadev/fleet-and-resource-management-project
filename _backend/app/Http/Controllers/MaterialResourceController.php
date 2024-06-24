<?php

namespace App\Http\Controllers;

use App\Models\MaterialResource;
use App\Http\Requests\StoreMaterialResourceRequest;
use App\Http\Requests\UpdateMaterialResourceRequest;

class MaterialResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $materialResources = MaterialResource::all();
       // return $materialResources;

        $humanResources = MaterialResource::with('resource')->get();
        return response()->json($humanResources);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMaterialResourceRequest $request)
    {
        $materialResources = MaterialResource::create($request->all());
        return $materialResources;
    }

    /**
     * Display the specified resource.
     */
    public function show(MaterialResource $materialResource)
    {
        return $materialResource;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMaterialResourceRequest $request, MaterialResource $materialResource)
    {
        $materialResource->update($request->all());
        return $materialResource;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MaterialResource $materialResource)
    {
        $materialResource->delete();
        return ['msg' => 'Material Resource foi removido com sucesso'];
    }
}
