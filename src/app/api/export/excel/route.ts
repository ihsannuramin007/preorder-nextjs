import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

async function getStore() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { store: true },
  });
  if (!dbUser?.store) throw new Error("Store not found");
  return dbUser.store;
}

export async function GET(request: NextRequest) {
  try {
    const store = await getStore();

    const orders = await prisma.order.findMany({
      where: { campaign: { storeId: store.id } },
      include: { campaign: true, items: true },
      orderBy: { createdAt: "desc" },
    });

    const rows = orders.map((o) => ({
      "Nomor Pesanan": o.orderNumber,
      "Nama Pelanggan": o.customerName,
      "No HP": o.customerPhone,
      "Alamat": o.customerAddress,
      "Total (Rp)": Number(o.totalAmount),
      "HPP (Rp)": Number(o.totalHpp),
      "Status": o.status,
      "Kampanye": o.campaign.name,
      "Tanggal": o.createdAt.toISOString().split("T")[0],
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pesanan");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=laporan-pesanan.xlsx",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
