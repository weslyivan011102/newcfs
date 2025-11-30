<?php

namespace App\Http\Controllers\Collector;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CollectionController extends Controller
{
    public function index()
    {
        return Inertia::render('CollectorPage/Collection/Index');
    }

    public function create()
    {
        return Inertia::render('CollectorPage/Collection/Create');
    }
}
