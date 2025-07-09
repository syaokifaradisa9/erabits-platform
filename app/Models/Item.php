<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'service_item_type_id',
        'name',
        'image_path',
        'price',
        'maintenance_count',
    ];

    protected $casts = [
        'price' => 'integer',
        'maintenance_count' => 'integer'
    ];

    public function serviceItemType()
    {
        return $this->belongsTo(ServiceItemType::class);
    }
}
