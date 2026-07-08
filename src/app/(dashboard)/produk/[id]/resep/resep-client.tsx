"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { AddIngredientDialog } from "@/components/products/add-ingredient-dialog";
import { removeRecipeItem, getRecipeItems } from "@/actions/recipes";
import { calculateHpp } from "@/lib/utils/hpp";
import { UNIT_LABELS } from "@/lib/constants/units";
import { toDisplayUnit } from "@/lib/utils/units";
import { ArrowLeft, Trash2, FlaskConical } from "lucide-react";
import Link from "next/link";

type RecipeWithIngredient = Awaited<ReturnType<typeof getRecipeItems>>[0];

export function ResepClient({
  productId,
  initialRecipeItems,
}: {
  productId: string;
  initialRecipeItems: RecipeWithIngredient[];
}) {
  const [isPending, startTransition] = useTransition();
  const [recipeItems, setRecipeItems] = useState<RecipeWithIngredient[]>(initialRecipeItems);

  const hpp = calculateHpp(
    recipeItems.map((ri) => ({
      quantity: Number(ri.quantity),
      ingredient: { averageCost: Number(ri.ingredient.averageCost) },
    }))
  );

  function refreshRecipe() {
    getRecipeItems(productId).then((recipe) => setRecipeItems(recipe as RecipeWithIngredient[]));
  }

  function handleRemove(ingredientId: string) {
    startTransition(async () => {
      const result = await removeRecipeItem(productId, ingredientId);
      if (result.success) {
        setRecipeItems((prev) => prev.filter((ri) => ri.ingredientId !== ingredientId));
        toast.success("Bahan dihapus");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      <PageHeader
        title="Resep Produk"
        description="Tentukan bahan baku yang digunakan untuk menghitung HPP otomatis"
        actions={
          <Button variant="ghost" asChild>
            <Link href={`/produk/${productId}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />Kembali
            </Link>
          </Button>
        }
      />

      <div className="max-w-form space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FlaskConical className="h-4 w-4" />
                Biaya Bahan
              </CardTitle>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Subtotal Bahan</p>
                <CurrencyDisplay amount={hpp} size="lg" className="text-primary-700" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {recipeItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Belum ada bahan. Tambahkan bahan untuk menghitung HPP.
              </p>
            ) : (
              <div className="space-y-2">
                {recipeItems.map((ri) => {
                  const cost = Number(ri.ingredient.averageCost) * Number(ri.quantity);
                  const display = toDisplayUnit(Number(ri.quantity), ri.ingredient.unit);
                  return (
                    <div
                      key={ri.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">{ri.ingredient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {display.value} {UNIT_LABELS[display.unit]} ·{" "}
                          <CurrencyDisplay amount={cost} size="sm" />
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemove(ri.ingredientId)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-error" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Tambah Bahan</CardTitle></CardHeader>
          <CardContent>
            <AddIngredientDialog
              productId={productId}
              existingIngredientIds={recipeItems.map((ri) => ri.ingredientId)}
              onAdded={refreshRecipe}
            />
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          Biaya tambahan (kemasan, gas, dll) dikelola di tab HPP pada halaman produk.
        </p>

        <Button asChild className="w-full">
          <Link href={`/produk/${productId}`}>Selesai</Link>
        </Button>
      </div>
    </>
  );
}
