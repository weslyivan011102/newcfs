<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Http\Requests\StoreBillRequest;
use App\Http\Requests\UpdateBillRequest;
use App\Models\Collector;
use App\Models\Customer;
use App\Models\CustomerPlan;
use Inertia\Inertia;

class BillController extends Controller
{
    //API FUNCTION

    public function getCustomersWithPlans()
    {
        // Retrieve all customers who have a plan with eager loading
        $customersWithPlans = CustomerPlan::with('customer', 'plan')->get();

        return response()->json($customersWithPlans);
    }


    public function getLatestPlanForCustomer(int $customerId)
    {
        try {
            // Get the latest customer plan for the given customer_id
            $latestCustomerPlan = CustomerPlan::where('customer_id', $customerId)
                ->latest('created_at') // Order by created_at in descending order
                ->first(); // Get the first (latest) customer plan

            if ($latestCustomerPlan) {
                // Fetch the plan details
                $plan = $latestCustomerPlan->plan; // Get the associated plan

                return [
                    'id' => $latestCustomerPlan->id,
                    'registration_date' => $latestCustomerPlan->date_registration,
                    'plan_id' => $plan->id,
                    'mbps' => $plan->mbps,
                    'plan_price' => $plan->plan_price,
                ];
            }

            return null; // If no plan is found
        } catch (\Exception $e) {
            return null; // Return null in case of any error
        }
    }

    public function indexApi()
    {
        try {
            // Get search inputs
            $search = request('search');  // Can search by bill_no, customer lastname, or collector lastname
            $sortColumn = request('sortColumn', 'bill_no');
            $sortDirection = request('sortDirection', 'asc');

            $validSortColumns = [
                'bill_no',
            ];

            if (!in_array($sortColumn, $validSortColumns)) {
                $sortColumn = 'bill_no';
            }

            // Start building the query
            $query = Bill::query()
                ->with(['customer.customerPlans.plan', 'collector'])  // Load customer and related data
                ->when($search, function ($query) use ($search) {
                    return $query->where(function ($query) use ($search) {
                        $query->where('bill_no', 'like', '%' . $search . '%')
                            ->orWhereHas('customer', function ($query) use ($search) {
                                $query->where('lastname', 'like', '%' . $search . '%');
                            })
                            ->orWhereHas('collector', function ($query) use ($search) {
                                $query->where('lastname', 'like', '%' . $search . '%');
                            });
                    });
                });

            // Retrieve the paginated data
            $data = $query->orderBy($sortColumn, $sortDirection)
                ->paginate(50);

            // Transform the data collection to add the latest plan
            $data->getCollection()->transform(function ($bill) {
                // Get the latest customer plan for the given customer_id
                $latestPlan = $this->getLatestPlanForCustomer($bill->customer_id);

                // Add the latest plan details to the bill object
                $bill->latest_plan = $latestPlan ? [
                    'plan_id' => $latestPlan['plan_id'],
                    'mbps' => $latestPlan['mbps'],
                    'plan_price' => $latestPlan['plan_price'],
                ] : null;

                return $bill;
            });

            // Return the modified data as JSON
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 404);
        }
    }




    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Bill/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $customersWithPlans = CustomerPlan::with(['customer' => function ($query) {
            $query->orderBy('lastname', 'asc');
        }, 'plan'])
            ->get()
            ->groupBy('customer_id')
            ->map(function ($customerPlans) {
                return $customerPlans->first();
            });



        $collectors = Collector::orderBy('lastname', 'asc')->get();


        return Inertia::render('Bill/Create', ['customers' => $customersWithPlans, 'collectors' => $collectors]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBillRequest $request)
    {
        try {
            $data = $request->validated();

            // Force remarks to "paid"
            $data['remarks'] = 'paid';

            Bill::create($data);

            return to_route('bills.index');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Bill $bill)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bill $bill)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBillRequest $request, Bill $bill)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bill $bill)
    {
        //
    }
}
