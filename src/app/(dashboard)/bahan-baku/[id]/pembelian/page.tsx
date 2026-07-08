import { notFound } from "next/navigation";
import { getIngredient } from "@/actions/ingredients";
import { PembelianClient } from "./pembelian-client";

export default async function CatatPembelianPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ingredient = await getIngredient(id);
  if (!ingredient) notFound();

  return <PembelianClient ingredient={ingredient} />;
}
