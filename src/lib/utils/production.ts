import { Unit } from "@prisma/client";

type OrderItemWithRecipe = {
  quantity: number;
  product?: {
    recipeItems: {
      quantity: number;
      ingredient: {
        id: string;
        name: string;
        unit: Unit;
        averageCost: number;
      };
    }[];
  } | null;
};

export type IngredientNeed = {
  ingredientId: string;
  ingredientName: string;
  unit: Unit;
  totalQuantity: number;
  estimatedCost: number;
};

type CapacityRecipeItem = {
  quantity: number;
  ingredient: { currentStock: number };
};

export function calculateCapacity(recipeItems: CapacityRecipeItem[]): number {
  if (recipeItems.length === 0) return Infinity;

  return Math.min(
    ...recipeItems.map((item) =>
      item.quantity > 0 ? Math.floor(item.ingredient.currentStock / item.quantity) : Infinity
    )
  );
}

export function generateProductionNeeds(
  orderItems: OrderItemWithRecipe[]
): IngredientNeed[] {
  const map = new Map<string, IngredientNeed>();

  for (const item of orderItems) {
    const recipe = item.product?.recipeItems ?? [];
    for (const ri of recipe) {
      const { ingredient } = ri;
      const qty = ri.quantity * item.quantity;
      const cost = ingredient.averageCost * qty;

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

export type AvailabilityResult = {
  ready: boolean;
  missing: { ingredientId: string; ingredientName: string; unit: Unit; shortBy: number }[];
};

export function checkAvailability(
  needs: IngredientNeed[],
  stockByIngredientId: Map<string, number>
): AvailabilityResult {
  const missing = needs
    .map((n) => ({ ...n, available: stockByIngredientId.get(n.ingredientId) ?? 0 }))
    .filter((n) => n.available < n.totalQuantity)
    .map((n) => ({
      ingredientId: n.ingredientId,
      ingredientName: n.ingredientName,
      unit: n.unit,
      shortBy: n.totalQuantity - n.available,
    }));

  return { ready: missing.length === 0, missing };
}
