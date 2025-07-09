<?php

use App\Models\ServiceItemType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Non Consumables (Assets) for each service item type
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ServiceItemType::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('name');
            $table->string('image_path')->nullable();
            $table->unsignedMediumInteger('stock')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
