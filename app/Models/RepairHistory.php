<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RepairHistory extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'item_order_checklist_id',
        'old_status',
        'new_status',
        'notes',
        'updated_by',
        'updated_at',
        'activity_type',
    ];

    protected $casts = [
        'updated_at' => 'datetime',
    ];

    public function checklist()
    {
        return $this->belongsTo(ItemOrderChecklist::class, 'item_order_checklist_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
