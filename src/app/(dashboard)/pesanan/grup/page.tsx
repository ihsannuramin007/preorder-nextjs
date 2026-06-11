import { Suspense } from "react";
import Link from "next/link";
import { getDashboardGroupOrders } from "@/actions/group-orders";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ListSkeleton } from "@/components/shared/loading-skeleton";
import { ListSearch, ListPagination } from "@/components/shared/list-controls";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { formatDate } from "@/lib/utils/date";
import { Users, Search } from "lucide-react";

const PAGE_SIZE = 10;

const STATUS_CONFIG = {
  COLLECTING: { label: "Mengumpulkan", variant: "warning" as const },
  CLOSED: { label: "Ditutup", variant: "secondary" as const },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" as const },
};

async function GroupOrderList({ q, page }: { q?: string; page: number }) {
  const { data: groupOrders, total } = await getDashboardGroupOrders({ search: q, page, pageSize: PAGE_SIZE });

  if (groupOrders.length === 0) {
    return q ? (
      <div className="text-center py-16 text-muted-foreground">
        <Search className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p className="text-sm">Tidak ada hasil untuk <span className="font-medium">"{q}"</span></p>
      </div>
    ) : (
      <EmptyState
        icon={Users}
        title="Belum ada group order"
        description="Group order dibuat langsung dari halaman toko publik."
      />
    );
  }

  return (
    <>
      <div className="space-y-3">
        {groupOrders.map((go) => {
          const cfg = STATUS_CONFIG[go.status];
          return (
            <Link
              key={go.id}
              href={`/pesanan/grup/${go.id}`}
              className="block rounded-card border border-border bg-white p-4 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{go.facilitatorName}</p>
                    <p className="text-xs text-muted-foreground">{go.campaign.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Kode: <span className="font-mono font-medium">{go.sessionCode}</span> · {go._count.memberOrders} anggota
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge variant={cfg.variant} className="mb-1">{cfg.label}</Badge>
                  <CurrencyDisplay amount={go.totalAmount} size="sm" className="block text-primary-700 font-semibold" />
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(go.createdAt)}</p>
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

export default async function GroupOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1") || 1);

  return (
    <>
      <PageHeader
        title="Group Order"
        description="Sesi order bersama yang tagihan ke satu orang"
      />
      <div className="mb-3">
        <ListSearch defaultValue={q ?? ""} placeholder="Cari nama fasilitator atau kode sesi..." />
      </div>
      <Suspense key={`${q}-${page}`} fallback={<ListSkeleton />}>
        <GroupOrderList q={q} page={page} />
      </Suspense>
    </>
  );
}
