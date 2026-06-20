"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  status: "COLLECTING" | "CLOSED" | "PAYMENT_REVIEW" | "PAID" | "CANCELLED";
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
      };
    }[];
  };
};

export function MemberOrderClient({
  group,
  slug,
  campaignId,
  sessionCode,
}: {
  group: GroupData;
  slug: string;
  campaignId: string;
  sessionCode: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [memberName, setMemberName] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const orderItems = Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([productId, quantity]) => ({ productId, quantity }));

  const total = orderItems.reduce((sum, item) => {
    const cp = group.campaign.products.find((cp) => cp.product.id === item.productId);
    return sum + (cp ? cp.product.basePrice * item.quantity : 0);
  }, 0);

  function handleQty(productId: string, delta: number) {
    setQuantities((prev) => {
      const next = (prev[productId] ?? 0) + delta;
      if (next <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: next };
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
              {group.campaign.products.map((cp) => {
                const qty = quantities[cp.product.id] ?? 0;
                return (
                  <div
                    key={cp.product.id}
                    className="flex items-center justify-between gap-3 border-b last:border-0 pb-4 last:pb-0"
                  >
                    <div>
                      <p className="font-semibold">{cp.product.name}</p>
                      <CurrencyDisplay
                        amount={cp.product.basePrice}
                        size="sm"
                        className="text-primary-700 font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQty(cp.product.id, -1)}
                        disabled={qty === 0}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center disabled:opacity-40"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{qty}</span>
                      <button
                        type="button"
                        onClick={() => handleQty(cp.product.id, 1)}
                        className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
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
