import { getProducts } from "@/actions/products";
import { PeriodePOBaruClient } from "./baru-client";

export default async function PeriodePOBaruPage() {
  const products = await getProducts();
  const published = products.filter((p) => p.status === "PUBLISHED");

  return <PeriodePOBaruClient products={published} />;
}
