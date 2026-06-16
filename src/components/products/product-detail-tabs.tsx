"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { AdditionalCostSection } from "@/components/products/additional-cost-section";
import { ProfitSimulator } from "@/components/products/profit-simulator";
import { calculateIngredientsCost, calculateAdditionalCostsTotal } from "@/lib/utils/hpp";
import { CATEGORY_LABELS } from "@/lib/constants/categories";
import { UNIT_LABELS } from "@/lib/constants/units";
import { toDisplayUnit } from "@/lib/utils/units";
import type { getProduct, getProductionRecords } from "@/actions/products";
import type { getAdditionalCosts } from "@/actions/additional-costs";
import { FlaskConical, ImageIcon, Factory, History } from "lucide-react";
import type { ProductStatus } from "@prisma/client";
import { ProductImageUpload } from "@/app/(dashboard)/produk/[id]/product-image-upload";
import { ProductStatusActions } from "@/app/(dashboard)/produk/[id]/product-status-actions";

type ProductForTabs = NonNullable<Awaited<ReturnType<typeof getProduct>>>;
type AdditionalCostItem = Awaited<ReturnType<typeof getAdditionalCosts>>[number];
type ProductionRecord = Awaited<ReturnType<typeof getProductionRecords>>[number];

const statusConfig: Record<ProductStatus, { label: string; variant: any }> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  PUBLISHED: { label: "Terbit", variant: "success" },
  ARCHIVED: { label: "Arsip", variant: "outline" },
};

export function ProductDetailTabs({
  product,
  capacity,
  productionRecords,
}: {
  product: ProductForTabs;
  capacity: number;
  productionRecords: ProductionRecord[];
}) {
  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCostItem[]>(
    product.additionalCosts
  );

  const ingredientsCost = calculateIngredientsCost(
    product.recipeItems.map((ri) => ({
      quantity: Number(ri.quantity),
      ingredient: { averageCost: Number(ri.ingredient.averageCost) },
    }))
  );
  const additionalCostTotal = calculateAdditionalCostsTotal(additionalCosts);
  const hpp = ingredientsCost + additionalCostTotal;
  const cfg = statusConfig[product.status];

  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="recipe">Resep</TabsTrigger>
        <TabsTrigger value="costing">HPP</TabsTrigger>
        <TabsTrigger value="production">Produksi</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
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
            <div className="rounded-lg border-2 border-[#0D0D0D] bg-[#F7F7F7] p-3 text-center shadow-sticker-sm">
              <p className="text-xs text-[#9A9A9A] mb-1 font-medium">Harga Jual</p>
              <CurrencyDisplay
                amount={Number(product.basePrice)}
                size="sm"
                className="font-bold text-[#111111]"
              />
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
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Foto Produk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductImageUpload productId={product.id} initialUrl={product.imageUrl} />
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
      </TabsContent>

      <TabsContent value="recipe" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FlaskConical className="h-4 w-4" />
                Resep &amp; Bahan Baku
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/produk/${product.id}/resep`}>Edit Resep Lengkap</Link>
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
                {product.recipeItems.map((ri) => {
                  const display = toDisplayUnit(Number(ri.quantity), ri.ingredient.unit);
                  return (
                    <div
                      key={ri.id}
                      className="flex justify-between py-2 border-b border-[#E5E7EB] last:border-0"
                    >
                      <span className="text-sm text-[#111111]">{ri.ingredient.name}</span>
                      <span className="text-sm text-[#9A9A9A]">
                        {display.value} {UNIT_LABELS[display.unit]}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="costing" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total HPP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Biaya Bahan</span>
              <CurrencyDisplay amount={ingredientsCost} size="sm" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Biaya Tambahan</span>
              <CurrencyDisplay amount={additionalCostTotal} size="sm" />
            </div>
            <div className="flex justify-between text-sm font-semibold border-t pt-2">
              <span>Total HPP</span>
              <CurrencyDisplay amount={hpp} size="sm" className="text-primary-700" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Biaya Tambahan</CardTitle>
          </CardHeader>
          <CardContent>
            <AdditionalCostSection
              productId={product.id}
              initialCosts={additionalCosts}
              onChange={setAdditionalCosts}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Simulasi Harga &amp; Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfitSimulator hpp={hpp} product={product} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="production" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Factory className="h-4 w-4" />
              Kapasitas Produksi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-[#0D0D0D] bg-[#F7F7F7] p-4 text-center">
              <p className="text-xs text-[#9A9A9A] mb-1">Bisa Produksi</p>
              <p className="font-bold text-2xl text-[#111111]">
                {Number.isFinite(capacity) ? `${capacity} pcs` : "—"}
              </p>
              {!Number.isFinite(capacity) && (
                <p className="text-xs text-[#9A9A9A] mt-1">Belum ada resep</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4" />
              Riwayat Produksi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productionRecords.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Belum ada produksi. Mulai produksi dari halaman Periode PO.
              </p>
            ) : (
              <div className="space-y-2">
                {productionRecords.map((r) => (
                  <div key={r.id} className="flex justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{r.campaign.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.productionDate).toLocaleDateString("id-ID")} · {r.producedBy}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">{r.quantity} pcs</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
