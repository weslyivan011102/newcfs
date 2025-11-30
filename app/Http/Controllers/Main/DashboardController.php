<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Collector;
use App\Models\Customer;
use App\Models\CustomerPlan;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'activeCustomers'   => Customer::where('status', 'active')->count(),
            'inactiveCustomers' => Customer::where('status', 'inactive')->count(),
            'collectors'        => Collector::count(),
            'bannedcustomers'   => Customer::where('status', 'banned')->count(),
            'unpaidcustomers'   => Transaction::where('status', 'Unpaid')->count(),
        ]);
    }

    public function getTotalCollection()
    {
        $totalCollection = CustomerPlan::with('plan')
            ->get()
            ->sum(fn($customerPlan) => $customerPlan->plan->plan_price);

        return response()->json([
            'total_collection' => $totalCollection
        ]);
    }

    public function transactionSummary(Request $request)
    {
        $month = $request->input('month');
        $year  = $request->input('year', now()->year);

        $query = Transaction::query();

        // Filters
        if ($year) {
            $query->whereYear('date_billing', $year);
        }
        if ($month) {
            $query->whereMonth('date_billing', $month);
        }

        // === Overall ===
        $overall = (clone $query)->selectRaw('
            COALESCE(SUM(partial), 0) as total_partial,
            COALESCE(SUM(rebate), 0) as total_rebate,
            COALESCE(SUM(bill_amount), 0) as total_bill_amount
        ')->first();

        // === Advance ===
        $advance = (clone $query)->where('remarks', 'advance')->selectRaw('
            COALESCE(SUM(partial), 0) as total_partial,
            COALESCE(SUM(rebate), 0) as total_rebate,
            COALESCE(SUM(bill_amount), 0) as total_bill_amount
        ')->first();

        // === Batch ===
        $batch = (clone $query)->where('remarks', 'batch')->selectRaw('
            COALESCE(SUM(partial), 0) as total_partial,
            COALESCE(SUM(rebate), 0) as total_rebate,
            COALESCE(SUM(bill_amount), 0) as total_bill_amount
        ')->first();

        // === Unpaid ===
        $unpaid = (clone $query)->where('status', 'Unpaid')->selectRaw('
            COUNT(id) as total_unpaid_count,
            COALESCE(SUM(partial), 0) as total_partial,
            COALESCE(SUM(rebate), 0) as total_rebate,
            COALESCE(SUM(bill_amount), 0) as total_bill_amount,
            COALESCE(SUM(plan_price), 0) as total_plan_price
        ')->first();

        // === Paid ===
        $paid = (clone $query)->where('status', 'Paid')->selectRaw('
            COUNT(id) as total_paid_count,
            COALESCE(SUM(partial), 0) as total_partial,
            COALESCE(SUM(rebate), 0) as total_rebate,
            COALESCE(SUM(bill_amount), 0) as total_bill_amount,
            COALESCE(SUM(plan_price), 0) as total_plan_price
        ')->first();

        // === Cash Payments ===
        $cash = (clone $query)->where('mode_payment', 'Cash')->selectRaw('
            COUNT(id) as total_cash_count,
            COALESCE(SUM(partial), 0) as total_partial,
            COALESCE(SUM(rebate), 0) as total_rebate,
            COALESCE(SUM(bill_amount), 0) as total_bill_amount,
            COALESCE(SUM(plan_price), 0) as total_plan_price
        ')->first();

        // === Gcash Payments ===
        $gcash = (clone $query)->where('mode_payment', 'Gcash')->selectRaw('
            COUNT(id) as total_gcash_count,
            COALESCE(SUM(partial), 0) as total_partial,
            COALESCE(SUM(rebate), 0) as total_rebate,
            COALESCE(SUM(bill_amount), 0) as total_bill_amount,
            COALESCE(SUM(plan_price), 0) as total_plan_price
        ')->first();

        // === Cheque Payments ===
        $cheque = (clone $query)->where('mode_payment', 'Cheque')->selectRaw('
            COUNT(id) as total_cheque_count,
            COALESCE(SUM(partial), 0) as total_partial,
            COALESCE(SUM(rebate), 0) as total_rebate,
            COALESCE(SUM(bill_amount), 0) as total_bill_amount,
            COALESCE(SUM(plan_price), 0) as total_plan_price
        ')->first();

        // === Total Collection (Cash + Gcash + Cheque) ===
        $totalCollection = $cash->total_partial + $gcash->total_partial + $cheque->total_partial;

        return response()->json([
            'month' => $month,
            'year'  => $year,

            'overall' => [
                'total_partial' => $overall->total_partial,
                'total_rebate'  => $overall->total_rebate,
                'total_bill'    => $overall->total_bill_amount,
                'net_pay'       => $overall->total_partial,
            ],

            'advance' => [
                'total_partial' => $advance->total_partial,
                'total_rebate'  => $advance->total_rebate,
                'total_bill'    => $advance->total_bill_amount,
                'net_pay'       => $advance->total_partial - $advance->total_rebate,
            ],

            'batch' => [
                'total_partial' => $batch->total_partial,
                'total_rebate'  => $batch->total_rebate,
                'total_bill'    => $batch->total_bill_amount,
                'net_pay'       => $batch->total_partial - $batch->total_rebate,
            ],

            'unpaid' => [
                'count'           => $unpaid->total_unpaid_count,
                'total_planprice' => $unpaid->total_plan_price,
            ],

            'paid' => [
                'count' => $paid->total_paid_count,
            ],

            'cash' => [
                'count'       => $cash->total_cash_count,
                'total_cash'  => $cash->total_partial,
            ],

            'gcash' => [
                'count'        => $gcash->total_gcash_count,
                'total_gcash'  => $gcash->total_partial,
            ],

           'cheque' => [
                'count'        => $cheque->total_cheque_count,
                'total_cheque' => $cheque->total_partial,
            ],
            'total_collection' => $totalCollection,
        ]);
    }
}
