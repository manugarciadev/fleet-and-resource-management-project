<?php

namespace App\Http\Controllers;

use App\Models\LogActivity;
use App\Http\Requests\StoreLogActivityRequest;
use App\Http\Requests\UpdateLogActivityRequest;

class LogActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $logActivities = LogActivity::all();
            return response()->json($logActivities, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

   

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLogActivityRequest $request)
    {
        try {
            $logActivity = LogActivity::create($request->all());
            return response()->json($logActivity, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(LogActivity $logActivity)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLogActivityRequest $request, LogActivity $logActivity)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LogActivity $logActivity)
    {
        //
    }
}
