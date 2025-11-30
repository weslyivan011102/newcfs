<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RawCollectionController extends Controller
{
    public function index(Request $request)
    {
        $page           = $request->get('page', 1);
        $status         = $request->status;
        $collector_id   = $request->collector_id;
        $start_date     = $request->start_date;
        $end_date       = $request->end_date;
        $lastname       = $request->lastname;

        // MAIN QUERY
        $query = DB::table('collections')
            ->leftJoin('customers', 'customers.id', '=', 'collections.customer_id')
            ->select(
                'collections.*',
                'customers.firstname',
                'customers.lastname',
                'customers.address'
            );

        // -------------- FILTERS ------------------

        if ($lastname) {
            $query->where('customers.lastname', 'LIKE', "%$lastname%");
        }

        if ($status) {
            $query->where('collections.status', $status);
        }

        if ($collector_id) {
            $query->where('collections.collector_id', $collector_id);
        }

        if ($start_date && $end_date) {
            $query->whereBetween('collections.created_at', [
                $start_date . " 00:00:00",
                $end_date . " 23:59:59"
            ]);
        }

        // -------------- PAGINATION ------------------

        $result = $query->paginate(25);

        // -------------- TOTALS CALCULATION ------------------

        $totals = [
            "daily" => $this->getDailyTotal($start_date, $collector_id, $status),
            "monthly" => $this->getMonthlyTotal($start_date, $collector_id, $status),
            "yearly" => $this->getYearlyTotal($start_date, $collector_id, $status),
        ];

        return response()->json([
            "data" => $result->items(),
            "current_page" => $result->currentPage(),
            "last_page" => $result->lastPage(),
            "per_page" => $result->perPage(),
            "total" => $result->total(),
            "totals" => $totals,
        ]);
    }

    // ================= TOTAL CALCULATIONS ================= //

    private function getDailyTotal($date, $collector_id = null, $status = null)
    {
        if (!$date) {
            $date = date('Y-m-d');
        }

        $query = DB::table('collections')
            ->whereDate('created_at', $date);

        if ($collector_id) {
            $query->where('collector_id', $collector_id);
        }

        if ($status) {
            $query->where('status', $status);
        }

        return (float) $query->sum('amount');
    }

    private function getMonthlyTotal($date, $collector_id = null, $status = null)
    {
        if (!$date) {
            $date = date('Y-m-d');
        }

        $year  = date('Y', strtotime($date));
        $month = date('m', strtotime($date));

        $query = DB::table('collections')
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month);

        if ($collector_id) {
            $query->where('collector_id', $collector_id);
        }

        if ($status) {
            $query->where('status', $status);
        }

        return (float) $query->sum('amount');
    }

    private function getYearlyTotal($date, $collector_id = null, $status = null)
    {
        if (!$date) {
            $date = date('Y-m-d');
        }

        $year = date('Y', strtotime($date));

        $query = DB::table('collections')
            ->whereYear('created_at', $year);

        if ($collector_id) {
            $query->where('collector_id', $collector_id);
        }

        if ($status) {
            $query->where('status', $status);
        }

        return (float) $query->sum('amount');
    }
}
