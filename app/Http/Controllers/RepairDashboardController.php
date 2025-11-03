<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ItemOrderChecklist;
use App\Models\ItemOrderMaintenance;
use App\Models\ClientInventory;

class RepairDashboardController extends Controller
{
    public function index()
    {
        // Ambil semua checklist yang rusak dan belum selesai diperbaiki
        $checklists = ItemOrderChecklist::where('condition', 'rusak')
            ->with([
                'itemOrderMaintenance.itemOrder.order.client',
                'itemOrderMaintenance.itemOrder.item.serviceItemType',
                'itemOrderMaintenance.clientInventoryMaintenance.clientInventory.user'
            ])
            ->orderByRaw("CASE 
                WHEN repair_status IS NULL THEN 1 
                WHEN repair_status = 'pending' THEN 2 
                WHEN repair_status = 'in_progress' THEN 3 
                WHEN repair_status = 'declined' THEN 4 
                WHEN repair_status = 'completed' THEN 5 
                ELSE 6 
            END")
            ->orderBy('created_at', 'desc')
            ->get();

        // Format data untuk React
        $formattedChecklists = $checklists->map(function ($checklist) {
            $itemOrder = $checklist->itemOrderMaintenance ? $checklist->itemOrderMaintenance->itemOrder : null;
            $order = $itemOrder ? $itemOrder->order : null;
            $clientInventoryMaintenance = $checklist->itemOrderMaintenance ? $checklist->itemOrderMaintenance->clientInventoryMaintenance : null;
            $clientInventory = $clientInventoryMaintenance ? $clientInventoryMaintenance->clientInventory : null;
            $client = $clientInventory ? $clientInventory->user : null;
            
            return [
                'id' => $checklist->id,
                'name' => $checklist->name,
                'description' => $checklist->description,
                'condition' => $checklist->condition,
                'fix_action' => $checklist->fix_action,
                'notes' => $checklist->notes,
                'repair_status' => $checklist->repair_status,
                'repair_cost_estimate' => $checklist->repair_cost_estimate,
                'repair_notes' => $checklist->repair_notes,
                'item_name' => $itemOrder ? $itemOrder->name : 'N/A',
                'item_merk' => $itemOrder ? $itemOrder->merk : 'N/A',
                'item_model' => $itemOrder ? $itemOrder->model : 'N/A',
                'client_name' => $client ? $client->name : 'N/A',
                'order_number' => $order ? $order->number : 'N/A',
                'maintenance_date' => $checklist->itemOrderMaintenance ? $checklist->itemOrderMaintenance->created_at?->format('Y-m-d H:i') : 'N/A',
                'location' => $clientInventoryMaintenance ? $clientInventoryMaintenance->location : 'N/A',
            ];
        });

        return Inertia::render('RepairDashboard/Index', [
            'checklists' => $formattedChecklists,
        ]);
    }
}
