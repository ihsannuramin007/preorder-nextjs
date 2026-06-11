"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Store,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Beranda", icon: LayoutDashboard },
  { href: "/pesanan", label: "Pesanan", icon: ShoppingBag },
  { href: "/produk", label: "Produk", icon: Package },
  { href: "/toko", label: "Toko", icon: Store },
  { href: "/keuntungan", label: "Akun", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#0D0D0D] z-40 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full min-w-[52px] min-h-[44px] justify-center transition-all duration-150",
                isActive
                  ? "bg-[#FFD400] text-[#111111] border-2 border-[#0D0D0D] shadow-sticker-sm"
                  : "text-[#9A9A9A] hover:text-[#111111]"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
