<?php

namespace App\Http\Controllers;

use App\Models\Purok;
use App\Http\Requests\StorePurokRequest;
use App\Http\Requests\UpdatePurokRequest;
use Inertia\Inertia;

class PurokController extends Controller
{
    public function indexApi()
    {
        try {
            $search = request('purok_name');
            $sortColumn = request('sortColumn', 'purok_name');
            $sortDirection = request('sortDirection', 'asc');

            $validSortColumns = [
                'purok_name',
            ];

            if (!in_array($sortColumn, $validSortColumns)) {
                $sortColumn = 'purok_name';
            }

            $query = Purok::with('barangay.municipality')
                ->when($search, function ($query) use ($search) {
                    return $query->where('purok_name', 'like', $search . '%');
                });

            $data = $query->orderBy($sortColumn, $sortDirection)
                ->paginate(50);

            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 404);
        }
    }


    public function purokOptions()
    {
        $puroks = Purok::with('barangay')->get();

        return response()->json($puroks);
    }

    /*

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Address/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $puroks = Purok::orderBy('purok_name', 'asc')->get();
        return Inertia::render('Address/Create', ['puroks' => $puroks]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePurokRequest $request)
    {
        try {
            $data = $request->validated();
            Purok::create($data);

            return to_route('address.index');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $purok = Purok::with(['barangay.municipality'])
            ->findOrFail($id);

        return inertia('Address/Show', [
            'purok' => $purok,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $purok = Purok::with(['barangay.municipality'])
            ->findOrFail($id);

        return inertia('Address/Edit', [
            'purok' => $purok,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePurokRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $purok = Purok::findOrFail($id); // fetch the record
            $purok->update($data);

            // return redirect()->route('customers.index');
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => 'Error updating purok: ' . $e->getMessage()
            ])->withInput();
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $purok = Purok::findOrFail($id);

            $purok->delete();
            return response()->json([
                'message' => 'Purok deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting purok: ' . $e->getMessage()
            ], 500);
        }
    }
}
