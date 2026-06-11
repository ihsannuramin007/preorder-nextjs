type RecipeItemInput = {
  quantity: number;
  ingredient: {
    purchaseQty: number;
    purchasePrice: number;
  };
};

export function calculateIngredientCost(item: RecipeItemInput): number {
  const { quantity, ingredient } = item;
  if (ingredient.purchaseQty === 0) return 0;
  return (ingredient.purchasePrice / ingredient.purchaseQty) * quantity;
}

export function calculateHpp(recipeItems: RecipeItemInput[]): number {
  return recipeItems.reduce(
    (total, item) => total + calculateIngredientCost(item),
    0
  );
}
