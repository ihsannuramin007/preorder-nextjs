import { Unit } from "@prisma/client";

type OrderItemWithRecipe = {
  quantity: number;
  variant?: {
    product: {
      recipeItems: {
        quantity: number;
        ingredient: {
          id: string;
          name: string;
          unit: Unit;
          purchaseQty: number;
          purchasePrice: number;
        };
      }[];
    };
  } | null;
};

export type IngredientNeed = {
  ingredientId: string;
  ingredientName: string;
  unit: Unit;
  totalQuantity: number;
  estimatedCost: number;
};

export function generateProductionNeeds(
  orderItems: OrderItemWithRecipe[]
): IngredientNeed[] {
  const map = new Map<string, IngredientNeed>();

  for (const item of orderItems) {
    const recipe = item.variant?.product?.recipeItems ?? [];
    for (const ri of recipe) {
      const { ingredient } = ri;
      const qty = ri.quantity * item.quantity;
      const costPerUnit =
        ingredient.purchaseQty > 0
          ? ingredient.purchasePrice / ingredient.purchaseQty
          : 0;
      const cost = costPerUnit * qty;

      const existing = map.get(ingredient.id);
      if (existing) {
        existing.totalQuantity += qty;
        existing.estimatedCost += cost;
      } else {
        map.set(ingredient.id, {
          ingredientId: ingredient.id,
          ingredientName: ingredient.name,
          unit: ingredient.unit,
          totalQuantity: qty,
          estimatedCost: cost,
        });
      }
    }
  }

  return Array.from(map.values());
}
