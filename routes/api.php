<?php

use App\Http\Controllers\AdvanceBillingController;
use App\Http\Controllers\BannedController;
use App\Http\Controllers\BarangayController;
use App\Http\Controllers\BatchBillingController;
use App\Http\Controllers\BatchxBillingController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\CollectorController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerPlanController;
use App\Http\Controllers\DisconnectionController;
use App\Http\Controllers\Main\DashboardController;
use App\Http\Controllers\MunicipalityController;
use App\Http\Controllers\PurokController;
use App\Http\Controllers\SoaController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WalkinBillingController;
use App\Models\Collector;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RawCollectionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('get_customerx_paginate', [CustomerController::class, 'indexApi']);
Route::get('get_collectorx_paginate', [CollectorController::class, 'indexApi']);
Route::get('get_customer_planx_paginate', [CustomerPlanController::class, 'indexApi']);
Route::get('get_billx_paginate', [BillController::class, 'indexApi']);
Route::get('get_address', [PurokController::class, 'indexApi']);
Route::get('get_barangays', [BarangayController::class, 'indexApi']);




Route::get('get_customerwplanx', [BillController::class, 'getCustomersWithPlans']);
Route::get('get_walkinbillx', [WalkinBillingController::class, 'indexApi']);
Route::get('get_advancebillx', [AdvanceBillingController::class, 'indexApi']);
Route::get('get_batchbillx', [BatchBillingController::class, 'indexApi']);


Route::get('/customers/{id}/transactions', [CustomerController::class, 'showCustomerTransaction']);
// Get the latest transaction
// Route::get('/transaction/{description}/transaction', [TransactionController::class, 'showTransaction']); 
Route::post('/transactions', [TransactionController::class, 'storeTransaction']);
Route::get('/customers/transactions', [CustomerController::class, 'customerTransactions']);
Route::get('get_transactions', [TransactionController::class, 'indexApi']);


//disconnection
Route::get('customer_disconnection', [DisconnectionController::class, 'indexApi']);

//banned
Route::get('customer_banned', [BannedController::class, 'indexApi']);

//options
Route::get('barangay_options', [BarangayController::class, 'barangayOptions']);
Route::get('purok_options', [PurokController::class, 'purokOptions']);
Route::get('municipality_options', [MunicipalityController::class, 'municipalityOptions']);


//Collectors collection
Route::get('/collectors/total-collected', [CollectorController::class, 'totalCollected']);
Route::get('/raw_collections', [CollectorController::class, 'totalCollectedRaw']);


// routes/api.php
Route::get('/transactions/generate-bill-no', [TransactionController::class, 'generateBillNo']);

Route::get('/customers/{id}/soa', [SoaController::class, 'getSoa']);
Route::get('/customer_soa', [SoaController::class, 'searchSoa']);


Route::post('/batch-billing/generate/{batchNo}', [BatchxBillingController::class, 'generateBatch'])->name('batch.generate');

Route::get('/batch-unpaid/{batchNo}', [BatchxBillingController::class, 'getUnpaidByBatchMonthYear']);


//===remarks = adavance section
Route::get('/transactions-advance', [TransactionController::class, 'indexApiAdvance']);


Route::get('/customers/{customerId}/latest-plan', [BillController::class, 'getLatestPlanForCustomer']);
Route::get('/hello', function () {
    return response()->json(['message' => 'Hello World']);
});


//dashboard collection
Route::get('/total-collection', [DashboardController::class, 'getTotalCollection']);
Route::get('/transaction-summary', [DashboardController::class, 'transactionSummary']);

Route::get('/municipalities', [MunicipalityController::class, 'municipalitiesWithBarangays']);
Route::get('/municipalities/{id}/barangays', [MunicipalityController::class, 'barangaysByMunicipality']);
Route::get('/customers/count-by-municipality', [MunicipalityController::class, 'countByMunicipality']);


Route::get('/collectors', function () {
    return Collector::select('id', 'firstname')->get();
});


