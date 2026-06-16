"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { calculateHpp } from "@/lib/utils/hpp";
import type { ActionResult } from "@/types";

async function getStore() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/masuk");
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { store: true },
  });
  if (!dbUser?.store) throw new Error("Toko belum dibuat");
  return dbUser.store;
}

import type { Order, OrderItem, Campaign } from "@prisma/client";

function serializeOrder<T extends Order & { items: OrderItem[]; campaign?: Campaign | null }>(o: T) {
  return {
    ...o,
    totalAmount: Number(o.totalAmount),
    totalHpp: Number(o.totalHpp),
    items: o.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      unitHpp: Number(item.unitHpp),
      subtotal: Number(item.subtotal),
    })),
  };
}

async function generateOrderNumber(storeId: string): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.order.count({
    where: { campaign: { storeId } },
  });
  return `PO-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function getOrders(filters?: {
  status?: OrderStatus;
  search?: string;
  campaignId?: string;
  page?: number;
  pageSize?: number;
}) {
  const store = await getStore();
  const pageSize = filters?.pageSize ?? 10;
  const page = filters?.page ?? 1;
  const skip = (page - 1) * pageSize;

  const where = {
    campaign: { storeId: store.id },
    ...(filters?.status ? { status: filters.status } : {}),
    ...(filters?.campaignId ? { campaignId: filters.campaignId } : {}),
    ...(filters?.search
      ? {
          OR: [
            { customerName: { contains: filters.search, mode: "insensitive" as const } },
            { orderNumber: { contains: filters.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { campaign: true, items: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return { data: rows.map(serializeOrder), total };
}

export async function getOrder(id: string) {
  const store = await getStore();
  const row = await prisma.order.findFirst({
    where: { id, campaign: { storeId: store.id } },
    include: { campaign: true, items: true },
  });
  return row ? serializeOrder(row) : null;
}

export async function createPublicOrder(data: {
  campaignId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes?: string;
  items: { variantId: string; quantity: number }[];
}): Promise<ActionResult<{ orderNumber: string }>> {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: data.campaignId },
      include: { store: true },
    });

    if (!campaign) return { success: false, error: "Periode PO tidak ditemukan" };
    if (campaign.status !== "OPEN") return { success: false, error: "Periode PO sudah tidak aktif" };
    if (new Date() > campaign.closeDate) return { success: false, error: "Periode PO sudah berakhir" };

    const orderNumber = await generateOrderNumber(campaign.storeId);

    let totalAmount = 0;
    let totalHpp = 0;

    const orderItems = await Promise.all(
      data.items.map(async (item) => {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: {
            product: {
              include: {
                recipeItems: { include: { ingredient: true } },
                additionalCosts: true,
              },
            },
          },
        });

        if (!variant) throw new Error("Varian tidak ditemukan");

        const unitPrice =
          Number(variant.product.basePrice) + Number(variant.priceAdjustment);
        const unitHpp = calculateHpp(
          variant.product.recipeItems.map((ri) => ({
            quantity: Number(ri.quantity),
            ingredient: { averageCost: Number(ri.ingredient.averageCost) },
          })),
          variant.product.additionalCosts.map((c) => ({ amount: Number(c.amount) }))
        );
        const subtotal = unitPrice * item.quantity;

        totalAmount += subtotal;
        totalHpp += unitHpp * item.quantity;

        return {
          variantId: item.variantId,
          productName: variant.product.name,
          variantName: variant.name,
          unitPrice,
          unitHpp,
          quantity: item.quantity,
          subtotal,
        };
      })
    );

    const order = await prisma.order.create({
      data: {
        campaignId: data.campaignId,
        orderNumber,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        customerNotes: data.customerNotes,
        totalAmount,
        totalHpp,
        items: { create: orderItems },
      },
    });

    return { success: true, data: { orderNumber: order.orderNumber } };
  } catch (e) {
    return { success: false, error: "Terjadi kesalahan saat membuat pesanan" };
  }
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<ActionResult> {
  try {
    const store = await getStore();
    await prisma.order.update({
      where: { id, campaign: { storeId: store.id } },
      data: { status },
    });
    revalidatePath("/pesanan");
    revalidatePath(`/pesanan/${id}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Terjadi kesalahan" };
  }
}

export async function bulkUpdateOrderStatus(
  ids: string[],
  status: OrderStatus
): Promise<ActionResult> {
  try {
    const store = await getStore();
    await prisma.order.updateMany({
      where: { id: { in: ids }, campaign: { storeId: store.id } },
      data: { status },
    });
    revalidatePath("/pesanan");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Terjadi kesalahan" };
  }
}

export async function uploadPaymentProof(
  orderId: string,
  proofUrl: string
): Promise<ActionResult> {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentProofUrl: proofUrl,
        status: "PAYMENT_REVIEW",
      },
    });
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Terjadi kesalahan" };
  }
}
