<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Consumable extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'image_path',
        'type',
        'stock',
        'pcs_per_box',
        'is_active',
    ];

    protected $casts = [
        'stock' => 'integer',
        'pcs_per_box' => 'integer',
        'is_active' => 'boolean',
    ];
}
