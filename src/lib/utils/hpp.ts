type RecipeItemInput = {
  quantity: number;
  ingredient: {
    averageCost: number;
  };
};

type AdditionalCostInput = {
  amount: number;
};

export function calculateIngredientCost(item: RecipeItemInput): number {
  return item.quantity * item.ingredient.averageCost;
}

export function calculateIngredientsCost(recipeItems: RecipeItemInput[]): number {
  return recipeItems.reduce((total, item) => total + calculateIngredientCost(item), 0);
}

export function calculateAdditionalCostsTotal(additionalCosts: AdditionalCostInput[]): number {
  return additionalCosts.reduce((total, c) => total + c.amount, 0);
}

export function calculateHpp(
  recipeItems: RecipeItemInput[],
  additionalCosts: AdditionalCostInput[] = []
): number {
  return calculateIngredientsCost(recipeItems) + calculateAdditionalCostsTotal(additionalCosts);
}

export function calculatePriceFromMargin(hpp: number, marginPercent: number): number {
  if (marginPercent >= 100) return Infinity;
  return hpp / (1 - marginPercent / 100);
}

export function calculatePriceFromMarkup(hpp: number, markup: number): number {
  return hpp * markup;
}

export function calculateMargin(sellingPrice: number, hpp: number): number {
  if (sellingPrice === 0) return 0;
  return ((sellingPrice - hpp) / sellingPrice) * 100;
}

export function calculateProfit(sellingPrice: number, hpp: number): number {
  return sellingPrice - hpp;
}
