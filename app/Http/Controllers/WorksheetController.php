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
