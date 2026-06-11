import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { TrendingUp, TrendingDown, DollarSign, Package } from "lucide-react";

async function ProfitContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { store: true },
  });
  if (!dbUser?.store) return <p className="text-muted-foreground">Buat toko terlebih dahulu.</p>;

  const result = await prisma.order.aggregate({
    where: {
      campaign: { storeId: dbUser.store.id },
      status: { in: ["PAID", "PRODUCTION", "READY", "COMPLETED"] },
    },
    _sum: { totalAmount: true, totalHpp: true },
    _count: true,
  });

  const revenue = Number(result._sum.totalAmount ?? 0);
  const totalHpp = Number(result._sum.totalHpp ?? 0);
  const profit = revenue - totalHpp;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  const metrics = [
    { label: "Total Pendapatan", value: revenue, icon: DollarSign, color: "text-primary-600" },
    { label: "Total HPP", value: totalHpp, icon: Package, color: "text-muted-foreground" },
    { label: "Estimasi Keuntungan", value: profit, icon: profit >= 0 ? TrendingUp : TrendingDown, color: profit >= 0 ? "text-success" : "text-error" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <m.icon className={`h-4 w-4 ${m.color}`} />
                <span className="text-sm text-muted-foreground">{m.label}</span>
              </div>
              <CurrencyDisplay amount={m.value} size="xl" className={m.color} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Margin Keuntungan</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div
              className="text-4xl font-bold"
              style={{ color: margin >= 0 ? "#10b981" : "#ef4444" }}
            >
              {margin.toFixed(1)}%
            </div>
            <div className="flex-1">
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(Math.abs(margin), 100)}%`,
                    backgroundColor: margin >= 0 ? "#10b981" : "#ef4444",
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                dari {result._count} pesanan lunas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Cara Membaca</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p><strong>Pendapatan</strong> = total pembayaran dari pelanggan yang sudah lunas</p>
          <p><strong>HPP</strong> = total biaya bahan baku untuk semua produk yang dipesan</p>
          <p><strong>Keuntungan</strong> = Pendapatan − HPP (belum termasuk biaya operasional lain)</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function KeuntunganPage() {
  return (
    <>
      <PageHeader
        title="Keuntungan"
        description="Pantau estimasi keuntungan berdasarkan data HPP"
      />
      <Suspense fallback={<PageSkeleton />}>
        <ProfitContent />
      </Suspense>
    </>
  );
}
