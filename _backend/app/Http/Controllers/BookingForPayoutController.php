<?php

namespace App\Http\Controllers;

use App\Models\BookingForPayout;
use App\Http\Requests\StoreBookingForPayoutRequest;
use App\Http\Requests\UpdateBookingForPayoutRequest;

class BookingForPayoutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookingForPayouts = BookingForPayout::all();
        return $bookingForPayouts;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingForPayoutRequest $request)
    {
        $bookingForPayout = BookingForPayout::create($request->all());
        return $bookingForPayout;
    }

    /**
     * Display the specified resource.
     */
    public function show(BookingForPayout $bookingForPayout)
    {
        return $bookingForPayout;
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingForPayoutRequest $request, BookingForPayout $bookingForPayout)
    {
        $bookingForPayout->update($request->all());
        return $bookingForPayout;
    
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BookingForPayout $bookingForPayout)
    {
        $bookingForPayout->delete();
        return ['msg' => 'BookingForPayout foi removido com sucesso'];
    }
}
