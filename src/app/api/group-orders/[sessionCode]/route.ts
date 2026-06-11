import { NextResponse } from "next/server";
import { getPublicGroupOrder } from "@/actions/group-orders";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionCode: string }> }
) {
  try {
    const { sessionCode } = await params;
    const groupOrder = await getPublicGroupOrder(sessionCode);

    if (!groupOrder) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: groupOrder.id,
      sessionCode: groupOrder.sessionCode,
      facilitatorName: groupOrder.facilitatorName,
      status: groupOrder.status,
      totalAmount: Number(groupOrder.totalAmount),
      memberCount: groupOrder.memberOrders.length,
      campaign: {
        id: groupOrder.campaign.id,
        name: groupOrder.campaign.name,
        products: groupOrder.campaign.products.map((cp) => ({
          product: {
            id: cp.product.id,
            name: cp.product.name,
            basePrice: Number(cp.product.basePrice),
            imageUrl: cp.product.imageUrl,
            variants: cp.product.variants.map((v) => ({
              id: v.id,
              name: v.name,
              priceAdjustment: Number(v.priceAdjustment),
            })),
          },
        })),
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
