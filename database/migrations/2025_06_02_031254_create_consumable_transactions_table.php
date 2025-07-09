<?php

use App\Models\Consumable;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // History of consumable transactions
        Schema::create('consumable_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Consumable::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->smallInteger("quantity");
            $table->unsignedBigInteger("price");
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consumable_transactions');
    }
};
