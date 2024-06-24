<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Models\ManagingDirector;
use App\Http\Requests\StorePartnerRequest;
use App\Http\Requests\UpdatePartnerRequest;
use App\Http\Requests\StoreManagingDirectorRequest;
use App\Http\Requests\UpdateManagingDirectorRequest;
use Illuminate\Support\Facades\Validator;

class PartnerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $partners = Partner::all();
        return response()->json(['partners' => $partners]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePartnerRequest $request)
    {
        $validator = Validator::make($request->all(), [
            'legal_name' => 'required|string',
            'logo' => 'required|string',
            'public_name' => 'required|string',
            'description' => 'required|string',
            'street_address' => 'required|string',
            'city' => 'required|string',
            'postal_code' => 'required|string',
            'email' => 'required|email',
            'company_registration_number' => 'required|string',
            'mobile_phone' => 'nullable|string',
            'emergency_phone_number' => 'nullable|string',
            'state_region' => 'nullable|string',
            'country_code' => 'nullable|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }
    
        $partnerData = $request->only([
            'legal_name',
            'logo',
            'public_name',
            'description',
            'street_address',
            'city',
            'postal_code',
            'email',
            'company_registration_number',
            'mobile_phone',
            'emergency_phone_number',
            'state_region',
            'country_code',
        ]);
    
        // Verificar e incluir website_and_social_media se estiver presente no request
        if ($request->has('website_and_social_media')) {
            $partnerData['website_and_social_media'] = $request->input('website_and_social_media');
        }
    
        $partner = Partner::create($partnerData);
    
        return response()->json(['partner' => $partner, 'message' => 'Partner created successfully'], 201);
    }
    /**
     * Display the specified resource.
     */
    public function show(Partner $partner)
    {
       
        return response()->json(['partner' => $partner]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePartnerRequest $request, Partner $partner)
    {
        // Validação dos dados
        $validator = Validator::make($request->all(), [
            'legal_name' => 'required|string',
            'logo' => 'required|string',
            'public_name' => 'required|string',
            'description' => 'required|string',
            'street_address' => 'required|string',
            'city' => 'required|string',
            'postal_code' => 'required|string',
            'email' => 'required|email',
            'company_registration_number' => 'required|string',
            'mobile_phone' => 'nullable|string',
            'emergency_phone_number' => 'nullable|string',
            'state_region' => 'nullable|string',
            'country_code' => 'nullable|string',
            'managing_directors' => 'required|array',
            'managing_directors.*.id' => 'required|integer|exists:managing_directors,id',
            'managing_directors.*.first_name' => 'required|string',
            'managing_directors.*.last_name' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }
    
        // Atualizando os dados do parceiro
        $partnerData = $request->except('managing_directors');
        $managingDirectorsData = $request->input('managing_directors');
        $partner->update($partnerData);
    
        // Atualizando os dados dos diretores gerentes
        foreach ($managingDirectorsData as $managingDirectorData) {
            $managingDirector = ManagingDirector::find($managingDirectorData['id']);
            $managingDirector->update($managingDirectorData);
        }
    
        // Retornando resposta com os dados atualizados
        return response()->json(['partner' => $partner->load('managingDirectors'), 'message' => 'Partner updated successfully'], 200);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Partner $partner)
    {
        $partner->delete();
        return response()->json(['message' => 'Partner deleted successfully'], 204);
    }



    /**
     * Store a newly created managing director for a partner.
     *
     * @param  \App\Http\Requests\StoreManagingDirectorRequest  $request
     * @param  \App\Models\Partner  $partner
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeManagingDirector(StoreManagingDirectorRequest $request, Partner $partner)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string',
            'last_name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $managingDirector = $partner->managingDirectors()->create($request->all());

        return response()->json(['managing_director' => $managingDirector, 'message' => 'Managing Director created successfully'], 201);
    }

    /**
     * Display the specified managing director.
     *
     * @param  \App\Models\Partner  $partner
     * @param  \App\Models\ManagingDirector  $managingDirector
     * @return \Illuminate\Http\JsonResponse
     */
    public function showManagingDirector(Partner $partner, ManagingDirector $managingDirector)
    {
        // Verifica se o Managing Director pertence ao Partner específico
        if ($managingDirector->partner_id !== $partner->id) {
            return response()->json(['error' => 'Managing Director not found for this Partner'], 404);
        }

        return response()->json(['managing_director' => $managingDirector]);
    }

    /**
     * Update the specified managing director in storage.
     *
     * @param  \App\Http\Requests\UpdateManagingDirectorRequest  $request
     * @param  \App\Models\Partner  $partner
     * @param  \App\Models\ManagingDirector  $managingDirector
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateManagingDirector(UpdateManagingDirectorRequest $request, Partner $partner, ManagingDirector $managingDirector)
    {
        // Verifica se o Managing Director pertence ao Partner específico
        if ($managingDirector->partner_id !== $partner->id) {
            return response()->json(['error' => 'Managing Director not found for this Partner'], 404);
        }
    
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string',
            'last_name' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }
    
        $managingDirector->update($request->all());
    
        // Carrega novamente o managing director após a atualização
        $managingDirector->refresh();
    
        return response()->json(['managing_director' => $managingDirector, 'message' => 'Managing Director updated successfully'], 200);
    }
    /**
     * Remove the specified managing director from storage.
     *
     * @param  \App\Models\Partner  $partner
     * @param  \App\Models\ManagingDirector  $managingDirector
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroyManagingDirector(Partner $partner, ManagingDirector $managingDirector)
    {
        // Verifica se o Managing Director pertence ao Partner específico
        if ($managingDirector->partner_id !== $partner->id) {
            return response()->json(['error' => 'Managing Director not found for this Partner'], 404);
        }

        $managingDirector->delete();

        return response()->json(['message' => 'Managing Director deleted successfully'], 204);
    }
}
