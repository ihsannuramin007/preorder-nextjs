import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionCode: string }> }
) {
  try {
    const { sessionCode } = await params;

    const groupOrder = await prisma.groupOrder.findUnique({
      where: { sessionCode },
      include: {
        memberOrders: {
          orderBy: { createdAt: "asc" },
          include: {
            items: { orderBy: { productName: "asc" } },
          },
        },
      },
    });

    if (!groupOrder) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const members = groupOrder.memberOrders.map((m) => ({
      id: m.id,
      memberName: m.memberName,
      subtotal: Number(m.subtotal),
      items: m.items.map((i) => ({
        id: i.id,
        productName: i.productName,
        unitPrice: Number(i.unitPrice),
        quantity: i.quantity,
        subtotal: Number(i.subtotal),
      })),
    }));

    return NextResponse.json(members);
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
