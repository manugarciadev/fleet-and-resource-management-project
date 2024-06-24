<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\Subscription;
use App\Http\Requests\StoreSubscriptionRequest;
use App\Http\Requests\UpdateSubscriptionRequest;

class SubscriptionController extends Controller
{
    private $subscription;

    public function __construct(Subscription $subscription)
    {
        $this->subscription = $subscription;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subscription = Subscription::all();
        return $subscription;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSubscriptionRequest $request)
    {
        $file = $request->file('proof');
        $file_urn = $file->store('proof', 'public');

        $subscription = $this->subscription->create([
            'signatureDate' =>  $request->signatureDate, 
            'validity'      =>  $request->validity,
            'proof'         =>  $file_urn,  
        ]);

        return response()->json($subscription, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Subscription $subscription)
    {
        return $subscription;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSubscriptionRequest $request, Subscription $subscription)
    {
        try {

            
            if ($request->hasFile('proof')) {
                // Armazena o novo arquivo de livrete
                $file = $request->file('proof');
                $file_urn = $file->store('proof', 'public');
                
            }
    
            $subscription->update([
                'signatureDate' =>  $request->signatureDate, 
                'validity'      =>  $request->validity,
                'proof'         =>  $file_urn
               
            ]);
 
            return response()->json($subscription, 201);


        } catch (\Exception $e) {
            Log::error('Erro de autorização: ' . $e->getMessage());
            throw $e;
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subscription $subscription)
    {
        if ($subscription->proof) {
            // Exclui a imagem antiga
            Storage::disk('public')->delete($subscription->proof);
        }

        $subscription->delete();
        return ['msg' => 'O proof  foi removido com sucesso'];
    }
}
