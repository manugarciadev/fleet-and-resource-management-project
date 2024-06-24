<?php

namespace App\Http\Controllers;

use App\Models\ManagingDirector;
use App\Http\Requests\StoreManagingDirectorRequest;
use App\Http\Requests\UpdateManagingDirectorRequest;

class ManagingDirectorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $managingDirectors = ManagingDirector::all();
        return response()->json(['managingDirectors' => $managingDirectors]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreManagingDirectorRequest $request)
    {
        $user = ManagingDirector::create($request->all());
        return $user;
    }

    /**
     * Display the specified resource.
     */
    public function show(ManagingDirector $managingDirector)
    {
    
        return response()->json(['managingDirector' => $managingDirector]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateManagingDirectorRequest $request, ManagingDirector $managingDirector)
    {
        $managingDirector->update($request->all());
        return $managingDirector;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ManagingDirector $managingDirector)
    {
        $managingDirector->delete();
        return response()->json(['message' => 'Managing Director deleted successfully'], 204);
    }
}
