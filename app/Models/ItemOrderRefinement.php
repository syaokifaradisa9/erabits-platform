<?php

namespace App\Models;

use App\Enum\ChecklistCondition;
use Illuminate\Database\Eloquent\Model;

class ItemOrderRefinement extends Model
{
    protected $fillable = [
        'item_order_id',
        'date',
        'fix_action',
        'item_requirements',
        'is_item_conditions_are_met',
        'action_requirements',
        'is_cation_conditions_are_met',
        'notes',
        'result',
    ];

    protected $casts = [
        'date' => 'date',
        'is_item_conditions_are_met' => 'boolean',
        'is_cation_conditions_are_met' => 'boolean',
        'result' => ChecklistCondition::class,
    ];

    public function itemOrder()
    {
        return $this->belongsTo(ItemOrder::class);
    }
}
