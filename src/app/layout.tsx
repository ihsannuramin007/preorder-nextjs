import type { Metadata } from "next";
import { inter } from "@/lib/fonts";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "POHub — Manajemen Pre-Order untuk UMKM",
    template: "%s | POHub",
  },
  description:
    "Platform pre-order paling sederhana untuk UMKM rumahan. Kelola produk, pesanan, dan laporan dalam satu tempat.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
