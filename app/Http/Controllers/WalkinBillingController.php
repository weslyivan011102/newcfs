<?php

namespace App\Http\Controllers;

use App\Models\WalkinBilling;
use App\Http\Requests\StoreWalkinBillingRequest;
use App\Http\Requests\UpdateWalkinBillingRequest;
use App\Http\Resources\WalkinBillingResource;
use App\Models\Customer;
use Inertia\Inertia;
use Illuminate\Support\Str;

class WalkinBillingController extends Controller
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

            $query = WalkinBilling::with([
                'customerPlan.customer',
                'customerPlan.plan',
                'customerPlan.collector',
            ])
                ->join('customer_plans', 'walkin_billings.customer_plan_id', '=', 'customer_plans.id')
                ->join('customers', 'customer_plans.customer_id', '=', 'customers.id')
                ->when($search, function ($query) use ($search) {
                    $query->where('customers.lastname', 'like', $search . '%');
                });

            // Apply sorting on the joined customers table
            if ($sortColumn === 'lastname') {
                $query = $query->orderBy('customers.lastname', $sortDirection);
            }

            // Important: select walkin_billings.* to avoid column ambiguity
            $data = $query->select('walkin_billings.*')->paginate(50);

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
        return Inertia::render('WalkinBill/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $yearPrefix = now()->format('y'); // '25' for 2025

        // Get latest bill_no starting with current year prefix
        $latestBill = WalkinBilling::where('bill_no', 'like', $yearPrefix . '%')
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

        return Inertia::render('WalkinBill/Create', [
            'customers' => $customers,
            'generated_bill_no' => $newBillNo,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWalkinBillingRequest $request)
    {
        try {
            $data = $request->validated();
            WalkinBilling::create($data);

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
        $walkinBilling = WalkinBilling::with([
            'customerPlan.customer',
            'customerPlan.plan',
            'customerPlan.collector'
        ])->findOrFail($id);

        return inertia('WalkinBill/Show', [
            'bill' => [
                'id' => $walkinBilling->id,
                'customer_plan_id' => $walkinBilling->customer_plan_id,
                'bill_no' => $walkinBilling->bill_no,
                'or_no' => $walkinBilling->or_no,
                'rebate' => $walkinBilling->rebate,
                'partial' => $walkinBilling->partial,
                'bill_amount' => $walkinBilling->bill_amount,
                'remarks' => $walkinBilling->remarks,
                'customer' => $walkinBilling->customerPlan->customer ?? null,
                'plan' => $walkinBilling->customerPlan->plan ?? null,
                'collector' => $walkinBilling->customerPlan->collector ?? null,
                'created_at' => $walkinBilling->created_at,
                'updated_at' => $walkinBilling->updated_at,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $walkinBilling = WalkinBilling::with([
            'customerPlan.customer',
            'customerPlan.plan',
            'customerPlan.collector'
        ])->findOrFail($id);

        return inertia('WalkinBill/Edit', [
            'bill' => [
                'id' => $walkinBilling->id,
                'customer_plan_id' => $walkinBilling->customer_plan_id,
                'bill_no' => $walkinBilling->bill_no,
                'or_no' => $walkinBilling->or_no,
                'rebate' => $walkinBilling->rebate,
                'partial' => $walkinBilling->partial,
                'bill_amount' => $walkinBilling->bill_amount,
                'remarks' => $walkinBilling->remarks,
                'customer' => $walkinBilling->customerPlan->customer ?? null,
                'plan' => $walkinBilling->customerPlan->plan ?? null,
                'collector' => $walkinBilling->customerPlan->collector ?? null,
                'created_at' => $walkinBilling->created_at,
                'updated_at' => $walkinBilling->updated_at,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWalkinBillingRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $walkinBilling = WalkinBilling::findOrFail($id);

            $walkinBilling->update($data);

            return redirect()->route('walkin_bills.index')->with('success', 'Bill updated successfully!');
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
            $walkinBilling = WalkinBilling::findOrFail($id);

            $walkinBilling->delete();
            return response()->json([
                'message' => 'Walkin bill deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting walkin bill: ' . $e->getMessage()
            ], 500);
        }
    }
}
