"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { createIngredient } from "@/actions/ingredients";
import { UNIT_OPTIONS } from "@/lib/constants/units";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BahanBakuBaruPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createIngredient(formData);
      if (result.success) {
        toast.success("Bahan baku berhasil ditambahkan!");
        router.push("/bahan-baku");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      <PageHeader
        title="Tambah Bahan Baku"
        actions={
          <Button variant="ghost" asChild>
            <Link href="/bahan-baku"><ArrowLeft className="h-4 w-4 mr-1" />Kembali</Link>
          </Button>
        }
      />
      <Card className="max-w-form">
        <CardHeader>
          <CardTitle className="text-base">Informasi Bahan Baku</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Bahan</Label>
              <Input id="name" name="name" placeholder="Contoh: Kopi Arabika" required data-testid="txt-nama-bahan" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="unit">Satuan</Label>
              <Select name="unit" required>
                <SelectTrigger id="unit" data-testid="ddl-satuan">
                  <SelectValue placeholder="Pilih satuan" />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.map((u) => (
                    <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="purchaseQty">Jumlah Pembelian</Label>
                <Input
                  id="purchaseQty"
                  name="purchaseQty"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="1"
                  required
                  data-testid="txt-jumlah-pembelian"
                />
                <p className="text-xs text-muted-foreground">Contoh: 1 (untuk 1 kg)</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="purchasePrice">Harga Pembelian (Rp)</Label>
                <Input
                  id="purchasePrice"
                  name="purchasePrice"
                  type="number"
                  min="0"
                  placeholder="180000"
                  required
                  data-testid="txt-harga-pembelian"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isPending} className="flex-1 sm:flex-none" data-testid="btn-simpan-bahan-baku">
                {isPending ? "Menyimpan..." : "Simpan Bahan Baku"}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/bahan-baku">Batal</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
