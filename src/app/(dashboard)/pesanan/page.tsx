import { Suspense } from "react";
import Link from "next/link";
import { getOrders } from "@/actions/orders";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ListSkeleton } from "@/components/shared/loading-skeleton";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { formatRelative } from "@/lib/utils/date";
import { ShoppingBag, ChevronRight } from "lucide-react";
import type { OrderStatus } from "@prisma/client";

const statusConfig: Record<OrderStatus, { label: string; variant: any }> = {
  PENDING_PAYMENT: { label: "Menunggu Bayar", variant: "secondary" },
  PAYMENT_REVIEW: { label: "Verifikasi", variant: "warning" },
  PAID: { label: "Lunas", variant: "success" },
  PRODUCTION: { label: "Produksi", variant: "info" },
  READY: { label: "Siap Kirim", variant: "default" },
  COMPLETED: { label: "Selesai", variant: "outline" },
  CANCELLED: { label: "Batal", variant: "destructive" },
};

async function OrderList() {
  const orders = await getOrders();

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Belum ada pesanan"
        description="Pesanan dari pelanggan akan muncul di sini setelah kamu membuka periode PO."
      />
    );
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => {
        const cfg = statusConfig[order.status];
        return (
          <Link key={order.id} href={`/pesanan/${order.id}`}>
            <Card className="hover:border-primary-300 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold truncate">{order.customerName}</p>
                    <Badge variant={cfg.variant} className="flex-shrink-0 text-xs">{cfg.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{formatRelative(order.createdAt)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <CurrencyDisplay amount={Number(order.totalAmount)} size="sm" className="font-semibold" />
                  <p className="text-xs text-muted-foreground">{order.items.length} item</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default function PesananPage() {
  return (
    <>
      <PageHeader
        title="Pesanan"
        description="Kelola semua pesanan dari pelanggan"
      />
      <Suspense fallback={<ListSkeleton />}>
        <OrderList />
      </Suspense>
    </>
  );
}
