<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Consumable extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'name',
        'image_path',
        'type',
        'stock',
        'pcs_per_box',
    ];

    protected $casts = [
        'stock' => 'integer',
        'pcs_per_box' => 'integer',
    ];
}
