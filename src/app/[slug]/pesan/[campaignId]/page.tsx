"use client";

import { useState, useTransition, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { createPublicOrder } from "@/actions/orders";
import { Plus, Minus, ShoppingBag } from "lucide-react";

type CampaignData = {
  id: string;
  name: string;
  store: { name: string; slug: string };
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

export default function OrderFormPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const campaignId = params.campaignId as string;
  const [isPending, startTransition] = useTransition();
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customerData, setCustomerData] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    customerNotes: "",
  });

  useEffect(() => {
    fetch(`/api/campaigns/${campaignId}`).then((r) => r.json()).then(setCampaign);
  }, [campaignId]);

  const orderItems = Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([variantId, quantity]) => ({ variantId, quantity }));

  const total = campaign
    ? orderItems.reduce((sum, item) => {
        let price = 0;
        for (const cp of campaign.products) {
          const variant = cp.product.variants.find((v) => v.id === item.variantId);
          if (variant) {
            price = cp.product.basePrice + variant.priceAdjustment;
            break;
          }
        }
        return sum + price * item.quantity;
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
    if (orderItems.length === 0) {
      toast.error("Pilih minimal 1 produk");
      return;
    }

    startTransition(async () => {
      const result = await createPublicOrder({
        campaignId,
        ...customerData,
        items: orderItems,
      });

      if (result.success) {
        router.push(`/${slug}/pesan/${campaignId}/sukses?no=${result.data.orderNumber}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">{campaign.store.name}</p>
          <h1 className="text-xl font-bold">{campaign.name}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Pilih Produk</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {campaign.products.map((cp) => (
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
                              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-sm disabled:opacity-40"
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

          <Card>
            <CardHeader><CardTitle className="text-base">Informasi Pengiriman</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="customerName">Nama Lengkap</Label>
                <Input
                  id="customerName"
                  value={customerData.customerName}
                  onChange={(e) => setCustomerData({ ...customerData, customerName: e.target.value })}
                  placeholder="Nama sesuai KTP"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customerPhone">Nomor HP / WhatsApp</Label>
                <Input
                  id="customerPhone"
                  value={customerData.customerPhone}
                  onChange={(e) => setCustomerData({ ...customerData, customerPhone: e.target.value })}
                  placeholder="08123456789"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customerAddress">Alamat Lengkap</Label>
                <Textarea
                  id="customerAddress"
                  value={customerData.customerAddress}
                  onChange={(e) => setCustomerData({ ...customerData, customerAddress: e.target.value })}
                  placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan, Kota"
                  rows={2}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customerNotes">Catatan (opsional)</Label>
                <Input
                  id="customerNotes"
                  value={customerData.customerNotes}
                  onChange={(e) => setCustomerData({ ...customerData, customerNotes: e.target.value })}
                  placeholder="Instruksi khusus..."
                />
              </div>
            </CardContent>
          </Card>

          {total > 0 && (
            <div className="flex justify-between items-center rounded-card border border-border bg-white p-4">
              <span className="font-semibold">Total Pembayaran</span>
              <CurrencyDisplay amount={total} size="lg" className="text-primary-700 font-bold" />
            </div>
          )}

          <Button type="submit" disabled={isPending || orderItems.length === 0} className="w-full">
            <ShoppingBag className="h-4 w-4 mr-2" />
            {isPending ? "Memproses..." : "Kirim Pesanan"}
          </Button>
        </form>
      </div>
    </div>
  );
}
