<?php

use App\Http\Controllers\BookingForPayoutController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\ContractTypeController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HumanResourceController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\LogActivityController;
use App\Http\Controllers\MaterialResourceController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\PaymentAndTaxDetailController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RenovationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\ResourceTypeController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\ProofController;
use App\Models\ResourceType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::apiResource('users', UserController::class);
Route::apiResource('resources', ResourceController::class);
Route::apiResource('contract_types', ContractTypeController::class);
Route::apiResource('contracts', ContractController::class);

    // Rotas para o PartnerController
    Route::apiResource('partners', PartnerController::class);

    // Rotas para Managing Directors associados aos Partners
    Route::post('partners/{partner}/managing-directors', [PartnerController::class, 'storeManagingDirector'])
         ->name('partners.managing-directors.store');

    Route::get('partners/{partner}/managing-directors/{managingDirector}', [PartnerController::class, 'showManagingDirector'])
         ->name('partners.managing-directors.show');

    Route::put('partners/{partner}/managing-directors/{managingDirector}', [PartnerController::class, 'updateManagingDirector'])
         ->name('partners.managing-directors.update');

    Route::delete('partners/{partner}/managing-directors/{managingDirector}', [PartnerController::class, 'destroyManagingDirector'])
         ->name('partners.managing-directors.destroy');

Route::apiResource('invoices', InvoiceController::class);
Route::apiResource('paymentAndTaxDetails', PaymentAndTaxDetailController::class);
Route::apiResource('renovations', RenovationController::class);
Route::apiResource('documents', DocumentController::class);
Route::get('documents/{id}/download', [DocumentController::class, 'download'])->name('documents.download');
Route::apiResource('employees', EmployeeController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('bookingForPayouts', BookingForPayoutController::class);
Route::apiResource('resource_types', ResourceTypeController::class);
Route::apiResource('subscriptions', SubscriptionController::class);
Route::get('/images/{filename}', [ProofController::class, 'show'])->name('images.show');
//Route::get('images/{filename}', 'ImageController@show')->name('image.show');
Route::apiResource('humanResources', HumanResourceController::class); 
Route::apiResource('materialResources', MaterialResourceController::class); 
Route::apiResource('log_activities', LogActivityController::class);


