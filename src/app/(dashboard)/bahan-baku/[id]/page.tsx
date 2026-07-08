"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { getIngredient, updateIngredient, deleteIngredient } from "@/actions/ingredients";
import { UNIT_OPTIONS } from "@/lib/constants/units";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { FormSkeleton } from "@/components/shared/loading-skeleton";

type SerializedIngredient = NonNullable<Awaited<ReturnType<typeof getIngredient>>>;

export default function BahanBakuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [ingredient, setIngredient] = useState<SerializedIngredient | null>(null);
  const [unit, setUnit] = useState<string>("");

  useEffect(() => {
    getIngredient(id).then((i) => {
      if (i) {
        setIngredient(i);
        setUnit(i.unit);
      } else {
        router.push("/bahan-baku");
      }
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) return <FormSkeleton />;

  function handleSubmit(formData: FormData) {
    formData.set("unit", unit);
    startTransition(async () => {
      const result = await updateIngredient(id, formData);
      if (result.success) {
        toast.success("Bahan baku berhasil diperbarui!");
        router.push("/bahan-baku");
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteIngredient(id);
      if (result.success) {
        toast.success("Bahan baku dihapus");
        router.push("/bahan-baku");
      } else {
        toast.error(result.error);
      }
    });
  }

  if (!ingredient) return null;

  return (
    <>
      <PageHeader
        title="Edit Bahan Baku"
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/bahan-baku"><ArrowLeft className="h-4 w-4 mr-1" />Kembali</Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(true)} aria-label="Hapus bahan baku" data-testid="btn-hapus-bahan-baku">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        }
      />
      <Card className="max-w-form">
        <CardHeader>
          <CardTitle className="text-base">Edit Informasi Bahan Baku</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Bahan</Label>
              <Input id="name" name="name" defaultValue={ingredient.name} required data-testid="txt-nama-bahan" />
            </div>

            <div className="space-y-1.5">
              <Label>Satuan</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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
                  defaultValue={String(ingredient.purchaseQty)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="purchasePrice">Harga Pembelian (Rp)</Label>
                <Input
                  id="purchasePrice"
                  name="purchasePrice"
                  type="number"
                  defaultValue={String(ingredient.purchasePrice)}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isPending} data-testid="btn-simpan-bahan-baku">
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Hapus Bahan Baku"
        description="Tindakan ini tidak bisa dibatalkan. Bahan baku yang digunakan dalam resep akan ikut terhapus."
        confirmLabel="Hapus"
        variant="destructive"
        onConfirm={handleDelete}
        loading={isPending}
        testId="modal-hapus-bahan-baku"
      />
    </>
  );
}
