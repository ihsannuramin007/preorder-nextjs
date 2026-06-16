"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { createCampaign } from "@/actions/campaigns";
import { getProducts } from "@/actions/products";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

type SerializedProduct = Awaited<ReturnType<typeof getProducts>>[0];

export function PeriodePOBaruClient({ products }: { products: SerializedProduct[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    openDate: "",
    closeDate: "",
  });

  function toggleProduct(id: string) {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedProductIds.length === 0) {
      toast.error("Pilih minimal 1 produk");
      return;
    }

    startTransition(async () => {
      const result = await createCampaign({
        name: formData.name,
        description: formData.description,
        openDate: new Date(formData.openDate),
        closeDate: new Date(formData.closeDate),
        productIds: selectedProductIds,
      });

      if (result.success) {
        toast.success("Periode PO berhasil dibuat!");
        router.push(`/periode-po/${result.data.id}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      <PageHeader
        title="Buat Periode PO"
        actions={
          <Button variant="ghost" asChild>
            <Link href="/periode-po"><ArrowLeft className="h-4 w-4 mr-1" />Kembali</Link>
          </Button>
        }
      />
      <form onSubmit={handleSubmit} className="max-w-form space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Informasi Periode PO</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Periode PO</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: PO Mingguan #1 - Juni 2024"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Deskripsi (opsional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Info tambahan untuk pelanggan..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="openDate">Tanggal Buka</Label>
                <Input
                  id="openDate"
                  type="datetime-local"
                  value={formData.openDate}
                  onChange={(e) => setFormData({ ...formData, openDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="closeDate">Tanggal Tutup</Label>
                <Input
                  id="closeDate"
                  type="datetime-local"
                  value={formData.closeDate}
                  onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pilih Produk</CardTitle>
            <p className="text-sm text-muted-foreground">
              Hanya produk dengan status Terbit yang bisa dipilih
            </p>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Belum ada produk yang terbit.
                </p>
                <Button variant="outline" size="sm" asChild className="mt-2">
                  <Link href="/produk">Kelola Produk</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {products.map((p) => {
                  const selected = selectedProductIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleProduct(p.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                        selected
                          ? "border-primary-500 bg-primary-50"
                          : "border-border hover:border-primary-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                          selected ? "bg-primary-600" : "border border-input"
                        }`}
                      >
                        {selected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className="text-sm font-medium">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Membuat..." : "Buat Periode PO"}
        </Button>
      </form>
    </>
  );
}
