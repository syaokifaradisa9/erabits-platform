<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemOrderMaintenance extends Model
{
    protected $fillable = [
        'item_order_id',
        'estimation_date',
        'finish_date',
    ];

    protected $casts = [
        'estimation_date' => 'date',
        'finish_date' => 'date',
    ];

    public function itemOrder()
    {
        return $this->belongsTo(ItemOrder::class);
    }

    public function checklists()
    {
        return $this->hasMany(ItemOrderChecklist::class);
    }

    public function clientInventoryMaintenance()
    {
        return $this->hasOne(ClientInventoryMaintenance::class);
    }
}
