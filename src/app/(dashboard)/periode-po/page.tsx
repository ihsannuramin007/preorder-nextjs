import { Suspense } from "react";
import Link from "next/link";
import { getCampaigns } from "@/actions/campaigns";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ListSkeleton } from "@/components/shared/loading-skeleton";
import { formatShortDate } from "@/lib/utils/date";
import { Plus, Calendar, ChevronRight } from "lucide-react";
import type { CampaignStatus } from "@prisma/client";

const statusConfig: Record<CampaignStatus, { label: string; variant: any }> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  OPEN: { label: "Buka", variant: "success" },
  CLOSED: { label: "Tutup", variant: "warning" },
  PRODUCTION: { label: "Produksi", variant: "info" },
  COMPLETED: { label: "Selesai", variant: "outline" },
  CANCELLED: { label: "Batal", variant: "destructive" },
};

async function CampaignList() {
  const campaigns = await getCampaigns();

  if (campaigns.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="Belum ada periode PO"
        description="Buat periode PO untuk mulai menerima pesanan dari pelanggan."
        ctaLabel="Buat Periode PO"
        ctaHref="/periode-po/baru"
        testId="empty-periode-po-list"
      />
    );
  }

  return (
    <div className="space-y-2" data-testid="tbl-periode-po">
      {campaigns.map((campaign) => {
        const cfg = statusConfig[campaign.status];
        return (
          <Link key={campaign.id} href={`/periode-po/${campaign.id}`} data-testid={`row-periode-po-${campaign.id}`}>
            <Card className="hover:border-primary-300 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold truncate">{campaign.name}</p>
                    <Badge variant={cfg.variant} className="flex-shrink-0">{cfg.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatShortDate(campaign.openDate)} — {formatShortDate(campaign.closeDate)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {campaign._count.orders} pesanan · {campaign.products.length} produk
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

export default function PeriodePOPage() {
  return (
    <>
      <PageHeader
        title="Periode PO"
        description="Kelola kampanye pre-order kamu"
        actions={
          <Button asChild data-testid="btn-buat-periode-po">
            <Link href="/periode-po/baru">
              <Plus className="h-4 w-4 mr-1" />
              Buat Periode PO
            </Link>
          </Button>
        }
      />
      <Suspense fallback={<ListSkeleton testId="loading-periode-po" />}>
        <CampaignList />
      </Suspense>
    </>
  );
}
