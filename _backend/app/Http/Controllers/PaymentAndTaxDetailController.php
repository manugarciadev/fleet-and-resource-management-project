<?php

namespace App\Http\Controllers;

use App\Models\PaymentAndTaxDetail;
use App\Http\Requests\StorePaymentAndTaxDetailRequest;
use App\Http\Requests\UpdatePaymentAndTaxDetailRequest;
use Illuminate\Support\Facades\DB;

class PaymentAndTaxDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $paymentAndTaxDetail = PaymentAndTaxDetail::all();
        return $paymentAndTaxDetail;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentAndTaxDetailRequest $request)
    {
            $data = $request->only(['invoice_id', 'vat_number', 'contry_of_issue', 'tax_number', 'tin_country_of_issue', 'payment_data_status', 'payment_method', 'payment_frequency', 'commission_rate', 'currency']);
            $paymentAndTaxDetail = PaymentAndTaxDetail::create($data);
            return $paymentAndTaxDetail; 
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentAndTaxDetail $paymentAndTaxDetail)
    {
        return $paymentAndTaxDetail;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentAndTaxDetailRequest $request, PaymentAndTaxDetail $paymentAndTaxDetail)
    {
        $paymentAndTaxDetail->update($request->all());
        return $paymentAndTaxDetail;
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentAndTaxDetail $paymentAndTaxDetail)
    {
        $paymentAndTaxDetail->delete();
        return ['msg' => 'Payment and tax detail foi removido com sucesso'];
    }
}
