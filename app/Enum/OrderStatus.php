<?php

namespace App\Enum;

enum OrderStatus
{
    const Pending = 'Pending';
    const Rejected = 'Ditolak';
    const Confirmed = 'Terkonfirmasi';
    const Finish = 'Selesai';
}
