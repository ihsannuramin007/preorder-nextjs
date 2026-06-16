import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  const { id } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      store: { select: { name: true, slug: true } },
      products: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              basePrice: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: campaign.id,
    name: campaign.name,
    store: campaign.store,
    products: campaign.products.map((cp) => ({
      product: {
        ...cp.product,
        basePrice: Number(cp.product.basePrice),
      },
    })),
  });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
