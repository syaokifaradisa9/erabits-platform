<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'client_id',
        'reserved_user_id',
        'number',
        'confirmation_date',
        'status',
        'notes'
    ];

    protected $casts = [
        'confirmation_date' => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function reservedUser()
    {
        return $this->belongsTo(User::class, 'reserved_user_id');
    }

    public function itemOrders(){
        return $this->hasMany(ItemOrder::class);
    }
}
