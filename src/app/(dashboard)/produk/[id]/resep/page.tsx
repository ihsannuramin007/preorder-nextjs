"use client";

import { useState, useEffect, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { addRecipeItem, removeRecipeItem, getRecipeItems } from "@/actions/recipes";
import { getIngredients } from "@/actions/ingredients";
import { calculateHpp } from "@/lib/utils/hpp";
import { UNIT_LABELS } from "@/lib/constants/units";
import { ArrowLeft, Plus, Trash2, FlaskConical } from "lucide-react";
import Link from "next/link";
import { ListSkeleton } from "@/components/shared/loading-skeleton";

type RecipeWithIngredient = Awaited<ReturnType<typeof getRecipeItems>>[0];
type SerializedIngredient = Awaited<ReturnType<typeof getIngredients>>[0];

export default function ResepPage() {
  const params = useParams();
  const productId = params.id as string;
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [recipeItems, setRecipeItems] = useState<RecipeWithIngredient[]>([]);
  const [ingredients, setIngredients] = useState<SerializedIngredient[]>([]);
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    Promise.all([getRecipeItems(productId), getIngredients()]).then(
      ([recipe, ings]) => {
        setRecipeItems(recipe as RecipeWithIngredient[]);
        setIngredients(ings);
        setIsLoading(false);
      }
    );
  }, [productId]);

  if (isLoading) return <ListSkeleton count={3} />;

  const availableIngredients = ingredients.filter(
    (ing) => !recipeItems.some((ri) => ri.ingredientId === ing.id)
  );

  const hpp = calculateHpp(
    recipeItems.map((ri) => ({
      quantity: Number(ri.quantity),
      ingredient: {
        purchaseQty: Number(ri.ingredient.purchaseQty),
        purchasePrice: Number(ri.ingredient.purchasePrice),
      },
    }))
  );

  function handleAdd() {
    if (!selectedIngredientId || !quantity || parseFloat(quantity) <= 0) {
      toast.error("Pilih bahan dan masukkan jumlah");
      return;
    }

    startTransition(async () => {
      const result = await addRecipeItem(
        productId,
        selectedIngredientId,
        parseFloat(quantity)
      );
      if (result.success) {
        const [recipe] = await Promise.all([getRecipeItems(productId)]);
        setRecipeItems(recipe as RecipeWithIngredient[]);
        setSelectedIngredientId("");
        setQuantity("");
        toast.success("Bahan ditambahkan!");
      } else {
        toast.error(result.error);
      }
    });
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
                HPP Otomatis
              </CardTitle>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total HPP</p>
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
                  const costPerUnit =
                    Number(ri.ingredient.purchasePrice) / Number(ri.ingredient.purchaseQty);
                  const cost = costPerUnit * Number(ri.quantity);
                  return (
                    <div
                      key={ri.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">{ri.ingredient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {Number(ri.quantity)} {UNIT_LABELS[ri.ingredient.unit]} ·{" "}
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
          <CardContent className="space-y-3">
            {availableIngredients.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Semua bahan sudah ditambahkan.
                </p>
                <Button variant="outline" asChild size="sm" className="mt-2">
                  <Link href="/bahan-baku/baru">+ Bahan Baru</Link>
                </Button>
              </div>
            ) : (
              <>
                <select
                  className="flex h-12 w-full rounded-input border border-input bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={selectedIngredientId}
                  onChange={(e) => setSelectedIngredientId(e.target.value)}
                >
                  <option value="">Pilih bahan baku...</option>
                  {availableIngredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name} ({UNIT_LABELS[ing.unit]})
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Jumlah"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAdd} disabled={isPending}>
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Button asChild className="w-full">
          <Link href={`/produk/${productId}`}>Selesai</Link>
        </Button>
      </div>
    </>
  );
}
