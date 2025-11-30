<?php

use App\Http\Controllers\AdvanceBillingController;
use App\Http\Controllers\AdvanceBillxController;
use App\Http\Controllers\BannedController;
use App\Http\Controllers\BarangayController;
use App\Http\Controllers\BatchBillingController;
use App\Http\Controllers\BatchxBillingController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\Collector\CDashboardController;
use App\Http\Controllers\Collector\CollectionController as CollectorCollectionController;
use App\Http\Controllers\CollectorController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerPlanController;
use App\Http\Controllers\DisconnectionController;
use App\Http\Controllers\Main\DashboardController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PurokController;
use App\Http\Controllers\SoaController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WalkinBillingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', 'login');



Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('/dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->name('dashboard');

    //============================= Admin Pages ========================================//
    Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/bill_card', function () {
            return Inertia::render('BillCard');
        })->name('bill_card');

        Route::resource('customers', CustomerController::class)->names('customers');
        Route::resource('collectors', CollectorController::class)->names('collectors');
        Route::resource('plans', PlanController::class)->names('plans');
        Route::resource('customer_plans', CustomerPlanController::class)->names('customer_plans');
        Route::resource('bills', BillController::class)->names('bills');
        Route::resource('walkin_bills', WalkinBillingController::class)->names('walkin_bills');
        Route::resource('advance_bills', AdvanceBillingController::class)->names('advance_bills');
        Route::resource('batch_bills', BatchBillingController::class)->names('batch_bills');
        Route::resource('transactions', TransactionController::class)->names('transactions');
        Route::resource('address', PurokController::class)->names('address');
        Route::resource('barangays', BarangayController::class)->names('barangays');


        Route::resource('disconnections', DisconnectionController::class)->names('disconnections');
        Route::resource('banned', BannedController::class)->names('banned');

        Route::get('/collections', [CollectionController::class, 'index'])->name('collections.index');
        Route::get('/collection-show', [CollectionController::class, 'show'])->name('collections.show');

        // Routes COllection Monthly and Yearly Collection
        Route::get('/collection-monthly', [CollectionController::class, 'monthly'])->name('collection.monthly');
        Route::get('/collection-yearly', [CollectionController::class, 'yearly'])->name('collection.yearly');


        // routes/web.php
        Route::get('/transactions/print/{id}', [TransactionController::class, 'print'])->name('transactions.print');


        Route::get('/soa', [SoaController::class, 'index'])->name('soa.index');

        Route::get('/generate-batch-bill', [BatchxBillingController::class, 'index'])->name('batch.bill');

        Route::resource('transactions-advance', AdvanceBillxController::class)->names('transaction.advance');
        Route::get('/advance/print/{id}', [AdvanceBillxController::class, 'print'])->name('advance.print');
    });







    //============================= Collector Pages ========================================//
    Route::middleware(['auth', 'role:collector'])->prefix('collector')->group(function () {
        Route::get('/dashboard', [CDashboardController::class, 'index'])->name('collector.dashboard');
        Route::get('collection', [CollectorCollectionController::class, 'index'])->name('collector.collection');
        Route::get('collection-create', [CollectorCollectionController::class, 'create'])->name('collector.collection.create');



        // Route::get('collection_list', [SoaController::class, 'index'])->name('collector.collection');
    });




    Route::get('/show_customers_plans/{id}/', [CustomerPlanController::class, 'ShowCustomerPlans'])
        ->name('show_customer_plans');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
