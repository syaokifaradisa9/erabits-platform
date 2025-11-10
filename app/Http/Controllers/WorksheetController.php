<?php

namespace App\Http\Controllers;

use App\Enum\ChecklistCondition;
use App\Models\ItemOrderMaintenance;
use App\Models\Order;
use App\DataTransferObjects\WorksheetDTO;
use App\Services\WorksheetService;
use App\Http\Requests\WorksheetStoreRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorksheetController extends Controller
{
    public function __construct(protected WorksheetService $worksheetService)
    {
    }

    public function index(Request $request, Order $order)
    {
        $order->load(['maintenances.itemOrder.item.serviceItemType', 'maintenances.checklists']);

        return Inertia::render('Worksheet/Index', [
            'order' => $order,
            'maintenances' => $order->maintenances,
        ]);
    }

    public function sheet(Order $order, ItemOrderMaintenance $maintenance)
    {
        $maintenance->load('itemOrder.item.checklists', 'checklists.repairHistories.user', 'clientInventoryMaintenance.clientInventory');
        
        // Get the most recent location from associated client inventory maintenance
        $latestClientInventoryMaintenance = $maintenance->clientInventoryMaintenance()->with('clientInventory')->latest('id')->first();
        
        // Add the location to the maintenance object to make it easily accessible in frontend
        if ($latestClientInventoryMaintenance) {
            $maintenance->latest_location = $latestClientInventoryMaintenance->location ?? $latestClientInventoryMaintenance->clientInventory?->location ?? null;
        } else {
            // If no client inventory maintenance exists, try to find if there's a related client inventory
            // First get the item order to find the related client inventory
            $itemOrder = $maintenance->itemOrder;
            // The client inventory would be related to the client and the item details
            $clientInventory = \App\Models\ClientInventory::where('user_id', $itemOrder->order->client_id)
                ->where('name', $itemOrder->name)
                ->where('merk', $itemOrder->merk)
                ->where('model', $itemOrder->model)
                ->where('identify_number', $itemOrder->identify_number)
                ->first();
                
            $maintenance->latest_location = $clientInventory?->location ?? null;
        }
        
        $conditions = [
            ChecklistCondition::Good,
            ChecklistCondition::Broken
        ];
        return Inertia::render('Worksheet/Sheet', compact('order', 'maintenance', 'conditions'));
    }

    public function storeSheet(WorksheetStoreRequest $request, Order $order, ItemOrderMaintenance $maintenance)
    {
        $worksheetDTO = WorksheetDTO::fromRequest($request);
        $this->worksheetService->storeChecklist($worksheetDTO, $maintenance);
        return to_route('orders.worksheet.index', $order)->with('success', 'Berhasil menyimpan checklist');
    }
}
