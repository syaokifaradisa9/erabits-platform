<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConsumableItem extends Model
{
    protected $fillable = [
        'consumable_id',
        'item_id',
        'count',
    ];

    protected $casts = [
        'count' => 'integer',
    ];

    public function consumable()
    {
        return $this->belongsTo(Consumable::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
