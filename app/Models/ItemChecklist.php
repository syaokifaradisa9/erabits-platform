<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemChecklist extends Model
{
    protected $fillable = [
        'item_id',
        'name',
        'description',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
