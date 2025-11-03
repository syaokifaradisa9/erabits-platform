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
                ]);
            }
        });
    }
}
