"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { createProduct } from "@/actions/products";
import { CATEGORY_OPTIONS } from "@/lib/constants/categories";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

type Variant = { name: string; priceAdjustment: number; sku: string };

export default function ProdukBaruPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState("OTHER");
  const [step, setStep] = useState(1);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    imageUrl: "",
  });

  function addVariant() {
    setVariants([...variants, { name: "", priceAdjustment: 0, sku: "" }]);
  }

  function removeVariant(i: number) {
    setVariants(variants.filter((_, idx) => idx !== i));
  }

  function updateVariant(i: number, field: keyof Variant, value: string | number) {
    setVariants(variants.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));
  }

  function handleSubmit() {
    if (!formData.name || !formData.basePrice) {
      toast.error("Nama produk dan harga wajib diisi");
      return;
    }

    startTransition(async () => {
      const result = await createProduct({
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl || undefined,
        category,
        basePrice: parseFloat(formData.basePrice),
        status: "DRAFT",
        variants: variants.filter((v) => v.name.trim()),
      });

      if (result.success) {
        toast.success("Produk berhasil dibuat!");
        router.push(`/produk/${result.data.id}/resep`);
      } else {
        toast.error(result.error);
      }
    });
  }

  const steps = [
    "Informasi Dasar",
    "Varian",
    "Harga & Publikasi",
  ];

  return (
    <>
      <PageHeader
        title="Buat Produk Baru"
        actions={
          <Button variant="ghost" asChild>
            <Link href="/produk"><ArrowLeft className="h-4 w-4 mr-1" />Kembali</Link>
          </Button>
        }
      />

      <div className="max-w-form space-y-6">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === i + 1
                    ? "bg-primary-600 text-white"
                    : step > i + 1
                    ? "bg-primary-100 text-primary-700"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${step === i + 1 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {s}
              </span>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-border mx-1 min-w-[20px]" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Informasi Dasar</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Produk</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Kopi Susu Gula Aren"
                  required
                  data-testid="txt-nama-produk"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ceritakan produk ini..."
                  rows={3}
                  data-testid="ta-deskripsi-produk"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Kategori</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger data-testid="ddl-kategori"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={() => setStep(2)} data-testid="btn-lanjut-step-1">
                Lanjut →
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Varian Produk</CardTitle>
              <p className="text-sm text-muted-foreground">
                Opsional. Tambahkan varian jika produk memiliki pilihan ukuran, rasa, dll.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((v, i) => (
                <div key={i} className="flex gap-2 items-start border border-border rounded-lg p-3">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Nama varian (mis: 250ml)"
                      value={v.name}
                      onChange={(e) => updateVariant(i, "name", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Selisih harga (mis: 5000 atau -2000)"
                      value={v.priceAdjustment}
                      onChange={(e) => updateVariant(i, "priceAdjustment", parseFloat(e.target.value) || 0)}
                    />
                    <Input
                      placeholder="SKU (opsional)"
                      value={v.sku}
                      onChange={(e) => updateVariant(i, "sku", e.target.value)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeVariant(i)}>
                    <Trash2 className="h-4 w-4 text-error" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addVariant} className="w-full" data-testid="btn-tambah-varian">
                <Plus className="h-4 w-4 mr-1" />
                Tambah Varian
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1" data-testid="btn-kembali-step-2">← Kembali</Button>
                <Button onClick={() => setStep(3)} className="flex-1" data-testid="btn-lanjut-step-2">Lanjut →</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Harga & Publikasi</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="basePrice">Harga Jual (Rp)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  min="0"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  placeholder="25000"
                  required
                  data-testid="txt-harga-dasar"
                />
                <p className="text-xs text-muted-foreground">
                  Harga dasar. Varian dapat menambah/mengurangi harga ini.
                </p>
              </div>

              <div className="rounded-card border border-border p-4 bg-muted/30 space-y-2">
                <p className="text-sm font-medium">Ringkasan Produk</p>
                <p className="text-sm text-muted-foreground">Nama: {formData.name || "—"}</p>
                <p className="text-sm text-muted-foreground">
                  Varian: {variants.filter((v) => v.name).length} varian
                </p>
                <p className="text-sm text-muted-foreground">
                  Produk akan disimpan sebagai <strong>Draft</strong>. Kamu bisa mengubah ke Terbit kapan saja.
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1" data-testid="btn-kembali-step-3">← Kembali</Button>
                <Button onClick={handleSubmit} disabled={isPending} className="flex-1" data-testid="btn-buat-produk-submit">
                  {isPending ? "Menyimpan..." : "Buat Produk"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
