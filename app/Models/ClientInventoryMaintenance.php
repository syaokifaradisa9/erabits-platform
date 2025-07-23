<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientInventoryMaintenance extends Model
{
    protected $fillable = [
        'client_inventory_id',
        'item_order_maintenance_id',
        'location'
    ];

    public function clientInventory()
    {
        return $this->belongsTo(ClientInventory::class);
    }

    public function itemOrderMaintenance()
    {
        return $this->belongsTo(ItemOrderMaintenance::class);
    }
}
