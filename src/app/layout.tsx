import type { Metadata } from "next";
import { plusJakartaSans } from "@/lib/fonts";
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
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast: "!rounded-full !border-2 !border-[#0D0D0D] !shadow-sticker !font-sans",
              success: "!bg-[#FFD400] !text-[#111111]",
              error: "!bg-[#FF3B6B] !text-white",
            },
          }}
        />
      </body>
    </html>
  );
}
