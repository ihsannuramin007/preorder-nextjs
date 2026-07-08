import { getRecipeItems } from "@/actions/recipes";
import { ResepClient } from "./resep-client";

export default async function ResepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipeItems = await getRecipeItems(id);

  return <ResepClient productId={id} initialRecipeItems={recipeItems} />;
}
