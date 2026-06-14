"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Package,
  FlaskConical,
  Calendar,
  TrendingUp,
  FileText,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/toko", label: "Toko Saya", icon: Store },
  { href: "/bahan-baku", label: "Bahan Baku", icon: FlaskConical },
  { href: "/produk", label: "Produk", icon: Package },
  { href: "/periode-po", label: "Periode PO", icon: Calendar },
  { href: "/pesanan", label: "Pesanan", icon: ShoppingBag },
  { href: "/keuntungan", label: "Keuntungan", icon: TrendingUp },
  { href: "/laporan", label: "Laporan", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/masuk");
  }

  return (
    <aside className="hidden md:flex w-60 flex-col fixed left-0 top-0 h-full bg-white border-r-2 border-[#0D0D0D] z-40">
      <div className="flex items-center gap-3 px-5 py-5 border-b-2 border-[#0D0D0D]">
        <div className="w-9 h-9 rounded-xl bg-[#FFD400] border-2 border-[#0D0D0D] shadow-sticker-sm flex items-center justify-center flex-shrink-0">
          <span className="text-[#111111] font-extrabold text-sm">P</span>
        </div>
        <div className="min-w-0">
          <p className="font-extrabold text-base text-[#111111] leading-tight">POHub</p>
          <p className="text-[11px] text-[#9A9A9A] font-medium">Pre-Order Hub</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-semibold transition-all duration-150",
                isActive
                  ? "bg-[#FFD400] text-[#111111] border-2 border-[#0D0D0D] shadow-sticker-sm"
                  : "text-[#9A9A9A] hover:bg-[#F7F7F7] hover:text-[#111111]"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 flex-shrink-0",
                  isActive ? "text-[#111111]" : "text-[#9A9A9A]"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t-2 border-[#0D0D0D]">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-full text-sm font-semibold text-[#9A9A9A] hover:bg-[#FFF0F4] hover:text-[#FF3B6B] transition-all duration-150"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
