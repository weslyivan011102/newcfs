<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SoaController extends Controller
{
    //===== SEARCH BY CUSTOMER FIRSTNAME AND LASTNAME THEN FILTER BY MONTH AND YEAR
    public function searchSoa(Request $request)
    {
        $search = $request->query('search');   // firstname or lastname
        $month  = $request->query('month');    // optional (1–12)
        $year   = $request->query('year', now()->year); // default: current year

        // 🔎 Search customer by firstname OR lastname (case-insensitive)
        $customer = Customer::with([
            'customerPlans.plan',
            'customerPlans.collector',
            'customerPlans.transactions' => function ($query) use ($month, $year) {
                // filter by year
                $query->whereYear('date_billing', $year);

                // filter by month if provided
                if (!empty($month)) {
                    $query->whereMonth('date_billing', $month);
                }

                $query->orderBy('date_billing', 'asc');
            }
        ])
            ->where(function ($q) use ($search) {
                $q->where('firstname', 'like', "%{$search}%")
                    ->orWhere('lastname', 'like', "%{$search}%")
                    ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$search}%"]);
            })
            ->first();

        if (!$customer) {
            return response()->json([
                'message' => "No customer found with name: {$search}"
            ], 404);
        }

        // ✅ Compute outstanding balance for each transaction
        foreach ($customer->customerPlans as $plan) {
            foreach ($plan->transactions as $transaction) {
                $transaction->outstanding_balance =
                    ($transaction->plan_price ?? 0) - ($transaction->bill_amount ?? 0);
            }
        }
        return response()->json([
            'customer' => $customer,
            'filters'  => [
                'year' => $year,
                'month' => $month ?? 'all',
            ],
        ]);
    }



    //==========search by customer ID
    // public function searchSoa(Request $request)
    // {
    //     $search = $request->query('search'); // only ID

    //     if (!is_numeric($search)) {
    //         return response()->json([
    //             'message' => "Search must be a numeric customer ID."
    //         ], 400);
    //     }

    //     $customer = Customer::with([
    //         'customerPlans.plan',
    //         'customerPlans.collector',
    //         'customerPlans.transactions' => function ($query) {
    //             $query->orderBy('date_billing', 'asc');
    //         }
    //     ])->where('id', $search)->first();

    //     if (!$customer) {
    //         return response()->json([
    //             'message' => "No customer found with ID: {$search}"
    //         ], 404);
    //     }

    //     // ✅ Compute outstanding balance for each transaction
    //     foreach ($customer->customerPlans as $plan) {
    //         foreach ($plan->transactions as $transaction) {
    //             $transaction->outstanding_balance =
    //                 ($transaction->plan_price ?? 0) - ($transaction->bill_amount ?? 0);
    //         }
    //     }

    //     return response()->json([
    //         'customer' => $customer,
    //     ]);
    // }




    public function getSoa($customerId)
    {
        // Get the customer with their plans, collectors, and transactions
        $customer = Customer::with([
            'customerPlans.plan',
            'customerPlans.collector',
            'customerPlans.transactions' => function ($query) {
                $query->orderBy('date_billing', 'asc');
            }
        ])->findOrFail($customerId);

        return response()->json([
            'customer' => $customer,
        ]);
    }

    public function index()
    {
        return Inertia::render('Soa/Index');
    }
}
