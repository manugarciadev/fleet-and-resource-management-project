<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

class ProofController extends Controller
{
    public function show($filename)
    {
        $path = storage_path('app/public/proof/' . $filename);

        if (!Storage::exists($path)) {
            abort(404);
        }

        return response()->file($path);
    }
}