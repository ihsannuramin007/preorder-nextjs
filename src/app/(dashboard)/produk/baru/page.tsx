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
import { ImageUpload } from "@/components/shared/image-upload";
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

  const steps = ["Informasi Dasar", "Varian", "Harga & Publikasi"];

  return (
    <>
      <PageHeader
        title="Buat Produk Baru"
        actions={
          <Button variant="ghost" asChild>
            <Link href="/produk">
              <ArrowLeft className="h-4 w-4 mr-1" />Kembali
            </Link>
          </Button>
        }
      />

      <div className="max-w-form space-y-6">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                  step === i + 1
                    ? "bg-[#FF3B6B] text-white border-[#0D0D0D] shadow-sticker-sm"
                    : step > i + 1
                    ? "bg-[#FFD400] text-[#111111] border-[#0D0D0D]"
                    : "bg-[#F7F7F7] text-[#9A9A9A] border-[#E5E7EB]"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-xs hidden sm:block font-semibold ${
                  step === i + 1 ? "text-[#111111]" : "text-[#9A9A9A]"
                }`}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-[#E5E7EB] mx-1 min-w-[20px]" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 — Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image upload */}
              <div className="space-y-1.5">
                <Label>Foto Produk</Label>
                <div className="max-w-[180px]">
                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  />
                </div>
                <p className="text-[11px] text-[#9A9A9A]">
                  Opsional. Foto akan ditampilkan di halaman toko.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Produk <span className="text-[#FF3B6B]">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Kopi Susu Gula Aren"
                  required
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
                />
              </div>

              <div className="space-y-1.5">
                <Label>Kategori</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={() => setStep(2)}>
                Lanjut →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2 — Variants */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Varian Produk</CardTitle>
              <p className="text-sm text-[#9A9A9A]">
                Opsional. Tambahkan varian jika produk memiliki pilihan ukuran, rasa, dll.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((v, i) => (
                <div
                  key={i}
                  className="flex gap-2 items-start border-2 border-[#0D0D0D] rounded-lg p-3 shadow-sticker-sm"
                >
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
                      onChange={(e) =>
                        updateVariant(i, "priceAdjustment", parseFloat(e.target.value) || 0)
                      }
                    />
                    <Input
                      placeholder="SKU (opsional)"
                      value={v.sku}
                      onChange={(e) => updateVariant(i, "sku", e.target.value)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeVariant(i)}
                    className="text-[#FF3B6B] hover:bg-[#FFF0F4] hover:text-[#FF3B6B] mt-0.5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button variant="outline" onClick={addVariant} className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Tambah Varian
              </Button>

              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                  ← Kembali
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Lanjut →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 — Price & Publish */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Harga &amp; Publikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="basePrice">
                  Harga Jual (Rp) <span className="text-[#FF3B6B]">*</span>
                </Label>
                <Input
                  id="basePrice"
                  type="number"
                  min="0"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  placeholder="25000"
                  required
                />
                <p className="text-xs text-[#9A9A9A]">
                  Harga dasar. Varian dapat menambah/mengurangi harga ini.
                </p>
              </div>

              {/* Summary */}
              <div className="rounded-lg border-2 border-[#0D0D0D] p-4 bg-[#F7F7F7] space-y-2 shadow-sticker-sm">
                <p className="text-sm font-bold text-[#111111]">Ringkasan Produk</p>
                {formData.imageUrl && (
                  <div className="w-12 h-12 rounded-lg border-2 border-[#0D0D0D] overflow-hidden">
                    <img
                      src={formData.imageUrl}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-sm text-[#9A9A9A]">Nama: <span className="text-[#111111] font-semibold">{formData.name || "—"}</span></p>
                <p className="text-sm text-[#9A9A9A]">
                  Varian: <span className="text-[#111111] font-semibold">{variants.filter((v) => v.name).length} varian</span>
                </p>
                <p className="text-sm text-[#9A9A9A]">
                  Status:{" "}
                  <span className="inline-flex items-center rounded-full bg-[#F7F7F7] border border-[#E5E7EB] px-2 py-0.5 text-xs font-semibold text-[#111111]">
                    Draft
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
                  ← Kembali
                </Button>
                <Button onClick={handleSubmit} disabled={isPending} className="flex-1">
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
