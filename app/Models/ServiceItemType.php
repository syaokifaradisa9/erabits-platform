<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceItemType extends Model
{
    protected $fillable = [
        'name',
        'description',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
