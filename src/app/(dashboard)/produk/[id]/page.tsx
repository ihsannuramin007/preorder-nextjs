import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProduct } from "@/actions/products";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { calculateHpp } from "@/lib/utils/hpp";
import { CATEGORY_LABELS } from "@/lib/constants/categories";
import { UNIT_LABELS } from "@/lib/constants/units";
import { ArrowLeft, FlaskConical, ImageIcon } from "lucide-react";
import type { ProductStatus } from "@prisma/client";
import { DeleteProductButton } from "./delete-product-button";
import { ProductStatusActions } from "./product-status-actions";
import { ProductImageUpload } from "./product-image-upload";

const statusConfig: Record<ProductStatus, { label: string; variant: any }> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  PUBLISHED: { label: "Terbit", variant: "success" },
  ARCHIVED: { label: "Arsip", variant: "outline" },
};

export default async function ProdukDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const hpp = calculateHpp(
    product.recipeItems.map((ri) => ({
      quantity: Number(ri.quantity),
      ingredient: {
        purchaseQty: Number(ri.ingredient.purchaseQty),
        purchasePrice: Number(ri.ingredient.purchasePrice),
      },
    }))
  );

  const margin =
    hpp > 0 ? ((Number(product.basePrice) - hpp) / Number(product.basePrice)) * 100 : 0;
  const cfg = statusConfig[product.status];

  return (
    <>
      <PageHeader
        title={product.name}
        actions={
          <Button variant="ghost" asChild>
            <Link href="/produk">
              <ArrowLeft className="h-4 w-4 mr-1" />Produk
            </Link>
          </Button>
        }
      />

      <div className="grid md:grid-cols-3 gap-4">
        {/* Main content */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{product.name}</CardTitle>
                  <p className="text-sm text-[#9A9A9A] mt-1">
                    {CATEGORY_LABELS[product.category]}
                  </p>
                </div>
                <Badge variant={cfg.variant}>{cfg.label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product image display */}
              {product.imageUrl && (
                <div className="relative w-full aspect-video rounded-lg border-2 border-[#0D0D0D] overflow-hidden shadow-sticker bg-[#F7F7F7]">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                    priority
                  />
                </div>
              )}

              {product.description && (
                <p className="text-sm text-[#9A9A9A]">{product.description}</p>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border-2 border-[#0D0D0D] bg-[#F7F7F7] p-3 text-center shadow-sticker-sm">
                  <p className="text-xs text-[#9A9A9A] mb-1 font-medium">Harga Jual</p>
                  <CurrencyDisplay
                    amount={Number(product.basePrice)}
                    size="sm"
                    className="font-bold text-[#111111]"
                  />
                </div>
                <div className="rounded-lg border-2 border-[#0D0D0D] bg-[#F7F7F7] p-3 text-center shadow-sticker-sm">
                  <p className="text-xs text-[#9A9A9A] mb-1 font-medium">HPP</p>
                  <CurrencyDisplay
                    amount={hpp}
                    size="sm"
                    className="font-bold text-[#9A9A9A]"
                  />
                </div>
                <div className="rounded-lg border-2 border-[#FFD400] bg-[#FFD400] p-3 text-center shadow-sticker-sm">
                  <p className="text-xs text-[#111111] mb-1 font-medium">Margin</p>
                  <p className="font-bold text-sm text-[#111111]">{margin.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {product.variants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Varian</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {product.variants.map((v) => (
                    <div
                      key={v.id}
                      className="flex justify-between py-2 border-b border-[#E5E7EB] last:border-0"
                    >
                      <span className="text-sm font-semibold text-[#111111]">{v.name}</span>
                      <span className="text-sm text-[#9A9A9A]">
                        {Number(v.priceAdjustment) >= 0 ? "+" : ""}
                        <CurrencyDisplay amount={Number(v.priceAdjustment)} size="sm" />
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FlaskConical className="h-4 w-4" />
                  Resep &amp; Bahan Baku
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/produk/${product.id}/resep`}>Edit Resep</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {product.recipeItems.length === 0 ? (
                <p className="text-sm text-[#9A9A9A] text-center py-4">
                  Belum ada resep. Tambahkan bahan baku untuk menghitung HPP.
                </p>
              ) : (
                <div className="space-y-2">
                  {product.recipeItems.map((ri) => (
                    <div
                      key={ri.id}
                      className="flex justify-between py-2 border-b border-[#E5E7EB] last:border-0"
                    >
                      <span className="text-sm text-[#111111]">{ri.ingredient.name}</span>
                      <span className="text-sm text-[#9A9A9A]">
                        {Number(ri.quantity)} {UNIT_LABELS[ri.ingredient.unit]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Image upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Foto Produk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProductImageUpload
                productId={product.id}
                initialUrl={product.imageUrl}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductStatusActions productId={product.id} status={product.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" asChild className="w-full">
                <Link href={`/produk/${product.id}/resep`}>
                  <FlaskConical className="h-4 w-4 mr-2" />
                  Edit Resep
                </Link>
              </Button>
              <DeleteProductButton productId={product.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
