<?php

use App\Enum\ChecklistCondition;
use App\Models\ItemOrderMaintenance;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Checklist for 1 maintenance 
        Schema::create('item_order_checklists', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ItemOrderMaintenance::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->string("name");
            $table->text("description");
            $table->enum("condition", [
                ChecklistCondition::Good,
                ChecklistCondition::Broken,
            ])->default(ChecklistCondition::Good);
            $table->text("fix_action")->nullable();
            $table->text("notes")->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_order_checklists');
    }
};
