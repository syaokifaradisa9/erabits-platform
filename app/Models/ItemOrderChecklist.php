<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use App\Models\RepairHistory;

class ItemOrderChecklist extends Model
{
    protected $fillable = [
        'item_order_maintenance_id',
        'item_checklist_id',
        'name',
        'description',
        'condition',
        'fix_action',
        'notes',
        'repair_status',
        'repair_cost_estimate',
        'repair_notes',
        'repair_started_at',
        'repair_completed_at',
    ];

    protected $casts = [
        'repair_cost_estimate' => 'decimal:2',
        'repair_started_at' => 'datetime',
        'repair_completed_at' => 'datetime',
    ];

    public function itemOrderMaintenance()
    {
        return $this->belongsTo(ItemOrderMaintenance::class);
    }

    public function repairHistories()
    {
        return $this->hasMany(RepairHistory::class, 'item_order_checklist_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::updating(function ($checklist) {
            // Logging untuk debugging
            \Log::info('ItemOrderChecklist Updating', [
                'id' => $checklist->id,
                'original_repair_status' => $checklist->getOriginal('repair_status'),
                'new_repair_status' => $checklist->repair_status,
                'is_repair_status_dirty' => $checklist->isDirty('repair_status'),
                'original_condition' => $checklist->getOriginal('condition'),
                'new_condition' => $checklist->condition,
                'is_condition_dirty' => $checklist->isDirty('condition'),
            ]);

            // Cek apakah repair_status berubah
            if ($checklist->isDirty('repair_status')) {
                $oldStatus = $checklist->getOriginal('repair_status');
                $newStatus = $checklist->repair_status;

                RepairHistory::create([
                    'item_order_checklist_id' => $checklist->id,
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                    'notes' => "Status diperbarui dari '{$oldStatus}' menjadi '{$newStatus}'",
                    'updated_by' => Auth::id(),
                    'updated_at' => now(),
                    'activity_type' => 'repair_status_change'
                ]);
                
                \Log::info('RepairHistory Created for Status Change', [
                    'checklist_id' => $checklist->id,
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus
                ]);
            }

            // Cek apakah condition berubah
            if ($checklist->isDirty('condition')) {
                $oldCondition = $checklist->getOriginal('condition');
                $newCondition = $checklist->condition;

                RepairHistory::create([
                    'item_order_checklist_id' => $checklist->id,
                    'old_status' => $oldCondition,
                    'new_status' => $newCondition,
                    'notes' => "Kondisi diperbarui dari '{$oldCondition}' menjadi '{$newCondition}'",
                    'updated_by' => Auth::id(),
                    'updated_at' => now(),
                    'activity_type' => 'condition_change'
                ]);
                
                \Log::info('RepairHistory Created for Condition Change', [
                    'checklist_id' => $checklist->id,
                    'old_condition' => $oldCondition,
                    'new_condition' => $newCondition
                ]);
            }
            
            // Cek apakah fix_action berubah
            if ($checklist->isDirty('fix_action') && $checklist->fix_action) {
                $oldFixAction = $checklist->getOriginal('fix_action');
                $newFixAction = $checklist->fix_action;

                RepairHistory::create([
                    'item_order_checklist_id' => $checklist->id,
                    'old_status' => $oldFixAction,
                    'new_status' => $newFixAction,
                    'notes' => "Aksi perbaikan diperbarui dari '{$oldFixAction}' menjadi '{$newFixAction}'",
                    'updated_by' => Auth::id(),
                    'updated_at' => now(),
                    'activity_type' => 'fix_action_change'
                ]);
                
                \Log::info('RepairHistory Created for Fix Action Change', [
                    'checklist_id' => $checklist->id,
                    'old_fix_action' => $oldFixAction,
                    'new_fix_action' => $newFixAction
                ]);
            }
        });
    }
}
