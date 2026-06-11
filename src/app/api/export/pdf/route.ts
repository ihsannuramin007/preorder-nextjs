import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

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
    const type = request.nextUrl.searchParams.get("type") ?? "orders";

    const orders = await prisma.order.findMany({
      where: { campaign: { storeId: store.id } },
      include: { campaign: true, items: true },
      orderBy: { createdAt: "desc" },
    });

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Laporan POHub</title>
  <style>
    body { font-family: sans-serif; font-size: 12px; color: #111; }
    h1 { font-size: 18px; margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
    th { background: #f3f4f6; font-weight: 600; }
  </style>
</head>
<body>
  <h1>Laporan Pesanan — ${store.name}</h1>
  <p>Diekspor: ${new Date().toLocaleDateString("id-ID")}</p>
  <table>
    <thead>
      <tr>
        <th>No. Pesanan</th>
        <th>Pelanggan</th>
        <th>Total</th>
        <th>Status</th>
        <th>Kampanye</th>
      </tr>
    </thead>
    <tbody>
      ${orders
        .map(
          (o) => `
        <tr>
          <td>${o.orderNumber}</td>
          <td>${o.customerName}</td>
          <td>Rp ${Number(o.totalAmount).toLocaleString("id-ID")}</td>
          <td>${o.status}</td>
          <td>${o.campaign.name}</td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": "attachment; filename=laporan-pesanan.html",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
