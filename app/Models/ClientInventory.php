<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientInventory extends Model
{
    protected $fillable = [
        'user_id',
        'service_item_type_id',

        'name',
        'merk',
        'model',
        'identify_number',
        'location',
        'last_maintenance_date',
    ];

    protected $casts = [
        'last_maintenance_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
