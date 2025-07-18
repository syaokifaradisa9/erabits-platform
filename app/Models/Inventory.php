<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Inventory extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'name',
        'image_path',
        'stock',
    ];

    protected $casts = [
        'stock' => 'integer',
    ];
}
