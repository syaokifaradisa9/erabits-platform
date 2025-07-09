<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConsumableTransaction extends Model
{
    protected $fillable = [
        'consumable_id',
        'quantity',
        'price'
    ];

    public function consumable(){
        return $this->belongsTo(Consumable::class);
    }
}
