<?php

namespace App\Http\Controllers;

use App\Models\Collector;
use App\Http\Requests\StoreCollectorRequest;
use App\Http\Requests\UpdateCollectorRequest;
use App\Http\Resources\CollectorResource;
use App\Models\Transaction;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CollectorController extends Controller
{
    // API function
    public function totalCollectedRaw(Request $request)
    {
        $query = Transaction::with([
            'customerPlan.plan',
            'customerPlan.collector',
            'customerPlan.customer.purok.barangay.municipality',
        ]);

        // ✅ Filter by status (paid / unpaid)
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // ✅ Filter by period (day, week, month)
        if ($request->has('filter')) {
            $filter = $request->filter;
            $query->when($filter === 'day', function ($q) {
                $q->whereDate('date_billing', now()->toDateString());
            })->when($filter === 'week', function ($q) {
                $q->whereBetween('date_billing', [now()->startOfWeek(), now()->endOfWeek()]);
            })->when($filter === 'month', function ($q) {
                $q->whereMonth('date_billing', now()->month)
                    ->whereYear('date_billing', now()->year);
            });
        }

        // ✅ Filter by custom start_date and end_date
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('date_billing', [
                $request->start_date,
                $request->end_date
            ]);
        } elseif ($request->filled('start_date')) {
            $query->whereDate('date_billing', '>=', $request->start_date);
        } elseif ($request->filled('end_date')) {
            $query->whereDate('date_billing', '<=', $request->end_date);
        }

        // ✅ Filter by collector (firstname + lastname or by ID)
        if ($request->filled('collector_id')) {
            $query->whereHas('customerPlan.collector', function ($q) use ($request) {
                $q->where('id', $request->collector_id);
            });
        } elseif ($request->filled('collector')) {
            $collector = $request->collector;
            $query->whereHas('customerPlan.collector', function ($q) use ($collector) {
                $q->where('firstname', 'like', "%{$collector}%")
                    ->orWhere('lastname', 'like', "%{$collector}%");
            });
        }

        // ✅ Paginate 50 per page
        $transactions = $query->paginate(50);

        // ✅ Compute outstanding balance (bill_amount - partial)
        $transactions->getCollection()->transform(function ($transaction) {
            $transaction->outstanding_balance = ($transaction->bill_amount ?? 0) - ($transaction->partial ?? 0);
            return $transaction;
        });

        return response()->json($transactions);
    }



    // public function totalCollectedRaw(Request $request)
    // {
    //     $query = Transaction::with([
    //         'customerPlan.plan',
    //         'customerPlan.collector',
    //         'customerPlan.customer.purok.barangay.municipality',
    //     ]);

    //     // ✅ Filter by period (day, week, month)
    //     if ($request->has('filter')) {
    //         $filter = $request->filter;
    //         $query->when($filter === 'day', function ($q) {
    //             $q->whereDate('date_billing', now()->toDateString());
    //         })->when($filter === 'week', function ($q) {
    //             $q->whereBetween('date_billing', [now()->startOfWeek(), now()->endOfWeek()]);
    //         })->when($filter === 'month', function ($q) {
    //             $q->whereMonth('date_billing', now()->month)
    //                 ->whereYear('date_billing', now()->year);
    //         });
    //     }

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
    //     }

    //     // ✅ Search by collector lastname
    //     if ($request->filled('search')) {
    //         $search = $request->search;
    //         $query->whereHas('customerPlan.collector', function ($q) use ($search) {
    //             $q->where('lastname', 'like', "%{$search}%");
    //         });
    //     }

    //     // ✅ Paginate 50 per page
    //     $transactions = $query->paginate(50);

    //     // ✅ Compute outstanding balance (bill_amount - partial)
    //     $transactions->getCollection()->transform(function ($transaction) {
    //         $transaction->outstanding_balance = ($transaction->bill_amount ?? 0) - ($transaction->partial ?? 0);
    //         return $transaction;
    //     });

    //     return response()->json($transactions);
    // }


    // public function totalCollectedRaw(Request $request)
    // {
    //     //GET http://localhost:8000/api/raw_collections?filter=month&search=Liberato&page=1


    //     $query = Transaction::with([
    //         'customerPlan.plan',
    //         'customerPlan.collector',
    //         'customerPlan.customer.purok.barangay.municipality',
    //     ]);

    //     // ✅ Filter by period (day, week, month)
    //     if ($request->has('filter')) {
    //         $filter = $request->filter;
    //         $query->when($filter === 'day', function ($q) {
    //             $q->whereDate('date_billing', now()->toDateString());
    //         })->when($filter === 'week', function ($q) {
    //             $q->whereBetween('date_billing', [now()->startOfWeek(), now()->endOfWeek()]);
    //         })->when($filter === 'month', function ($q) {
    //             $q->whereMonth('date_billing', now()->month)
    //                 ->whereYear('date_billing', now()->year);
    //         });
    //     }

    //     // ✅ Search by collector lastname
    //     if ($request->has('search') && $request->search !== '') {
    //         $search = $request->search;
    //         $query->whereHas('customerPlan.collector', function ($q) use ($search) {
    //             $q->where('lastname', 'like', "%{$search}%");
    //         });
    //     }

    //     // ✅ Paginate 50 per page
    //     $transactions = $query->paginate(50);

    //     // ✅ Compute outstanding balance (bill_amount - partial)
    //     $transactions->getCollection()->transform(function ($transaction) {
    //         $transaction->outstanding_balance = ($transaction->bill_amount ?? 0) - ($transaction->partial ?? 0);
    //         return $transaction;
    //     });

    //     return response()->json($transactions);
    // }

    public function totalCollected(Request $request)
    {
        //GET http://localhost:8000/api/raw_collections?filter=month&search=Liberato&page=1

        try {
            $filter = $request->input('filter', 'day');
            $search = $request->input('lastname');
            $sortColumn = $request->input('sortColumn', 'lastname');
            $sortDirection = $request->input('sortDirection', 'asc');

            $validSortColumns = ['lastname', 'firstname', 'total_collected', 'outstanding_balance'];

            if (!in_array($sortColumn, $validSortColumns)) {
                $sortColumn = 'lastname';
            }

            $query = Collector::with('transactions.customerPlan.customer')
                // ✅ Total collected = sum of bill_amount
                ->withSum(['transactions as total_collected' => function ($q) use ($filter) {
                    if ($filter === 'day') {
                        $q->whereDate('date_billing', Carbon::today());
                    } elseif ($filter === 'week') {
                        $q->whereBetween('date_billing', [
                            Carbon::now()->startOfWeek(),
                            Carbon::now()->endOfWeek()
                        ]);
                    } elseif ($filter === 'month') {
                        $q->whereMonth('date_billing', Carbon::now()->month)
                            ->whereYear('date_billing', Carbon::now()->year);
                    }
                }], 'bill_amount')
                // ✅ Outstanding balance = sum(plan_price - partial)
                ->withSum(['transactions as outstanding_balance' => function ($q) use ($filter) {
                    $q->join('customer_plans', 'transactions.customer_plan_id', '=', 'customer_plans.id')
                        ->join('plans', 'customer_plans.plan_id', '=', 'plans.id');

                    if ($filter === 'day') {
                        $q->whereDate('transactions.date_billing', Carbon::today());
                    } elseif ($filter === 'week') {
                        $q->whereBetween('transactions.date_billing', [
                            Carbon::now()->startOfWeek(),
                            Carbon::now()->endOfWeek()
                        ]);
                    } elseif ($filter === 'month') {
                        $q->whereMonth('transactions.date_billing', Carbon::now()->month)
                            ->whereYear('transactions.date_billing', Carbon::now()->year);
                    }
                }], DB::raw('plans.plan_price - transactions.partial'));

            // ✅ Search by lastname
            if ($search) {
                $query->where('lastname', 'like', $search . '%');
            }

            // ✅ Sorting
            if (in_array($sortColumn, ['total_collected', 'outstanding_balance'])) {
                $query->orderBy($sortColumn, $sortDirection);
            } else {
                $query->orderBy($sortColumn, $sortDirection);
            }

            $data = $query->paginate(50);

            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }



    public function indexApi()
    {
        try {
            $search = request('lastname');
            $sortColumn = request('sortColumn', 'lastname');
            $sortDirection = request('sortDirection', 'asc');

            $validSortColumns = [
                'lastname',
            ];

            if (!in_array($sortColumn, $validSortColumns)) {
                $sortColumn = 'lastname';
            }

            $query = Collector::query()
                ->when($search, function ($query) use ($search) {
                    return $query->where('lastname', 'like', $search . '%');
                });

            $data = $query->orderBy($sortColumn, $sortDirection)
                ->paginate(50);

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
        return Inertia::render('Collector/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Collector/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCollectorRequest $request)
    {
        try {
            $data = $request->validated();
            Collector::create($data);

            return to_route('collectors.index');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Collector $collector)
    {
        return inertia('Collector/Show', [
            'collector' => new CollectorResource($collector),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Collector $collector)
    {
        return inertia('Collector/Edit', [
            'collector' => new CollectorResource($collector),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCollectorRequest $request, Collector $collector)
    {
        try {
            $data = $request->validated();

            $collector->update($data);

            return redirect()->route('collectors.index');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Error updating material: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Collector $collector)
    {
        try {
            $collector->delete();
            return response()->json([
                'message' => 'Collector deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting collector: ' . $e->getMessage()
            ], 500);
        }
    }
}
