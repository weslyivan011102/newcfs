<?php

namespace App\Http\Controllers;

use App\Models\AdvanceBilling;
use App\Http\Requests\StoreAdvanceBillingRequest;
use App\Http\Requests\UpdateAdvanceBillingRequest;
use App\Models\Customer;
use App\Models\Transaction;
use Faker\Provider\ar_EG\Address;
use Inertia\Inertia;
use Illuminate\Support\Str;


class AdvanceBillingController extends Controller
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
                ->where('transactions.remarks', 'advance'); // exact match


            // Apply sorting on the joined customers table
            if ($sortColumn === 'lastname') {
                $query = $query->orderBy('customers.lastname', $sortDirection);
            }

            // Important: select advance_billings.* to avoid column ambiguity
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
        return Inertia::render('AdvanceBill/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $yearPrefix = now()->format('y'); // '25' for 2025

        // Get latest bill_no starting with current year prefix
        $latestBill = AdvanceBilling::where('bill_no', 'like', $yearPrefix . '%')
            ->orderBy('bill_no', 'desc')
            ->first();

        if ($latestBill) {
            // Get the numeric suffix and increment it
            $lastNumber = (int) Str::substr($latestBill->bill_no, 2); // remove '25'
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        // Pad to always have 3 digits
        $newBillNo = $yearPrefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT); // e.g. 25001

        $customers = Customer::orderBy('lastname', 'asc')->get();

        return Inertia::render('AdvanceBill/Create', [
            'customers' => $customers,
            'generated_bill_no' => $newBillNo,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAdvanceBillingRequest $request)
    {
        try {
            $data = $request->validated();
            AdvanceBilling::create($data);

            return to_route('advance_bills.index');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $advanceBilling = AdvanceBilling::with([
            'customerPlan.customer',
            'customerPlan.plan',
            'customerPlan.collector'
        ])->findOrFail($id);

        return inertia('AdvanceBill/Show', [
            'bill' => [
                'id' => $advanceBilling->id,
                'customer_plan_id' => $advanceBilling->customer_plan_id,
                'bill_no' => $advanceBilling->bill_no,
                'or_no' => $advanceBilling->or_no,
                'rebate' => $advanceBilling->rebate,
                'partial' => $advanceBilling->partial,
                'bill_amount' => $advanceBilling->bill_amount,
                'remarks' => $advanceBilling->remarks,
                'customer' => $advanceBilling->customerPlan->customer ?? null,
                'plan' => $advanceBilling->customerPlan->plan ?? null,
                'collector' => $advanceBilling->customerPlan->collector ?? null,
                'created_at' => $advanceBilling->created_at,
                'updated_at' => $advanceBilling->updated_at,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $advanceBilling = AdvanceBilling::with([
            'customerPlan.customer',
            'customerPlan.plan',
            'customerPlan.collector'
        ])->findOrFail($id);

        return inertia('AdvanceBill/Edit', [
            'bill' => [
                'id' => $advanceBilling->id,
                'customer_plan_id' => $advanceBilling->customer_plan_id,
                'bill_no' => $advanceBilling->bill_no,

                'rebate' => $advanceBilling->rebate,
                'partial' => $advanceBilling->partial,
                'bill_amount' => $advanceBilling->bill_amount,
                'remarks' => $advanceBilling->remarks,
                'customer' => $advanceBilling->customerPlan->customer ?? null,
                'plan' => $advanceBilling->customerPlan->plan ?? null,
                'collector' => $advanceBilling->customerPlan->collector ?? null,
                'created_at' => $advanceBilling->created_at,
                'updated_at' => $advanceBilling->updated_at,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAdvanceBillingRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $advanceBilling = AdvanceBilling::findOrFail($id);

            $advanceBilling->update($data);

            return redirect()->route('advance_bills.index')->with('success', 'Bill updated successfully!');
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
            $advanceBilling = AdvanceBilling::findOrFail($id);

            $advanceBilling->delete();
            return response()->json([
                'message' => 'Advance bill deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting advance bill: ' . $e->getMessage()
            ], 500);
        }
    }
}
