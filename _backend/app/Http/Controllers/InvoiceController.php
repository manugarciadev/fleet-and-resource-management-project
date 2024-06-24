<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $invoices = Invoice::all();
        return $invoices;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInvoiceRequest $request)
    {
        $invoices = Invoice::create($request->all());
        return $invoices;
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        return $invoice;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInvoiceRequest $request, Invoice $invoice)
    {
        $invoice->update([
            'bookingForPayouts_id' => $request->bookingForPayouts_id,
            'invoice_number' => $request->invoice_number,
            'issue_date' => $request->issue_date,
            'due_date' => $request->due_date,
            'period' => $request->issue_date . ' - ' . $request->due_date,
            'value' => $request->value,
        ]);

        return $invoice;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return ['msg' => 'A fatura foi removido com sucesso'];
    }
}
