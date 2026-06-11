import { Suspense } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function SuksesContent({
  searchParams,
  slug,
  campaignId,
  sessionCode,
}: {
  searchParams: Record<string, string>;
  slug: string;
  campaignId: string;
  sessionCode: string;
}) {
  const nama = searchParams.nama ?? "Kamu";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-9 w-9 text-green-600" />
        </div>
        <h1 className="text-xl font-bold mb-2">Pesanan Berhasil!</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Pilihan <strong>{decodeURIComponent(nama)}</strong> sudah ditambahkan ke group order.
          Tagihan akan diurus oleh penanggung grup.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/${slug}/pesan/${campaignId}/grup/${sessionCode}`}>
            Kembali ke Halaman Grup
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default async function SuksesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; campaignId: string; sessionCode: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { slug, campaignId, sessionCode } = await params;
  const sp = await searchParams;

  return (
    <Suspense>
      <SuksesContent
        searchParams={sp}
        slug={slug}
        campaignId={campaignId}
        sessionCode={sessionCode}
      />
    </Suspense>
  );
}
