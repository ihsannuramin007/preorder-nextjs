"use client";

import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { createOrUpdateStore, getStore } from "@/actions/store";
import { generateSlug } from "@/lib/utils/slug";
import { ExternalLink, Copy } from "lucide-react";

export default function TokoPage() {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [store, setStore] = useState<any>(null);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    getStore().then((s) => {
      if (s) {
        setStore(s);
        setSlug(s.slug);
        setName(s.name);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <FormSkeleton />;

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setName(val);
    if (!store) {
      setSlug(generateSlug(val));
    }
  }

  function handleSubmit(formData: FormData) {
    formData.set("slug", slug);
    startTransition(async () => {
      const result = await createOrUpdateStore(formData);
      if (result.success) {
        setStore(result.data);
        toast.success("Toko berhasil disimpan!");
      } else {
        toast.error(result.error);
      }
    });
  }

  const storeUrl = store
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? "https://pohub.app"}/${store.slug}`
    : null;

  return (
    <>
      <PageHeader
        title="Toko Saya"
        description="Kelola profil dan tampilan toko kamu"
      />

      {storeUrl && (
        <Card className="mb-6 bg-primary-50 border-primary-200">
          <CardContent className="py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary-800">URL Toko Publik</p>
              <p className="text-sm text-primary-600 font-mono">{storeUrl}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(storeUrl);
                  toast.success("URL disalin!");
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profil Toko</CardTitle>
          <CardDescription>Informasi yang akan ditampilkan ke pelanggan</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Toko</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Contoh: Kopi Bu Ani"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">
                URL Toko{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (hanya huruf kecil, angka, dan tanda hubung)
                </span>
              </Label>
              <div className="flex rounded-input overflow-hidden border border-input focus-within:ring-2 focus-within:ring-ring">
                <span className="flex items-center bg-muted px-3 text-sm text-muted-foreground border-r border-input whitespace-nowrap">
                  pohub.app/
                </span>
                <input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="flex-1 h-12 px-3 text-sm bg-white outline-none"
                  placeholder="nama-toko-kamu"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Deskripsi Toko</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={store?.description ?? ""}
                placeholder="Ceritakan tentang toko kamu..."
                rows={3}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  defaultValue={store?.whatsapp ?? ""}
                  placeholder="628123456789"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  defaultValue={store?.instagram ?? ""}
                  placeholder="@namatoko"
                />
              </div>
            </div>

            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
