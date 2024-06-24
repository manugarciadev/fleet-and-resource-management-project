<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Http\Requests\StoreContractRequest;
use App\Http\Requests\UpdateContractRequest;

class ContractController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $resources = Contract::with('contractType', 'partner', 'employee.user')->get();
        return response()->json($resources);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContractRequest $request)
    {
        $contract = Contract::create($request->all());
        return $contract;
    }

    /**
     * Display the specified resource.
     */
    public function show(Contract $contract)
    {
        return $contract;
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContractRequest $request, Contract $contract)
    {
        $contract->update($request->all());
        return $contract;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contract $contract)
    {
        $contract->delete();
        return ['msg' => 'O contrato foi removido com sucesso'];
    }
}
