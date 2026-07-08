import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";

export default async function SuksesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; campaignId: string }>;
  searchParams: Promise<{ no?: string }>;
}) {
  const { slug } = await params;
  const { no } = await searchParams;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Pesanan Berhasil!</h1>
          <p className="text-muted-foreground mt-2">
            Pesananmu sudah kami terima. Segera lakukan pembayaran sesuai petunjuk dari toko.
          </p>
        </div>

        {no && (
          <div className="rounded-card border border-border bg-muted p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Nomor Pesananmu</p>
            <p className="text-xl font-bold text-primary-700" data-testid="order-number-display">{no}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Catat nomor ini untuk melacak pesananmu
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href={`/${slug}`}>
              <Home className="h-4 w-4 mr-2" />
              Kembali ke Toko
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
