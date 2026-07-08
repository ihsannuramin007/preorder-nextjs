import { notFound } from "next/navigation";
import { getIngredient } from "@/actions/ingredients";
import { PenyesuaianClient } from "./penyesuaian-client";

export default async function SesuaikanStokPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ingredient = await getIngredient(id);
  if (!ingredient) notFound();

  return <PenyesuaianClient ingredient={ingredient} />;
}
