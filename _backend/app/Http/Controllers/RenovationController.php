<?php

namespace App\Http\Controllers;

use App\Models\Renovation;
use App\Http\Requests\StoreRenovationRequest;
use App\Http\Requests\UpdateRenovationRequest;

class RenovationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $renovation = Renovation::all();
        return $renovation;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRenovationRequest $request)
    {
        $renovation = Renovation::create($request->all());
        return $renovation;
    }

    /**
     * Display the specified resource.
     */
    public function show(Renovation $renovation)
    {
        return $renovation;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRenovationRequest $request, Renovation $renovation)
    {
        $renovation->update($request->all());
        return $renovation;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Renovation $renovation)
    {
        $renovation->delete();
        return ['msg' => 'Renovation foi removido com sucesso'];
    }
}
