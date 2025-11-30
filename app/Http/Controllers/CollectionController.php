<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CollectionController extends Controller
{
    public function show(Request $request)
{
    $query = Transaction::with([
        'customerPlan.plan',
        'customerPlan.collector',
        'customerPlan.customer.purok.barangay.municipality',
    ]);

    /*
    |---------------------------------------------------------------------------
    | MONTHLY + YEARLY SELECT FILTER
    | Example:
    |   selected_month = 3   (March)
    |   selected_year  = 2024
    |
    | Priority: USED BEFORE period filter (daily/monthly/yearly)
    |---------------------------------------------------------------------------
    */
    if ($request->filled('selected_month') || $request->filled('selected_year')) {

        // Use provided year or fallback to current
        $year = $request->selected_year ?? now()->year;

        // If month is provided
        if ($request->filled('selected_month')) {

            $month = $request->selected_month;

            $start = now()->setYear($year)->setMonth($month)->startOfMonth()->toDateString();
            $end   = now()->setYear($year)->setMonth($month)->endOfMonth()->toDateString();

            $query->whereBetween('date_billing', [$start, $end]);
        } 
        // If ONLY year is selected
        else {

            $start = now()->setYear($year)->startOfYear()->toDateString();
            $end   = now()->setYear($year)->endOfYear()->toDateString();

            $query->whereBetween('date_billing', [$start, $end]);
        }
    }

    /*
    |---------------------------------------------------------------------------
    | PERIOD FILTER (daily, monthly, yearly) — only applies when no month/year
    |--------------------------------------------------------------------------- 
    */
    elseif ($request->filled('period') &&
        !$request->filled('start_date') &&
        !$request->filled('end_date')) {

        if ($request->period === 'daily') {
            $start = now()->startOfDay()->toDateString();
            $end   = now()->endOfDay()->toDateString();
        }

        if ($request->period === 'monthly') {
            $start = now()->startOfMonth()->toDateString();
            $end   = now()->endOfMonth()->toDateString();
        }

        if ($request->period === 'yearly') {
            $start = now()->startOfYear()->toDateString();
            $end   = now()->endOfYear()->toDateString();
        }

        $query->whereBetween('date_billing', [$start, $end]);
    }

    /*
    |---------------------------------------------------------------------------
    | CUSTOM DATE RANGE FILTER (highest priority)
    |---------------------------------------------------------------------------
    */
    elseif ($request->filled('start_date') && $request->filled('end_date')) {
        $query->whereBetween('date_billing', [
            $request->start_date,
            $request->end_date
        ]);
    } elseif ($request->filled('start_date')) {
        $query->whereDate('date_billing', '>=', $request->start_date);
    } elseif ($request->filled('end_date')) {
        $query->whereDate('date_billing', '<=', $request->end_date);
    }

    /*
    |---------------------------------------------------------------------------
    | DEFAULT: SHOW TODAY'S COLLECTION
    |---------------------------------------------------------------------------
    */
    else {
        $today = now()->toDateString();
        $query->whereDate('date_billing', $today);
    }

    /*
    |---------------------------------------------------------------------------
    | ADDITIONAL FILTERS
    |---------------------------------------------------------------------------
    */
    if ($request->filled('collector_id')) {
        $query->where('collector_id', $request->collector_id);
    }

    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    if ($request->filled('description')) {
        $query->where('description', $request->description);
    }

    /*
    |---------------------------------------------------------------------------
    | FETCH RESULTS
    |---------------------------------------------------------------------------
    */
    $transactions = $query->get();

    /*
    |---------------------------------------------------------------------------
    | COMPUTE OUTSTANDING BALANCE
    |---------------------------------------------------------------------------
    */
    $transactions->transform(function ($transaction) {
        $transaction->outstanding_balance =
            ($transaction->bill_amount ?? 0) - ($transaction->partial ?? 0);
        return $transaction;
    });

    /*
    |---------------------------------------------------------------------------
    | GRAND TOTALS
    |---------------------------------------------------------------------------
    */
    $grandTotals = [
        'bill_amount' => $transactions->sum('bill_amount'),
        'partial'     => $transactions->sum('partial'),
        'rebate'      => $transactions->sum('rebate'),
        'balance'     => $transactions->sum('outstanding_balance'),
    ];

    /*
    |---------------------------------------------------------------------------
    | RETURN TO INERTIA
    |---------------------------------------------------------------------------
    */
    return Inertia::render('Collection/Show', [
        'transactions' => $transactions,
        'filters' => [
            'period'          => $request->period ?? null,
            'selected_month'  => $request->selected_month ?? null,
            'selected_year'   => $request->selected_year ?? null,
            'start_date'      => $request->start_date ?? null,
            'end_date'        => $request->end_date ?? null,
            'collector_id'    => $request->collector_id ?? null,
            'status'          => $request->status ?? null,
            'description'     => $request->description ?? null,
        ],
        'grand_totals' => $grandTotals,
    ]);
}


    // public function show(Request $request)
    // {
    //     $query = Transaction::with([
    //         'customerPlan.plan',
    //         'customerPlan.collector',
    //         'customerPlan.customer.purok.barangay.municipality',
    //     ]);

    //     // ✅ Filter by custom start_date and end_date
    //     if ($request->filled('start_date') && $request->filled('end_date')) {
    //         $query->whereBetween('date_billing', [
    //             $request->start_date,
    //             $request->end_date
    //         ]);
    //     } elseif ($request->filled('start_date')) {
    //         $query->whereDate('date_billing', '>=', $request->start_date);
    //     } elseif ($request->filled('end_date')) {
    //         $query->whereDate('date_billing', '<=', $request->end_date);
    //     } else {
    //         // ✅ default to today if no params
    //         $today = now()->toDateString();
    //         $query->whereDate('date_billing', $today);
    //     }

    //     // ✅ Filter by collector_id if provided
    //     if ($request->filled('collector_id')) {
    //         $query->where('collector_id', $request->collector_id);
    //     }

    //     // ✅ Filter by status if provided
    //     if ($request->filled('status')) {
    //         $query->where('status', $request->status);
    //     }

    //     // ✅ Fetch all transactions without pagination
    //     $transactions = $query->get();

    //     // ✅ Compute outstanding balance (bill_amount - partial)
    //     $transactions->transform(function ($transaction) {
    //         $transaction->outstanding_balance = ($transaction->bill_amount ?? 0) - ($transaction->partial ?? 0);
    //         return $transaction;
    //     });

    //     // ✅ Compute grand totals
    //     $grandTotalPartial = $transactions->sum('partial');
    //     $grandTotalRebate = $transactions->sum('rebate');

    //     return Inertia::render('Collection/Show', [
    //         'transactions' => $transactions,
    //         'filters' => [
    //             'start_date'   => $request->start_date ?? now()->toDateString(),
    //             'end_date'     => $request->end_date ?? now()->toDateString(),
    //             'collector_id' => $request->collector_id ?? null,
    //             'status'       => $request->status ?? null,
    //         ],
    //         'grand_totals' => [
    //             'partial' => $grandTotalPartial,
    //             'rebate'  => $grandTotalRebate,
    //         ],
    //     ]);
    // }


    // public function show(Request $request)
    // {
    //     $query = Transaction::with([
    //         'customerPlan.plan',
    //         'customerPlan.collector',
    //         'customerPlan.customer.purok.barangay.municipality',
    //     ]);

    //     // ✅ Filter by custom start_date and end_date
    //     if ($request->filled('start_date') && $request->filled('end_date')) {
    //         $query->whereBetween('date_billing', [
    //             $request->start_date,
    //             $request->end_date
    //         ]);
    //     } elseif ($request->filled('start_date')) {
    //         $query->whereDate('date_billing', '>=', $request->start_date);
    //     } elseif ($request->filled('end_date')) {
    //         $query->whereDate('date_billing', '<=', $request->end_date);
    //     } else {
    //         // ✅ default to today if no params
    //         $today = now()->toDateString();
    //         $query->whereDate('date_billing', $today);
    //     }

    //     // ✅ Filter by collector_id if provided
    //     if ($request->filled('collector_id')) {
    //         $query->where('collector_id', $request->collector_id);
    //     }

    //     // ✅ Fetch all transactions without pagination
    //     $transactions = $query->get();

    //     // ✅ Compute outstanding balance (bill_amount - partial)
    //     $transactions->transform(function ($transaction) {
    //         $transaction->outstanding_balance = ($transaction->bill_amount ?? 0) - ($transaction->partial ?? 0);
    //         return $transaction;
    //     });

    //     // ✅ Compute grand totals
    //     $grandTotalPartial = $transactions->sum('partial');
    //     $grandTotalRebate = $transactions->sum('rebate');

    //     return Inertia::render('Collection/Show', [
    //         'transactions' => $transactions,
    //         'filters' => [
    //             'start_date' => $request->start_date ?? now()->toDateString(),
    //             'end_date' => $request->end_date ?? now()->toDateString(),
    //             'collector_id' => $request->collector_id ?? null,
    //         ],
    //         'grand_totals' => [
    //             'partial' => $grandTotalPartial,
    //             'rebate' => $grandTotalRebate,
    //         ],
    //     ]);
    // }



    public function index()
    {
        return Inertia::render('Collection/Index');
    }

    // public function show(Request $request)
    // {
    //     $query = Transaction::with([
    //         'customerPlan.plan',
    //         'customerPlan.collector',
    //         'customerPlan.customer.purok.barangay.municipality',
    //     ]);

    //     // ✅ Filter by custom start_date and end_date
    //     if ($request->filled('start_date') && $request->filled('end_date')) {
    //         $query->whereBetween('date_billing', [
    //             $request->start_date,
    //             $request->end_date
    //         ]);
    //     } elseif ($request->filled('start_date')) {
    //         $query->whereDate('date_billing', '>=', $request->start_date);
    //     } elseif ($request->filled('end_date')) {
    //         $query->whereDate('date_billing', '<=', $request->end_date);
    //     } else {
    //         // ✅ default to today if no params
    //         $today = now()->toDateString();
    //         $query->whereDate('date_billing', $today);
    //     }

    //     // ✅ Fetch all transactions without pagination
    //     $transactions = $query->get();

    //     // ✅ Compute outstanding balance (bill_amount - partial)
    //     $transactions->transform(function ($transaction) {
    //         $transaction->outstanding_balance = ($transaction->bill_amount ?? 0) - ($transaction->partial ?? 0);
    //         return $transaction;
    //     });


    //     return Inertia::render('Collection/Show', [
    //         'transactions' => $transactions,
    //         'filters' => [
    //             'start_date' => $request->start_date ?? now()->toDateString(),
    //             'end_date' => $request->end_date ?? now()->toDateString(),
    //         ],
    //     ]);
    // }
}
