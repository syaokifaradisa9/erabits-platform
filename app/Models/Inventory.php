<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Inventory extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'image_path',
        'stock',
    ];

    protected $casts = [
        'stock' => 'integer',
    ];
}
