<?php

namespace App\Http\Controllers;

use App\Models\CustomerPlan;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Str;

class BatchxBillingController extends Controller
{
    public function getUnpaidByBatchMonthYear(Request $request, $batchNo)
{
    // Map batch numbers to ENUM values & cutoff days
    $batchMapping = [
        1 => ['enum' => 'batch1', 'day' => 1],
        2 => ['enum' => 'batch2', 'day' => 5],
        3 => ['enum' => 'batch3', 'day' => 10],
        4 => ['enum' => 'batch4', 'day' => 15],
        5 => ['enum' => 'batch5', 'day' => 25],
        6 => ['enum' => 'all_cheque', 'day' => 28],
    ];

    if (!isset($batchMapping[$batchNo])) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid batch number.',
        ], 422);
    }

    $batchInfo = $batchMapping[$batchNo];

    $year  = $request->input('year', now()->year);
    $month = $request->input('month', now()->month);

    $billingDate = Carbon::create($year, $month, $batchInfo['day'])->toDateString();

    // Fetch unpaid transactions
    $unpaidTransactions = Transaction::with(['customerPlan.customer.purok.barangay.municipality', 'customerPlan.plan'])
        ->whereDate('date_billing', $billingDate)
        ->where('status', 'unpaid')
        ->get();

    // Add balance & outstanding_balance calculations
    $transactionsWithBalance = $unpaidTransactions->map(function ($transaction) {
        // Get last transaction before this one
        $lastTransaction = Transaction::where('customer_plan_id', $transaction->customer_plan_id)
            ->where('id', '<', $transaction->id)
            ->latest()
            ->first();

        $balance = $lastTransaction ? ($lastTransaction->bill_amount - $lastTransaction->partial) : 0;

        $rebate = $transaction->rebate ?? 0;
        $partial = $transaction->partial ?? 0;
        $planPrice = $transaction->customerPlan->plan->plan_price ?? 0;

        $amountDue = $planPrice + $balance - $rebate;
        $outstandingBalance = $amountDue - $partial;

        // Append to transaction
        $transaction->balance = $balance;
        $transaction->amount_due = $amountDue;
        $transaction->outstanding_balance = $outstandingBalance;

        return $transaction;
    });

    return response()->json([
        'success'       => true,
        'batch'         => $batchNo,
        'month'         => $month,
        'year'          => $year,
        'date_billing'  => $billingDate,
        'unpaid_count'  => $transactionsWithBalance->count(),
        'transactions'  => $transactionsWithBalance,
    ]);
}


    // public function generateBatch(Request $request, $batchNo)
    // {
    //     // Batch schedule mapping
    //     $batchDates = [
    //         1 => 1,
    //         2 => 5,
    //         3 => 10,
    //         4 => 15,
    //         5 => 25,
    //         6 => 28,
    //     ];

    //     if (!isset($batchDates[$batchNo])) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Invalid batch number.',
    //         ], 422);
    //     }

    //     // Billing date for current month/year
    //     $billingDate = Carbon::create(
    //         now()->year,
    //         now()->month,
    //         $batchDates[$batchNo]
    //     );

    //     $customerPlans = CustomerPlan::with('plan')->get();

    //     $created = 0;
    //     $skipped = 0;
    //     $newTransactions = [];

    //     foreach ($customerPlans as $plan) {
    //         // ✅ Check if this customer already has a transaction in the current month
    //         $exists = Transaction::where('customer_plan_id', $plan->id)
    //             ->whereYear('date_billing', $billingDate->year)
    //             ->whereMonth('date_billing', $billingDate->month)
    //             ->exists();

    //         if ($exists) {
    //             $skipped++;
    //             continue;
    //         }

    //         // Generate bill number
    //         $billNo = $this->generateBillNoString();

    //         $transaction = Transaction::create([
    //             'customer_plan_id' => $plan->id,
    //             'collector_id'     => $plan->collector_id,
    //             'bill_no'          => $billNo,
    //             'rebate'           => 0,
    //             'partial'          => 0,
    //             'bill_amount'      => 0,
    //             'remarks'          => 'batch',
    //             'status'           => 'unpaid',
    //             'date_billing'     => $billingDate->toDateString(),
    //             'plan_price'       => $plan->plan->plan_price ?? 0,
    //             'plan_mbps'        => $plan->plan->mbps ?? 0,
    //         ]);

    //         $newTransactions[] = $transaction;
    //         $created++;
    //     }

    //     return response()->json([
    //         'success'      => true,
    //         'batch'        => $batchNo,
    //         'date_billing' => $billingDate->toDateString(),
    //         'created'      => $created,
    //         'skipped'      => $skipped,
    //         'transactions' => $newTransactions,
    //         'message'      => "Generated {$created} transactions. Skipped {$skipped} duplicates.",
    //     ]);
    // }



    /**
     * Generate unique bill number (y + m + incrementing counter)
     * Format: yymm-0001
     */

    public function generateBatch(Request $request, $batchNo)
    {
        // Map batch numbers to ENUM values & cutoff days
        $batchMapping = [
            1 => ['enum' => 'batch1', 'day' => 1],
            2 => ['enum' => 'batch2', 'day' => 5],
            3 => ['enum' => 'batch3', 'day' => 10],
            4 => ['enum' => 'batch4', 'day' => 15],
            5 => ['enum' => 'batch5', 'day' => 25],
            6 => ['enum' => 'all_cheque', 'day' => 28],
        ];

        if (!isset($batchMapping[$batchNo])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid batch number.',
            ], 422);
        }

        $batchInfo = $batchMapping[$batchNo];

        

        // Billing date (current year/month with batch day)
        $billingDate = Carbon::create(
            now()->year,
            now()->month,
            $batchInfo['day']
        );

        // Only get customer plans with matching ENUM value
        $customerPlans = CustomerPlan::with('plan')
            ->where('date_billing', $batchInfo['enum'])
            ->get();

        $created = 0;
        $skipped = 0;
        $newTransactions = [];

        foreach ($customerPlans as $plan) {
            // ✅ Prevent duplicate in same month for same customer_plan_id
            $exists = Transaction::where('customer_plan_id', $plan->id)
                ->whereYear('date_billing', $billingDate->year)
                ->whereMonth('date_billing', $billingDate->month)
                ->exists();

            if ($exists) {
                $skipped++;
                continue;
            }

            // Generate bill number
            $billNo = $this->generateBillNoString();

            $transaction = Transaction::create([
                'customer_plan_id' => $plan->id,
                'collector_id'     => $plan->collector_id,
                'bill_no'          => $billNo,
                'rebate'           => 0,
                'partial'          => 0,
                'bill_amount'      => $plan->plan->bill_amount ?? 0,
                'remarks'          => 'batch', // e.g. "Batch1" or "All_cheque"
                'status'           => 'unpaid',
                'date_billing'     => $billingDate->toDateString(), // ✅ correct cutoff date (Sep 1, 5, 10, etc.)
                'plan_price'       => $plan->plan->plan_price ?? 0,
                'plan_mbps'        => $plan->plan->mbps ?? 0,
                
            ]);

            $newTransactions[] = $transaction;
            $created++;
        }   

        return response()->json([
            'success'      => true,
            'batch'        => $batchNo,
            'date_billing' => $billingDate->toDateString(),
            'created'      => $created,
            'skipped'      => $skipped,
            'transactions' => $newTransactions,
            'message'      => "Generated {$created} transactions. Skipped {$skipped} duplicates.",
        ]);       
    }

    private function generateBillNoString()
    {
        $yearPrefix = now()->format('y'); // e.g. "25"
        $month = now()->format('n');      // e.g. "9"
        $prefix = $yearPrefix . $month . '-'; // e.g. "259-"

        // Find the latest bill_no starting with this prefix
        $latestBill = Transaction::where('bill_no', 'like', $prefix . '%')
            ->orderBy('bill_no', 'desc')
            ->first();

        if ($latestBill) {
            $lastNumber = (int) Str::after($latestBill->bill_no, '-');
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

    
    }


    public function index()
    {
        return Inertia::render('BatchBillx/Page');
    }
}
