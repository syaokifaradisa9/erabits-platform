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

        // Base query - get ALL client inventories, not just those needing repair
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
                // Include only inventories that don't need repair 
                $query->whereNotIn('id', $inventoriesWithRepairIds);
            }
        }

        $inventories = $query->with([
            'maintenances.itemOrderMaintenance.checklists',
            'maintenances.itemOrderMaintenance.checklists.repairHistories.user'
        ])->latest('updated_at')->get();

        // Map data for frontend
        $inventoriesData = $inventories->map(function ($inventory) use ($inventoriesWithRepairIds) {
            $needsRepair = $inventoriesWithRepairIds->contains($inventory->id);
            $status = $needsRepair ? 'needs_repair' : 'normal';
            
            // Ambil item_order_maintenance terbaru yang terkait dengan inventory ini berdasarkan kesamaan data dan memiliki asset_image_path
            $latestItemOrderMaintenance = \App\Models\ItemOrderMaintenance::whereNotNull('asset_image_path')
                ->whereHas('itemOrder', function ($query) use ($inventory) {
                    $query->where('name', $inventory->name)
                          ->where('merk', $inventory->merk)
                          ->where('model', $inventory->model)
                          ->where('identify_number', $inventory->identify_number);
                })
                ->whereHas('itemOrder.item.serviceItemType', function ($query) use ($inventory) {
                    $query->where('id', $inventory->service_item_type_id);
                })
                ->whereHas('itemOrder.order', function ($query) use ($inventory) {
                    $query->where('client_id', $inventory->user_id);
                })
                ->with('itemOrder')
                ->orderBy('finish_date', 'DESC')
                ->orderBy('created_at', 'DESC')
                ->orderBy('id', 'DESC')  // Tambahkan urutan berdasarkan ID terakhir sebagai fallback
                ->first();
            
            $latestMaintenanceImagePath = $latestItemOrderMaintenance?->image_path;
            $latestAssetImagePath = $latestItemOrderMaintenance?->asset_image_path;
            
            // Ambil maintenance terbaru berdasarkan checklist terbaru (paling akhir diupdate)
            // Gunakan query langsung ke database untuk memastikan mendapatkan entri terbaru
            $latestLocation = \App\Models\ClientInventoryMaintenance::where('client_inventory_id', $inventory->id)
                ->leftJoin('item_order_maintenances', 'client_inventory_maintenances.item_order_maintenance_id', '=', 'item_order_maintenances.id')
                ->leftJoin('item_order_checklists', 'item_order_maintenances.id', '=', 'item_order_checklists.item_order_maintenance_id')
                ->select('client_inventory_maintenances.location')
                ->orderByRaw('GREATEST(
                    COALESCE(item_order_checklists.updated_at, "1970-01-01 00:00:00"), 
                    COALESCE(item_order_maintenances.updated_at, "1970-01-01 00:00:00"),
                    COALESCE(item_order_maintenances.created_at, "1970-01-01 00:00:00"),
                    COALESCE(client_inventory_maintenances.updated_at, "1970-01-01 00:00:00"),
                    COALESCE(client_inventory_maintenances.created_at, "1970-01-01 00:00:00")
                ) DESC')
                ->limit(1)
                ->value('location');

            // Urutan prioritas: 
            // 1. customer_image_path (jika pelanggan upload)
            // 2. asset_image_path (foto alat dari teknisi)
            // 3. image_path (foto hasil pemeliharaan)
            $imageUrl = null;
            if ($inventory->customer_image_path) {
                $imageUrl = asset('storage/' . $inventory->customer_image_path);
            } else if ($latestAssetImagePath) {
                $imageUrl = asset('storage/' . $latestAssetImagePath);
            } else if ($latestMaintenanceImagePath) {
                $imageUrl = asset('storage/' . $latestMaintenanceImagePath);
            }
            
            return [
                'id' => $inventory->id,
                'name' => $inventory->name,
                'location' => $latestLocation ?: $inventory->location,  // Use latest maintenance location if available, otherwise default location
                'identify_number' => $inventory->identify_number,
                'updated_at' => $inventory->updated_at,
                'service_item_type' => $inventory->serviceItemType,
                'status' => $status,
                'latest_maintenance_location' => $latestLocation,
                'image_url' => $imageUrl ?: ($inventory->image_url ?? 'https://placehold.co/600x400/e2e8f0/e2e8f0?text=+'),
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



        // Load the full history, including the order information
        $inventory->load([
            'maintenances.itemOrderMaintenance' => function ($query) {
                $query->with(['checklists.repairHistories.user', 'itemOrder.order']);
            },
        ]);

        $latestMaintenanceLocation = \App\Models\ClientInventoryMaintenance::where('client_inventory_id', $inventory->id)
            ->leftJoin('item_order_maintenances', 'client_inventory_maintenances.item_order_maintenance_id', '=', 'item_order_maintenances.id')
            ->leftJoin('item_order_checklists', 'item_order_maintenances.id', '=', 'item_order_checklists.item_order_maintenance_id')
            ->select('client_inventory_maintenances.location')
            ->orderByRaw('GREATEST(
                COALESCE(item_order_checklists.updated_at, "1970-01-01 00:00:00"), 
                COALESCE(item_order_maintenances.updated_at, "1970-01-01 00:00:00"),
                COALESCE(item_order_maintenances.created_at, "1970-01-01 00:00:00"),
                COALESCE(client_inventory_maintenances.updated_at, "1970-01-01 00:00:00"),
                COALESCE(client_inventory_maintenances.created_at, "1970-01-01 00:00:00")
            ) DESC')
            ->limit(1)
            ->value('location');

        // Group maintenances by order
        $maintenancesByOrder = $inventory->maintenances->mapToGroups(function ($maintenance) {
            if ($maintenance->itemOrderMaintenance && $maintenance->itemOrderMaintenance->itemOrder && $maintenance->itemOrderMaintenance->itemOrder->order) {
                $order = $maintenance->itemOrderMaintenance->itemOrder->order;
                return [$order->number => $maintenance];
            }
            return ['Uncategorized' => $maintenance];
        });

        // Sort orders by confirmation date descending
        $sortedMaintenancesByOrder = $maintenancesByOrder->sortByDesc(function ($maintenances, $orderNumber) {
            if ($orderNumber === 'Uncategorized') {
                return -1;
            }
            $firstMaintenance = $maintenances->first();
            return $firstMaintenance->itemOrderMaintenance->itemOrder->order->confirmation_date;
        });

        // Get the latest order number
        $latestOrderNumber = $sortedMaintenancesByOrder->keys()->first();

        // Filter checklists based on the request parameter
        $filter = $request->query('filter');
        
        $filteredMaintenancesByOrder = $sortedMaintenancesByOrder->map(function ($maintenances) use ($filter) {
            return $maintenances->map(function ($maintenance) use ($filter) {
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
                if ($maintenance->itemOrderMaintenance) {
                    return $maintenance->itemOrderMaintenance->checklists->count() > 0;
                }
                return true; // Keep maintenances without itemOrderMaintenance
            });
        })->filter(function ($maintenances) {
            return $maintenances->count() > 0; // Filter out orders with no maintenances after filtering
        });

        return Inertia::render('MyAssets/Show', [
            'inventory' => [
                'id' => $inventory->id,
                'name' => $inventory->name,
                'merk' => $inventory->merk,
                'model' => $inventory->model,
                'identify_number' => $inventory->identify_number,
                'location' => $inventory->location,
                'latest_maintenance_location' => $latestMaintenanceLocation,
                'service_item_type' => [
                    'name' => $inventory->serviceItemType->name,
                ],
                'maintenances_by_order' => $filteredMaintenancesByOrder->map(function ($maintenances, $orderNumber) {
                    return [
                        'order_number' => $orderNumber,
                        'maintenances' => $maintenances->map(function ($maintenance) {
                            $itemOrderMaintenance = $maintenance->itemOrderMaintenance;
                            return [
                                'id' => $maintenance->id,
                                'location' => $maintenance->location,
                                'item_order_maintenance' => $itemOrderMaintenance ? [
                                    'id' => $itemOrderMaintenance->id,
                                    'finish_date' => $itemOrderMaintenance->finish_date,
                                    'image_path' => $itemOrderMaintenance->image_path,
                                    'asset_image_path' => $itemOrderMaintenance->asset_image_path,
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
                                                    'activity_type' => $history->activity_type,
                                                ];
                                            })->toArray(),
                                        ];
                                    })->values(),
                                    'item_order' => $itemOrderMaintenance->itemOrder ? [
                                        'id' => $itemOrderMaintenance->itemOrder->id,
                                        'name' => $itemOrderMaintenance->itemOrder->name,
                                    ] : null,
                                ] : null,
                            ];
                        })->values(),
                    ];
                })->values(),
            ],
            'latest_order_number' => $latestOrderNumber,
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
            
            // Tambahkan entry ke repair history untuk approval
            \App\Models\RepairHistory::create([
                'item_order_checklist_id' => $checklist->id,
                'old_status' => $checklist->getOriginal('repair_status') ?? $checklist->repair_status,
                'new_status' => 'in_progress',
                'notes' => "Perbaikan disetujui oleh klien",
                'updated_by' => Auth::id(),
                'updated_at' => now(),
                'activity_type' => 'client_approval'
            ]);
            
            return response()->json([
                'message' => 'Perbaikan disetujui dan sedang dalam proses.',
            ]);
        } elseif ($request->action === 'decline') {
            $checklist->update([
                'repair_status' => 'declined',
            ]);
            
            // Tambahkan entry ke repair history untuk decline
            \App\Models\RepairHistory::create([
                'item_order_checklist_id' => $checklist->id,
                'old_status' => $checklist->getOriginal('repair_status') ?? $checklist->repair_status,
                'new_status' => 'declined',
                'notes' => "Perbaikan ditolak oleh klien",
                'updated_by' => Auth::id(),
                'updated_at' => now(),
                'activity_type' => 'client_decline'
            ]);
            
            return response()->json([
                'message' => 'Perbaikan ditolak.',
            ]);
        }
    }
}