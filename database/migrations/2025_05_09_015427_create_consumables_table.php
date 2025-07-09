<?php

use App\Models\ServiceItemType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Consumables for each service item type
        Schema::create('consumables', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ServiceItemType::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->string("name");
            $table->string("image_path")->nullable();
            $table->unsignedBigInteger("price");
            $table->unsignedMediumInteger("stock")->default(0);
            $table->enum("type", [
                "Pcs",
                "Box"
            ])->default("Pcs");
            $table->unsignedSmallInteger("pcs_per_box")->default(1);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consumables');
    }
};
