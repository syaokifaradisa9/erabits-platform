<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorksheetController extends Controller
{
    public function index(Request $request, Order $order)
    {
        $order->load(['maintenances.itemOrder.item.serviceItemType']);

        return Inertia::render('Worksheet/Index', [
            'order' => $order,
            'maintenances' => $order->maintenances,
        ]);
    }
}
