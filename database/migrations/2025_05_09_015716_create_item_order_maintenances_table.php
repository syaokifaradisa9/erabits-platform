<?php

use App\Models\ItemOrder;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('item_order_maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ItemOrder::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();

            $table->date("estimation_date");
            $table->date("finish_date")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_order_maintenances');
    }
};
