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
  ChevronRight,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pesanan", label: "Pesanan", icon: ShoppingBag },
  { href: "/pesanan/grup", label: "Group Order", icon: Users },
  { href: "/periode-po", label: "Periode PO", icon: Calendar },
  { href: "/produk", label: "Produk", icon: Package },
  { href: "/bahan-baku", label: "Bahan Baku", icon: FlaskConical },
  { href: "/toko", label: "Toko Saya", icon: Store },
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
    <aside className="hidden md:flex w-60 flex-col fixed left-0 top-0 h-full bg-white border-r border-border z-40">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        <span className="font-bold text-lg text-foreground">POHub</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 flex-shrink-0",
                  isActive ? "text-primary-600" : "text-muted-foreground"
                )}
              />
              {item.label}
              {isActive && (
                <ChevronRight className="ml-auto h-3 w-3 text-primary-500" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
