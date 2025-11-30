<?php

namespace App\Http\Controllers;

use App\Models\BatchBilling;
use App\Http\Requests\StoreBatchBillingRequest;
use App\Http\Requests\UpdateBatchBillingRequest;
use App\Models\Customer;
use App\Models\Transaction;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BatchBillingController extends Controller
{


    public function indexApi()
    {
        try {
            $search = request('lastname');
            $sortColumn = request('sortColumn', 'lastname');
            $sortDirection = request('sortDirection', 'asc');

            $validSortColumns = ['lastname'];

            if (!in_array($sortColumn, $validSortColumns)) {
                $sortColumn = 'lastname';
            }

            $query = Transaction::with([
                'customerPlan.customer',
                'customerPlan.plan',
                'customerPlan.collector',
            ])
                ->join('customer_plans', 'transactions.customer_plan_id', '=', 'customer_plans.id')
                ->join('customers', 'customer_plans.customer_id', '=', 'customers.id')
                ->when($search, function ($query) use ($search) {
                    $query->where('customers.lastname', 'like', $search . '%');
                })
                ->where('transactions.remarks', 'batch'); // exact match


            // Apply sorting on the joined customers table
            if ($sortColumn === 'lastname') {
                $query = $query->orderBy('customers.lastname', $sortDirection);
            }

            // select transactions.* to avoid ambiguity
            $data = $query->select('transactions.*')->paginate(50);

            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 404);
        }
    }



    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('BatchBill/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $yearPrefix = now()->format('y'); // e.g. '25' for 2025
        $month = now()->format('n'); // month without leading zero (1–12)

        $prefix = $yearPrefix . $month . '-'; // e.g. '251-'

        // Get latest bill_no starting with this prefix (year + month)
        $latestBill = Transaction::where('bill_no', 'like', $prefix . '%')
            ->orderBy('bill_no', 'desc')
            ->first();

        if ($latestBill) {
            // Extract the last 4 digits
            $lastNumber = (int) Str::after($latestBill->bill_no, '-');
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        // Pad the incrementing number to 4 digits
        $newBillNo = $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

        $customers = Customer::with('customerPlans.plan') // eager load customerPlans and their related plan
            ->orderBy('lastname', 'asc')
            ->get();


        return Inertia::render('BatchBill/Create', [
            'customers' => $customers,
            'generated_bill_no' => $newBillNo,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBatchBillingRequest $request)
    {
        try {
            $data = $request->validated();
            BatchBilling::create($data);

            return to_route('batch_bills.index');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {


        return inertia('BatchBill/Show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $batchBilling = BatchBilling::with([
            'customerPlan.customer',
            'customerPlan.plan',
            'customerPlan.collector'
        ])->findOrFail($id);

        return inertia('BatchBill/Edit', [
            'bill' => [
                'id' => $batchBilling->id,
                'customer_plan_id' => $batchBilling->customer_plan_id,
                'bill_no' => $batchBilling->bill_no,
                'bill_amount' => $batchBilling->bill_amount,
                'customer' => $batchBilling->customerPlan->customer ?? null,
                'plan' => $batchBilling->customerPlan->plan ?? null,
                'collector' => $batchBilling->customerPlan->collector ?? null,
                'created_at' => $batchBilling->created_at,
                'updated_at' => $batchBilling->updated_at,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBatchBillingRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $batchBilling = BatchBilling::findOrFail($id);

            $batchBilling->update($data);

            return redirect()->route('batch_bills.index')->with('success', 'Bill updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Error updating bill: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $batchBilling = BatchBilling::findOrFail($id);

            $batchBilling->delete();
            return response()->json([
                'message' => 'Batch bill deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting batch bill: ' . $e->getMessage()
            ], 500);
        }
    }
}
