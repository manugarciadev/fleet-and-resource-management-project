<?php

namespace App\Http\Controllers;

use App\Models\ContractType;
use App\Http\Requests\StoreContract_TypeRequest;
use App\Http\Requests\UpdateContract_TypeRequest;

class ContractTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contract_Type = ContractType::all();
        return $contract_Type;
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContract_TypeRequest $request)
    {
        $contract_Type = ContractType::create($request->all());
        return $contract_Type;
    }

    /**
     * Display the specified resource.
     */
    public function show(ContractType $ContractType)
    {
        return $ContractType;
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContract_TypeRequest $request, ContractType $ContractType)
    {
        $ContractType->update($request->all());
        return $ContractType;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContractType $ContractType)
    {
        $ContractType->delete();
        return ['msg' => 'O utilizador foi removido com sucesso'];
    }
}
