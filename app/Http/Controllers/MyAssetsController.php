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
        $filters = $request->only(['search', 'type', 'status']);

        // Base query
        $query = ClientInventory::where('user_id', $user->id)->with('serviceItemType');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('identify_number', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        // Apply type filter
        if ($request->filled('type')) {
            $type = $request->input('type');
            $query->whereHas('serviceItemType', function ($q) use ($type) {
                $q->where('name', $type);
            });
        }

        // Get IDs of inventories that need repair before applying status filter
        $inventoriesWithRepairIds = ClientInventory::where('user_id', $user->id)
            ->whereHas('maintenances.itemOrderMaintenance.checklists', function ($query) {
                $query->where('condition', 'rusak')
                      ->where(function ($subQuery) {
                          $subQuery->where('repair_status', null)
                                   ->orWhere('repair_status', 'pending')
                                   ->orWhere('repair_status', 'in_progress');
                      });
            })
            ->pluck('id');

        // Apply status filter
        if ($request->filled('status')) {
            if ($request->input('status') === 'needs_repair') {
                $query->whereIn('id', $inventoriesWithRepairIds);
            } elseif ($request->input('status') === 'normal') {
                $query->whereNotIn('id', $inventoriesWithRepairIds);
            }
        }

        $inventories = $query->latest('updated_at')->get();

        // Map data for frontend
        $inventoriesData = $inventories->map(function ($inventory) use ($inventoriesWithRepairIds) {
            $status = $inventoriesWithRepairIds->contains($inventory->id) ? 'needs_repair' : 'normal';
            return [
                'id' => $inventory->id,
                'name' => $inventory->name,
                'location' => $inventory->location,
                'identify_number' => $inventory->identify_number,
                'updated_at' => $inventory->updated_at,
                'service_item_type' => $inventory->serviceItemType,
                'status' => $status,
                'image_url' => $inventory->image_url ?? 'https://placehold.co/600x400/e2e8f0/e2e8f0?text=+',
            ];
        });

        // Count items needing repair for the top banner
        $needsRepairCount = $inventoriesWithRepairIds->count();
        
        // Get all asset types for the filter dropdown
        $assetTypes = \App\Models\ServiceItemType::whereHas('clientInventories', function($q) use ($user) {
            $q->where('user_id', $user->id);
        })->pluck('name');

        return Inertia::render('MyAssets/Index', [
            'inventories' => $inventoriesData,
            'needs_repair_count' => $needsRepairCount,
            'asset_types' => $assetTypes,
            'filters' => $filters,
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