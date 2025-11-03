<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemOrder extends Model
{
    protected $fillable = [
        'order_id',
        'item_id',
        'name',
        'price',
        'quantity',
        'merk',
        'model',
        'identify_number',
    ];

    protected $casts = [
        'price' => 'integer',
        'quantity' => 'integer',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function maintenance(){
        return $this->hasMany(ItemOrderMaintenance::class);
    }
}
