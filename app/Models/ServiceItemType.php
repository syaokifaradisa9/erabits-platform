<?php

namespace App\Models;

use App\Models\Item;
use App\Models\ClientInventory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceItemType extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function items()
    {
        return $this->hasMany(Item::class);
    }

    public function clientInventories()
    {
        return $this->hasMany(ClientInventory::class);
    }
}
