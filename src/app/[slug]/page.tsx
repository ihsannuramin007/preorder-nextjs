import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { formatDate } from "@/lib/utils/date";
import { MessageCircle, Instagram, Package, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) return { title: "Toko tidak ditemukan" };
  return {
    title: `${store.name} | POHub`,
    description: store.description ?? `Toko ${store.name} di POHub`,
    openGraph: {
      title: store.name,
      description: store.description ?? "",
      images: store.logoUrl ? [store.logoUrl] : [],
    },
  };
}

export default async function PublicStorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const store = await prisma.store.findFirst({
    where: { slug, isActive: true },
    include: {
      products: {
        where: { status: "PUBLISHED" },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      },
      campaigns: {
        where: {
          status: "OPEN",
          openDate: { lte: new Date() },
          closeDate: { gte: new Date() },
        },
        include: {
          products: {
            include: { product: true },
          },
        },
        orderBy: { closeDate: "asc" },
      },
    },
  });

  if (!store) notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 pb-16 pt-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-4 overflow-hidden">
            {store.logoUrl ? (
              <Image
                src={store.logoUrl}
                alt={store.name}
                fill
                className="object-cover"
                sizes="80px"
                priority
              />
            ) : (
              <Package className="h-10 w-10 text-primary-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{store.name}</h1>
          {store.description && (
            <p className="text-muted-foreground mt-2 text-sm max-w-sm">{store.description}</p>
          )}
          <div className="flex gap-2 mt-4">
            {store.whatsapp && (
              <Button asChild size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                <a
                  href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  WhatsApp
                </a>
              </Button>
            )}
            {store.instagram && (
              <Button asChild size="sm" variant="outline">
                <a
                  href={`https://instagram.com/${store.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-4 w-4 mr-1" />
                  Instagram
                </a>
              </Button>
            )}
          </div>
        </div>

        {store.campaigns.length > 0 && (
          <div className="mb-8 space-y-3">
            <h2 className="text-lg font-semibold">Pre-Order Aktif</h2>
            {store.campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="rounded-card border border-primary-200 bg-primary-50 p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-primary-900">{campaign.name}</h3>
                    <p className="text-xs text-primary-700">
                      Tutup: {formatDate(campaign.closeDate)}
                    </p>
                  </div>
                  <Badge variant="success" className="flex-shrink-0">Buka</Badge>
                </div>
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/${store.slug}/pesan/${campaign.id}`}>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Pesan Sekarang
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/${store.slug}/pesan/${campaign.id}/grup`}>
                      <Users className="h-4 w-4 mr-2" />
                      Group Order
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {store.products.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Produk</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {store.products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-card border border-border bg-white overflow-hidden"
                >
                  <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm">{product.name}</p>
                    <CurrencyDisplay
                      amount={Number(product.basePrice)}
                      size="sm"
                      className="text-primary-700 font-medium mt-0.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {store.products.length === 0 && store.campaigns.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p>Belum ada produk yang tersedia.</p>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-12">
          Dibuat dengan ❤️ menggunakan{" "}
          <a href="/" className="text-primary-600 hover:underline">POHub</a>
        </p>
      </div>
    </div>
  );
}
