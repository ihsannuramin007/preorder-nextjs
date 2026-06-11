import { Suspense } from "react";
import Link from "next/link";
import { getIngredientsList } from "@/actions/ingredients";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ListSkeleton } from "@/components/shared/loading-skeleton";
import { ListSearch, ListPagination } from "@/components/shared/list-controls";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { UNIT_LABELS } from "@/lib/constants/units";
import { Plus, FlaskConical, Search } from "lucide-react";

const PAGE_SIZE = 10;

async function IngredientList({ q, page }: { q?: string; page: number }) {
  const { data: ingredients, total } = await getIngredientsList({ search: q, page, pageSize: PAGE_SIZE });

  if (ingredients.length === 0) {
    return q ? (
      <div className="text-center py-16 text-muted-foreground">
        <Search className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p className="text-sm">Tidak ada hasil untuk <span className="font-medium">"{q}"</span></p>
      </div>
    ) : (
      <EmptyState
        icon={FlaskConical}
        title="Belum ada bahan baku"
        description="Tambahkan bahan baku untuk menghitung biaya produksi (HPP) secara otomatis."
        ctaLabel="Tambah Bahan Baku"
        ctaHref="/bahan-baku/baru"
      />
    );
  }

  return (
    <>
      <div className="space-y-3">
        {ingredients.map((ingredient) => {
          const unitLabel = UNIT_LABELS[ingredient.unit];
          const costPerUnit = ingredient.purchasePrice / ingredient.purchaseQty;

          return (
            <Link
              key={ingredient.id}
              href={`/bahan-baku/${ingredient.id}`}
              className="block rounded-card border border-border bg-white p-4 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <FlaskConical className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{ingredient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ingredient.purchaseQty} {unitLabel} · <CurrencyDisplay amount={ingredient.purchasePrice} size="sm" />
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Per {unitLabel}: <CurrencyDisplay amount={costPerUnit} size="sm" />
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <CurrencyDisplay amount={ingredient.purchasePrice} size="sm" className="block text-primary-700 font-semibold" />
                  <p className="text-xs text-muted-foreground mt-0.5">/{unitLabel}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <ListPagination total={total} page={page} pageSize={PAGE_SIZE} search={q} />
    </>
  );
}

export default async function BahanBakuPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1") || 1);

  return (
    <>
      <PageHeader
        title="Bahan Baku"
        description="Kelola bahan baku untuk perhitungan HPP otomatis"
        actions={
          <Button asChild>
            <Link href="/bahan-baku/baru">
              <Plus className="h-4 w-4 mr-1" />
              Tambah Bahan
            </Link>
          </Button>
        }
      />
      <div className="mb-3">
        <ListSearch defaultValue={q ?? ""} placeholder="Cari nama bahan baku..." />
      </div>
      <Suspense key={`${q}-${page}`} fallback={<ListSkeleton />}>
        <IngredientList q={q} page={page} />
      </Suspense>
    </>
  );
}
