<?php

namespace App\Http\Controllers;

use App\Models\ClientInventory;
use App\Models\ItemOrderChecklist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MyAssetsController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $filter = $request->query('filter');

        // Base query untuk inventories
        $query = ClientInventory::where('user_id', $user->id)->with('serviceItemType');

        // Jika filter 'needs_repair', hanya tampilkan inventaris yang memiliki item perlu perbaikan
        if ($filter === 'needs_repair') {
            $query->whereHas('maintenances.itemOrderMaintenance.checklists', function ($subQuery) {
                $subQuery->where('condition', 'rusak')
                         ->where(function ($subSubQuery) {
                             $subSubQuery->where('repair_status', null)
                                         ->orWhere('repair_status', 'pending')
                                         ->orWhere('repair_status', 'in_progress');
                         });
            });
        }

        $inventories = $query->latest('updated_at')->get();

        // Hitung jumlah item yang perlu perbaikan untuk user ini
        $needsRepairCount = ItemOrderChecklist::whereHas('itemOrderMaintenance.clientInventoryMaintenance.clientInventory', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->where('condition', 'rusak')
            ->where(function ($query) {
                $query->where('repair_status', null)
                      ->orWhere('repair_status', 'pending')
                      ->orWhere('repair_status', 'in_progress');
            })
            ->count();

        // Ambil daftar inventaris yang memiliki item perlu perbaikan
        $inventoriesWithRepair = ClientInventory::where('user_id', $user->id)
            ->whereHas('maintenances.itemOrderMaintenance.checklists', function ($query) {
                $query->where('condition', 'rusak')
                      ->where(function ($subQuery) {
                          $subQuery->where('repair_status', null)
                                   ->orWhere('repair_status', 'pending')
                                   ->orWhere('repair_status', 'in_progress');
                      });
            })
            ->pluck('id')
            ->toArray();

        return Inertia::render('MyAssets/Index', [
            'inventories' => $inventories,
            'needs_repair_count' => $needsRepairCount,
            'inventories_with_repair' => $inventoriesWithRepair,
            'filter' => $filter,
        ]);
    }

    public function show(ClientInventory $inventory, Request $request)
    {
        // Authorize that the user is viewing their own asset
        if ($inventory->user_id !== Auth::id()) {
            abort(403);
        }

        // Load the full history
        $inventory->load([
            'maintenances.itemOrderMaintenance' => function ($query) {
                $query->with(['checklists.repairHistories.user', 'itemOrder']);
            },
        ]);

        // Urutkan maintenances berdasarkan created_at terbaru dari itemOrderMaintenance
        $inventory->maintenances = $inventory->maintenances->sortByDesc(function ($m) {
            return $m->itemOrderMaintenance ? $m->itemOrderMaintenance->created_at : $m->created_at;
        });

        // Filter checklists berdasarkan parameter
        $filter = $request->query('filter');
        
        $inventory->maintenances = $inventory->maintenances->map(function ($maintenance) use ($filter) {
            if ($maintenance->itemOrderMaintenance) {
                $filteredChecklists = $maintenance->itemOrderMaintenance->checklists;
                
                if ($filter === 'needs_repair') {
                    $filteredChecklists = $filteredChecklists->filter(function ($checklist) {
                        return $checklist->condition === 'rusak' || in_array($checklist->repair_status, ['pending', 'in_progress', null]);
                    });
                } elseif ($filter === 'broken_only') {
                    $filteredChecklists = $filteredChecklists->filter(function ($checklist) {
                        return $checklist->condition === 'rusak';
                    });
                } elseif ($filter === 'in_repair') {
                    $filteredChecklists = $filteredChecklists->filter(function ($checklist) {
                        return in_array($checklist->repair_status, ['pending', 'in_progress']);
                    });
                } elseif ($filter === 'completed') {
                    $filteredChecklists = $filteredChecklists->filter(function ($checklist) {
                        return $checklist->repair_status === 'completed';
                    });
                }
                
                $maintenance->itemOrderMaintenance->checklists = $filteredChecklists;
            }
            return $maintenance;
        })->filter(function ($maintenance) {
            // Filter out maintenances that have no checklists after filtering
            if ($maintenance->itemOrderMaintenance) {
                return $maintenance->itemOrderMaintenance->checklists->count() > 0;
            }
            return true;
        });

        return Inertia::render('MyAssets/Show', [
            'inventory' => [
                'id' => $inventory->id,
                'name' => $inventory->name,
                'merk' => $inventory->merk,
                'model' => $inventory->model,
                'identify_number' => $inventory->identify_number,
                'location' => $inventory->location,
                'service_item_type' => [
                    'name' => $inventory->serviceItemType->name,
                ],
                'maintenances' => $inventory->maintenances->map(function ($maintenance) {
                    $itemOrderMaintenance = $maintenance->itemOrderMaintenance;
                    
                    return [
                        'id' => $maintenance->id,
                        'location' => $maintenance->location,
                        'item_order_maintenance' => $itemOrderMaintenance ? [
                            'id' => $itemOrderMaintenance->id,
                            'finish_date' => $itemOrderMaintenance->finish_date,
                            'created_at' => $itemOrderMaintenance->created_at ? $itemOrderMaintenance->created_at->toISOString() : null,
                            'checklists' => $itemOrderMaintenance->checklists->map(function ($checklist) {
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
                                    'repair_started_at' => $checklist->repair_started_at,
                                    'repair_completed_at' => $checklist->repair_completed_at,
                                    'repair_histories' => $checklist->repairHistories()->with('user')->get()->map(function ($history) {
                                        return [
                                            'id' => $history->id,
                                            'old_status' => $history->old_status,
                                            'new_status' => $history->new_status,
                                            'notes' => $history->notes,
                                            'updated_by' => $history->user ? $history->user->name : 'Sistem',
                                            'updated_at' => $history->updated_at->format('Y-m-d H:i:s'),
                                        ];
                                    })->toArray(),
                                ];
                            })->toArray(),
                            'item_order' => $itemOrderMaintenance->itemOrder ? [
                                'id' => $itemOrderMaintenance->itemOrder->id,
                                'name' => $itemOrderMaintenance->itemOrder->name,
                            ] : null,
                        ] : null,
                    ];
                })->toArray(),
            ],
            'filter' => $filter,
        ]);
    }

    public function updateRepairStatus(Request $request, ClientInventory $inventory)
    {
        $request->validate([
            'checklist_id' => 'required|exists:item_order_checklists,id',
            'action' => 'required|in:approve,decline',
        ]);

        // Cek bahwa checklist ini milik aset klien ini
        $checklist = $inventory->maintenances()
            ->whereHas('itemOrderMaintenance.checklists', function ($query) use ($request) {
                $query->where('item_order_checklists.id', $request->checklist_id);
            })
            ->with('itemOrderMaintenance.checklists')
            ->first()
            ?->itemOrderMaintenance
            ?->checklists
            ?->firstWhere('id', $request->checklist_id);

        if (!$checklist) {
            return response()->json([
                'message' => 'Akses tidak sah atau checklist tidak ditemukan.'
            ], 403);
        }

        // Hanya bisa approve jika statusnya pending dan kondisinya rusak
        if ($request->action === 'approve') {
            $checklist->update([
                'repair_status' => 'in_progress',
            ]);
            
            return response()->json([
                'message' => 'Perbaikan disetujui dan sedang dalam proses.',
            ]);
        } elseif ($request->action === 'decline') {
            $checklist->update([
                'repair_status' => 'declined',
            ]);
            
            return response()->json([
                'message' => 'Perbaikan ditolak.',
            ]);
        }
    }
}