<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use Inertia\Inertia;

class BannedController extends Controller
{
    public function indexApi()
    {
        try {
            // 🔎 Query params
            $search         = request('lastname');
            $municipalityId = request('municipality_id');
            $barangayId     = request('barangay_id');
            $sortColumn     = request('sortColumn', 'lastname');
            $sortDirection  = request('sortDirection', 'asc');

            $validSortColumns = ['lastname'];

            if (!in_array($sortColumn, $validSortColumns)) {
                $sortColumn = 'lastname';
            }

            // 🔗 Query builder
            $query = Customer::with('purok.barangay.municipality')
                ->where('status', 'banned')
                ->when($search, function ($query) use ($search) {
                    $query->where('lastname', 'like', $search . '%');
                })
                ->when($municipalityId, function ($query) use ($municipalityId) {
                    $query->whereHas('purok.barangay.municipality', function ($q) use ($municipalityId) {
                        $q->where('id', $municipalityId);
                    });
                })
                ->when($barangayId, function ($query) use ($barangayId) {
                    $query->whereHas('purok.barangay', function ($q) use ($barangayId) {
                        $q->where('id', $barangayId);
                    });
                });

            // 📦 Paginated results
            $data = $query->orderBy($sortColumn, $sortDirection)->paginate(50);

            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Banned/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Banned/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        try {
            $data = $request->validated();
            Customer::create($data);

            return to_route('banned.index');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
         $customer = Customer::with(['purok.barangay.municipality', 'customerPlans', 'collector'])
            ->findOrFail($id);

        return inertia('Customer/Show', [
            'customer' => $customer,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $customer = Customer::with(['customerPlans', 'collector']) // eager load if needed
            ->findOrFail($id);

        return inertia('Banned/Edit', [
            'customer' => $customer,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $customer = Customer::findOrFail($id);
            $customer->update($data);

            return redirect()->route('banned.index')
                ->with('success', 'Customer updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => 'Error updating customer: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $customer = Customer::findOrFail($id);
            $customer->delete();

            return response()->json([
                'message' => 'Customer deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting customer: ' . $e->getMessage()
            ], 500);
        }
    }
}
