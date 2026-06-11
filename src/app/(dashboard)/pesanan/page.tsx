import { Suspense } from "react";
import Link from "next/link";
import { getOrders } from "@/actions/orders";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ListSkeleton } from "@/components/shared/loading-skeleton";
import { ListSearch, ListPagination } from "@/components/shared/list-controls";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { formatRelative } from "@/lib/utils/date";
import { ShoppingBag, Search } from "lucide-react";
import type { OrderStatus } from "@prisma/client";

const PAGE_SIZE = 10;

const statusConfig: Record<OrderStatus, { label: string; variant: any }> = {
  PENDING_PAYMENT: { label: "Menunggu Bayar", variant: "secondary" },
  PAYMENT_REVIEW: { label: "Verifikasi", variant: "warning" },
  PAID: { label: "Lunas", variant: "success" },
  PRODUCTION: { label: "Produksi", variant: "info" },
  READY: { label: "Siap Kirim", variant: "default" },
  COMPLETED: { label: "Selesai", variant: "outline" },
  CANCELLED: { label: "Batal", variant: "destructive" },
};

async function OrderList({ q, page }: { q?: string; page: number }) {
  const { data: orders, total } = await getOrders({ search: q, page, pageSize: PAGE_SIZE });

  if (orders.length === 0) {
    return q ? (
      <div className="text-center py-16 text-muted-foreground">
        <Search className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p className="text-sm">Tidak ada hasil untuk <span className="font-medium">"{q}"</span></p>
      </div>
    ) : (
      <EmptyState
        icon={ShoppingBag}
        title="Belum ada pesanan"
        description="Pesanan dari pelanggan akan muncul di sini setelah kamu membuka periode PO."
      />
    );
  }

  return (
    <>
      <div className="space-y-3">
        {orders.map((order) => {
          const cfg = statusConfig[order.status];
          return (
            <Link
              key={order.id}
              href={`/pesanan/${order.id}`}
              className="block rounded-card border border-border bg-white p-4 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatRelative(order.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge variant={cfg.variant} className="mb-1">{cfg.label}</Badge>
                  <CurrencyDisplay amount={order.totalAmount} size="sm" className="block text-primary-700 font-semibold" />
                  <p className="text-xs text-muted-foreground mt-0.5">{order.items.length} item</p>
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

export default async function PesananPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1") || 1);

  return (
    <>
      <PageHeader
        title="Pesanan"
        description="Kelola semua pesanan dari pelanggan"
      />
      <div className="mb-3">
        <ListSearch defaultValue={q ?? ""} placeholder="Cari nama pelanggan atau nomor pesanan..." />
      </div>
      <Suspense key={`${q}-${page}`} fallback={<ListSkeleton />}>
        <OrderList q={q} page={page} />
      </Suspense>
    </>
  );
}
