<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemChecklist extends Model
{
    use HasFactory;
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
