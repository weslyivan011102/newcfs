<?php

namespace App\Http\Controllers\Collector;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render(
            'CollectorPage/Dashboard'
        );
    }
}
