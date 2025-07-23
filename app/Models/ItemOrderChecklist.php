<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    ];

    public function itemOrderMaintenance()
    {
        return $this->belongsTo(ItemOrderMaintenance::class);
    }
}
