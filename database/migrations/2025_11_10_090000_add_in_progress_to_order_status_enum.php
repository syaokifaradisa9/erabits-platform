<?php

use App\Enum\OrderStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration
{
    public function up(): void
    {
        // Modify the enum to include the new 'Dikerjakan' status
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM(
            '" . OrderStatus::Pending . "',
            '" . OrderStatus::Rejected . "',
            '" . OrderStatus::Confirmed . "',
            '" . OrderStatus::InProgress . "',
            '" . OrderStatus::Finish . "'
        ) DEFAULT '" . OrderStatus::Pending . "'");
    }

    public function down(): void
    {
        // Remove the 'Dikerjakan' option when rolling back
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM(
            '" . OrderStatus::Pending . "',
            '" . OrderStatus::Rejected . "',
            '" . OrderStatus::Confirmed . "',
            '" . OrderStatus::Finish . "'
        ) DEFAULT '" . OrderStatus::Pending . "'");
    }
};