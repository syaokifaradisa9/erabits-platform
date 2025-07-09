<?php

use App\Models\ServiceItemType;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Inventory item of client
        Schema::create('client_inventories', function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(ServiceItemType::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();

            $table->string("name");
            $table->string("merk")->nullable();
            $table->string("model")->nullable();
            $table->string("identify_number")->nullable();

            $table->string("location")->nullable();
            $table->date("last_maintenance_date");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_inventories');
    }
};
