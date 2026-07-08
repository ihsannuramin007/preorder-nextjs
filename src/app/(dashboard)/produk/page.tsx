import { Suspense } from "react";
import Link from "next/link";
import { getProducts } from "@/actions/products";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ListSkeleton } from "@/components/shared/loading-skeleton";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { CATEGORY_LABELS } from "@/lib/constants/categories";
import { calculateHpp } from "@/lib/utils/hpp";
import { Plus, Package, ChevronRight } from "lucide-react";
import type { ProductStatus } from "@prisma/client";

const statusConfig: Record<ProductStatus, { label: string; variant: any }> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  PUBLISHED: { label: "Terbit", variant: "success" },
  ARCHIVED: { label: "Arsip", variant: "outline" },
};

async function ProductList() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="Belum ada produk"
        description="Buat produk pertama kamu dan mulai terima pesanan."
        ctaLabel="Buat Produk"
        ctaHref="/produk/baru"
        testId="empty-produk-list"
      />
    );
  }

  return (
    <div className="space-y-2" data-testid="tbl-produk">
      {products.map((product) => {
        const hpp = calculateHpp(
          product.recipeItems.map((ri) => ({
            quantity: Number(ri.quantity),
            ingredient: {
              purchaseQty: Number(ri.ingredient.purchaseQty),
              purchasePrice: Number(ri.ingredient.purchasePrice),
            },
          }))
        );
        const cfg = statusConfig[product.status];

        return (
          <Link key={product.id} href={`/produk/${product.id}`} data-testid={`row-produk-${product.id}`}>
            <Card className="hover:border-primary-300 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold truncate">{product.name}</p>
                    <Badge variant={cfg.variant} className="flex-shrink-0">{cfg.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {CATEGORY_LABELS[product.category]} ·{" "}
                    <CurrencyDisplay amount={Number(product.basePrice)} size="sm" />
                  </p>
                  {hpp > 0 && (
                    <p className="text-xs text-muted-foreground">
                      HPP: <CurrencyDisplay amount={hpp} size="sm" />
                    </p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default function ProdukPage() {
  return (
    <>
      <PageHeader
        title="Produk"
        description="Kelola produk yang kamu jual"
        actions={
          <Button asChild data-testid="btn-buat-produk">
            <Link href="/produk/baru">
              <Plus className="h-4 w-4 mr-1" />
              Buat Produk
            </Link>
          </Button>
        }
      />
      <Suspense fallback={<ListSkeleton testId="loading-produk" />}>
        <ProductList />
      </Suspense>
    </>
  );
}
