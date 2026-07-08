import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const ingredients = await prisma.ingredient.findMany();
  console.log(`Backfilling averageCost for ${ingredients.length} ingredients...`);

  for (const ingredient of ingredients) {
    const purchaseQty = Number(ingredient.purchaseQty);
    const purchasePrice = Number(ingredient.purchasePrice);
    const averageCost = purchaseQty > 0 ? purchasePrice / purchaseQty : 0;

    const existingMovement = await prisma.stockMovement.findFirst({
      where: { ingredientId: ingredient.id },
    });

    await prisma.$transaction(async (tx) => {
      await tx.ingredient.update({
        where: { id: ingredient.id },
        data: { averageCost },
      });

      if (!existingMovement) {
        await tx.stockMovement.create({
          data: {
            ingredientId: ingredient.id,
            type: "ADJUSTMENT",
            reason: "CORRECTION",
            quantityChange: 0,
            resultingStock: Number(ingredient.currentStock),
            note: "Migrasi awal — saldo stok dimulai dari 0",
            performedBy: "Sistem (migrasi)",
          },
        });
      }
    });

    console.log(`  ${ingredient.name}: averageCost = ${averageCost}`);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
