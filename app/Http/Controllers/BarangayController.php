<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Http\Requests\StoreBarangayRequest;
use App\Http\Requests\UpdateBarangayRequest;
use App\Models\Municipality;
use Inertia\Inertia;

class BarangayController extends Controller
{
    public function indexApi()
    {
        try {
            $search = request('barangay_name');
            $sortColumn = request('sortColumn', 'barangay_name');
            $sortDirection = request('sortDirection', 'asc');

            $validSortColumns = [
                'barangay_name',
            ];

            if (!in_array($sortColumn, $validSortColumns)) {
                $sortColumn = 'barangay_name';
            }

            $query = Barangay::with('municipality')
                ->when($search, function ($query) use ($search) {
                    return $query->where('barangay_name', 'like', $search . '%');
                });

            $data = $query->orderBy($sortColumn, $sortDirection)
                ->paginate(50);

            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 404);
        }
    }


    public function barangayOptions()
    {
        $barangays = Barangay::with('municipality')->get();

        return response()->json($barangays);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Barangay/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $municipalities = Municipality::orderBy('municipality_name', 'asc')->get();
        return Inertia::render('Barangay/Create', ['municipalities' => $municipalities]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBarangayRequest $request)
    {
        try {
            $data = $request->validated();
            Barangay::create($data);

            return to_route('barangays.index');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $barangay = Barangay::with(['municipality'])
            ->findOrFail($id);

        return inertia('Barangay/Show', [
            'barangay' => $barangay,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $barangay = Barangay::with(['municipality'])
            ->findOrFail($id);

        return inertia('Barangay/Edit', [
            'barangay' => $barangay,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangayRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $barangay = Barangay::findOrFail($id); // fetch the record
            $barangay->update($data);

            // return redirect()->route('barangays.index');
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => 'Error updating barangay: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $barangay = Barangay::findOrFail($id);

            $barangay->delete();
            return response()->json([
                'message' => 'Barangay deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting barangay: ' . $e->getMessage()
            ], 500);
        }
    }
}
