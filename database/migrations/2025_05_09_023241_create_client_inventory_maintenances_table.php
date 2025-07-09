<?php

use App\Models\ClientInventory;
use App\Models\ItemOrderMaintenance;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Relation client inventory with history maintenance
        Schema::create('client_inventory_maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ClientInventory::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(ItemOrderMaintenance::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_inventory_maintenances');
    }
};
