import { Suspense } from "react";
import Link from "next/link";
import { getIngredients } from "@/actions/ingredients";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ListSkeleton } from "@/components/shared/loading-skeleton";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { UNIT_LABELS } from "@/lib/constants/units";
import { Plus, FlaskConical, ChevronRight } from "lucide-react";

async function IngredientList() {
  const ingredients = await getIngredients();

  if (ingredients.length === 0) {
    return (
      <EmptyState
        icon={FlaskConical}
        title="Belum ada bahan baku"
        description="Tambahkan bahan baku untuk menghitung biaya produksi (HPP) secara otomatis."
        ctaLabel="Tambah Bahan Baku"
        ctaHref="/bahan-baku/baru"
        testId="empty-bahan-baku-list"
      />
    );
  }

  return (
    <div className="space-y-2" data-testid="tbl-bahan-baku">
      {ingredients.map((ingredient) => {
        const unitLabel = UNIT_LABELS[ingredient.unit];
        const costPerUnit = Number(ingredient.purchasePrice) / Number(ingredient.purchaseQty);
        return (
          <Link key={ingredient.id} href={`/bahan-baku/${ingredient.id}`} data-testid={`row-bahan-baku-${ingredient.id}`}>
            <Card className="hover:border-primary-300 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{ingredient.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {Number(ingredient.purchaseQty)} {unitLabel} ·{" "}
                    <CurrencyDisplay amount={Number(ingredient.purchasePrice)} size="sm" />
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Biaya per {unitLabel}:{" "}
                    <CurrencyDisplay amount={costPerUnit} size="sm" />
                  </p>
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

export default function BahanBakuPage() {
  return (
    <>
      <PageHeader
        title="Bahan Baku"
        description="Kelola bahan baku untuk perhitungan HPP otomatis"
        actions={
          <Button asChild data-testid="btn-tambah-bahan-baku">
            <Link href="/bahan-baku/baru">
              <Plus className="h-4 w-4 mr-1" />
              Tambah Bahan
            </Link>
          </Button>
        }
      />
      <Suspense fallback={<ListSkeleton testId="loading-bahan-baku" />}>
        <IngredientList />
      </Suspense>
    </>
  );
}
