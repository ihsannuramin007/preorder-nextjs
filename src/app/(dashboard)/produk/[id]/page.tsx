import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, getProductCapacity, getProductionRecords } from "@/actions/products";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ProductDetailTabs } from "@/components/products/product-detail-tabs";
import { ArrowLeft } from "lucide-react";
import { DeleteProductButton } from "./delete-product-button";

export default async function ProdukDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const [capacity, productionRecords] = await Promise.all([
    getProductCapacity(id),
    getProductionRecords(id),
  ]);

  return (
    <>
      <PageHeader
        title={product.name}
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/produk">
                <ArrowLeft className="h-4 w-4 mr-1" />Produk
              </Link>
            </Button>
            <DeleteProductButton productId={product.id} />
          </div>
        }
      />

      <ProductDetailTabs
        product={product}
        capacity={capacity}
        productionRecords={productionRecords}
      />
    </>
  );
}
