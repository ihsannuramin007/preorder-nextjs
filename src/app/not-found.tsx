import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div>
        <p className="text-6xl font-bold text-primary-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-muted-foreground">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  );
}
