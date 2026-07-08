"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Store, ArrowRight } from "lucide-react";

export function StoreCompletionBanner({ isComplete }: { isComplete: boolean }) {
  const pathname = usePathname();

  if (isComplete || pathname === "/toko") return null;

  return (
    <div className="mb-6 flex items-start sm:items-center gap-3 rounded-xl border-2 border-[#0D0D0D] bg-[#FFD400] p-4 shadow-[3px_3px_0px_#0D0D0D] flex-col sm:flex-row sm:justify-between">
      <div className="flex items-start gap-3">
        <Store className="h-5 w-5 text-[#0D0D0D] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-[#0D0D0D]">Yuk, lengkapi profil toko kamu dulu! 😊</p>
          <p className="text-sm text-[#0D0D0D]/80 mt-0.5">
            Beberapa data toko (nama, URL, nomor WhatsApp) belum lengkap. Pelanggan akan lebih mudah
            menemukan dan menghubungi kamu kalau profil tokonya sudah lengkap.
          </p>
        </div>
      </div>
      <Link
        href="/toko"
        className="flex-shrink-0 inline-flex items-center gap-1 rounded-full border-2 border-[#0D0D0D] bg-white px-4 py-2 text-sm font-bold text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-white transition-colors whitespace-nowrap"
      >
        Lengkapi Sekarang
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
