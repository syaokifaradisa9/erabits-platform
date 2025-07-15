<?php

namespace App\Models;

use App\Models\ItemChecklist;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use HasFactory, SoftDeletes;
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

    public function checklists(){
        return $this->hasMany(ItemChecklist::class);
    }
}
