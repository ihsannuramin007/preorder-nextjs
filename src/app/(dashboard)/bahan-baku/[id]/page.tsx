import { notFound } from "next/navigation";
import { getIngredient } from "@/actions/ingredients";
import { IngredientDetailClient } from "./ingredient-detail-client";

export default async function BahanBakuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ingredient = await getIngredient(id);
  if (!ingredient) notFound();

  return <IngredientDetailClient ingredient={ingredient} />;
}
