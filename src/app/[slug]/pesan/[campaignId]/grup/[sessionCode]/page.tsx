"use client";

import { useState, useTransition, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { addMemberOrder } from "@/actions/group-orders";
import { Users, Plus, Minus, ShoppingBag, Lock } from "lucide-react";

type GroupData = {
  id: string;
  sessionCode: string;
  facilitatorName: string;
  status: "COLLECTING" | "CLOSED" | "CANCELLED";
  memberCount: number;
  campaign: {
    id: string;
    name: string;
    products: {
      product: {
        id: string;
        name: string;
        basePrice: number;
        imageUrl: string | null;
        variants: { id: string; name: string; priceAdjustment: number }[];
      };
    }[];
  };
};

export default function MemberOrderPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const campaignId = params.campaignId as string;
  const sessionCode = params.sessionCode as string;
  const [isPending, startTransition] = useTransition();
  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [memberName, setMemberName] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch(`/api/group-orders/${sessionCode}`)
      .then((r) => r.json())
      .then((data) => {
        setGroup(data.error ? null : data);
        setLoading(false);
      });
  }, [sessionCode]);

  const orderItems = Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([variantId, quantity]) => ({ variantId, quantity }));

  const total = group
    ? orderItems.reduce((sum, item) => {
        for (const cp of group.campaign.products) {
          const v = cp.product.variants.find((v) => v.id === item.variantId);
          if (v) return sum + (cp.product.basePrice + v.priceAdjustment) * item.quantity;
        }
        return sum;
      }, 0)
    : 0;

  function handleQty(variantId: string, delta: number) {
    setQuantities((prev) => {
      const next = (prev[variantId] ?? 0) + delta;
      if (next <= 0) {
        const { [variantId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [variantId]: next };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!memberName.trim()) { toast.error("Masukkan nama kamu"); return; }
    if (orderItems.length === 0) { toast.error("Pilih minimal 1 produk"); return; }

    startTransition(async () => {
      const result = await addMemberOrder(sessionCode, memberName, orderItems);
      if (result.success) {
        router.push(`/${slug}/pesan/${campaignId}/grup/${sessionCode}/sukses?nama=${encodeURIComponent(result.data.memberName)}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Memuat...</div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold">Sesi tidak ditemukan</p>
          <p className="text-sm text-muted-foreground mt-1">Link ini tidak valid atau sudah kadaluarsa.</p>
        </div>
      </div>
    );
  }

  if (group.status !== "COLLECTING") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-semibold">Sesi sudah ditutup</p>
          <p className="text-sm text-muted-foreground mt-1">
            {group.facilitatorName} telah menutup sesi ini. Hubungi mereka untuk info lebih lanjut.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="mb-6 rounded-card bg-primary-50 border border-primary-200 p-4 flex items-start gap-3">
          <Users className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-primary-900">Group Order oleh {group.facilitatorName}</p>
            <p className="text-sm text-primary-700">{group.campaign.name}</p>
            <p className="text-xs text-primary-600 mt-1">{group.memberCount} orang sudah pesan</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Nama Kamu</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                <Label htmlFor="memberName">Nama</Label>
                <Input
                  id="memberName"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Masukkan nama kamu"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Pilih Produk</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {group.campaign.products.map((cp) => (
                <div key={cp.product.id} className="border-b last:border-0 pb-4 last:pb-0">
                  <p className="font-semibold mb-2">{cp.product.name}</p>
                  <div className="space-y-2">
                    {cp.product.variants.map((v) => {
                      const price = cp.product.basePrice + v.priceAdjustment;
                      const qty = quantities[v.id] ?? 0;
                      return (
                        <div key={v.id} className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm">{v.name}</p>
                            <CurrencyDisplay amount={price} size="sm" className="text-primary-700 font-medium" />
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleQty(v.id, -1)}
                              disabled={qty === 0}
                              className="w-8 h-8 rounded-full border border-border flex items-center justify-center disabled:opacity-40"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">{qty}</span>
                            <button
                              type="button"
                              onClick={() => handleQty(v.id, 1)}
                              className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {total > 0 && (
            <div className="flex justify-between items-center rounded-card border border-border bg-white p-4">
              <span className="font-semibold">Total Pilihanmu</span>
              <CurrencyDisplay amount={total} size="lg" className="text-primary-700 font-bold" />
            </div>
          )}

          <Button type="submit" disabled={isPending || orderItems.length === 0} className="w-full">
            <ShoppingBag className="h-4 w-4 mr-2" />
            {isPending ? "Mengirim..." : "Kirim Pilihan"}
          </Button>
        </form>
      </div>
    </div>
  );
}
