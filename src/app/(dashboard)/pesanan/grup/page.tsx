import { getDashboardGroupOrders } from "@/actions/group-orders";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { Users } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils/date";

const STATUS_CONFIG = {
  COLLECTING: { label: "Mengumpulkan", variant: "warning" as const },
  CLOSED: { label: "Ditutup", variant: "secondary" as const },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" as const },
};

export default async function GroupOrdersPage() {
  const groupOrders = await getDashboardGroupOrders();

  return (
    <>
      <PageHeader
        title="Group Order"
        description="Sesi order bersama yang tagihan ke satu orang"
      />

      {groupOrders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>Belum ada group order.</p>
          <p className="text-sm mt-1">Group order dibuat langsung dari halaman toko publik.</p>
        </div>
      ) : (
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
                    <CurrencyDisplay amount={Number(go.totalAmount)} size="sm" className="block text-primary-700 font-semibold" />
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(go.createdAt)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
