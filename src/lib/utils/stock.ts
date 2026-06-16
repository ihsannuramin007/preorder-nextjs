import type { Prisma } from "@prisma/client";

type TxClient = Prisma.TransactionClient;

export async function applyPurchase(
  tx: TxClient,
  ingredientId: string,
  currentStock: number,
  averageCost: number,
  quantity: number,
  totalCost: number,
  performedBy: string,
  note?: string
) {
  const newStock = currentStock + quantity;
  const newAverageCost =
    newStock > 0 ? (currentStock * averageCost + totalCost) / newStock : 0;
  const unitCost = totalCost / quantity;

  await tx.ingredient.update({
    where: { id: ingredientId },
    data: {
      currentStock: newStock,
      averageCost: newAverageCost,
      purchaseQty: quantity,
      purchasePrice: totalCost,
    },
  });

  await tx.stockMovement.create({
    data: {
      ingredientId,
      type: "PURCHASE",
      quantityChange: quantity,
      resultingStock: newStock,
      unitCost,
      note,
      performedBy,
    },
  });

  return { newStock, newAverageCost };
}
