"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function generateSessionCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    const existing = await prisma.groupOrder.findUnique({ where: { sessionCode: code } });
    if (!existing) return code;
  }
  throw new Error("Failed to generate unique session code");
}

// ─── Public Actions (no auth) ─────────────────────────────────────────────────

export async function createGroupOrder(data: {
  campaignId: string;
  facilitatorName: string;
  facilitatorPhone: string;
  facilitatorAddress: string;
  facilitatorNotes?: string;
}): Promise<ActionResult<{ sessionCode: string }>> {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: data.campaignId },
    });

    if (!campaign) return { success: false, error: "Kampanye tidak ditemukan" };
    if (campaign.status !== "OPEN") return { success: false, error: "Kampanye ini tidak sedang buka" };
    if (new Date() > campaign.closeDate) return { success: false, error: "Kampanye sudah tutup" };

    const sessionCode = await generateSessionCode();

    await prisma.groupOrder.create({
      data: {
        campaignId: data.campaignId,
        sessionCode,
        facilitatorName: data.facilitatorName.trim(),
        facilitatorPhone: data.facilitatorPhone.trim(),
        facilitatorAddress: data.facilitatorAddress.trim(),
        facilitatorNotes: data.facilitatorNotes?.trim() || null,
      },
    });

    return { success: true, data: { sessionCode } };
  } catch (e) {
    console.error("createGroupOrder:", e);
    return { success: false, error: "Gagal membuat group order" };
  }
}

export async function addMemberOrder(
  sessionCode: string,
  memberName: string,
  items: { variantId: string; quantity: number }[]
): Promise<ActionResult<{ memberName: string }>> {
  try {
    const groupOrder = await prisma.groupOrder.findUnique({
      where: { sessionCode },
    });

    if (!groupOrder) return { success: false, error: "Sesi tidak ditemukan" };
    if (groupOrder.status !== "COLLECTING") return { success: false, error: "Sesi ini sudah ditutup" };
    if (!memberName.trim()) return { success: false, error: "Nama tidak boleh kosong" };
    if (items.length === 0) return { success: false, error: "Pilih minimal 1 produk" };

    let memberSubtotal = 0;
    const itemsWithPrice: {
      variantId: string;
      productName: string;
      variantName: string;
      unitPrice: number;
      quantity: number;
      subtotal: number;
    }[] = [];

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant || !variant.isActive) continue;

      const unitPrice = Number(variant.product.basePrice) + Number(variant.priceAdjustment);
      const subtotal = unitPrice * item.quantity;
      memberSubtotal += subtotal;

      itemsWithPrice.push({
        variantId: item.variantId,
        productName: variant.product.name,
        variantName: variant.name,
        unitPrice,
        quantity: item.quantity,
        subtotal,
      });
    }

    if (itemsWithPrice.length === 0) return { success: false, error: "Tidak ada item valid" };

    await prisma.$transaction(async (tx) => {
      const memberOrder = await tx.groupMemberOrder.create({
        data: {
          groupOrderId: groupOrder.id,
          memberName: memberName.trim(),
          subtotal: memberSubtotal,
          items: {
            create: itemsWithPrice.map((i) => ({
              variantId: i.variantId,
              productName: i.productName,
              variantName: i.variantName,
              unitPrice: i.unitPrice,
              quantity: i.quantity,
              subtotal: i.subtotal,
            })),
          },
        },
      });

      await tx.groupOrder.update({
        where: { id: groupOrder.id },
        data: {
          totalAmount: { increment: memberSubtotal },
        },
      });

      return memberOrder;
    });

    return { success: true, data: { memberName: memberName.trim() } };
  } catch (e) {
    console.error("addMemberOrder:", e);
    return { success: false, error: "Gagal menambahkan pesanan" };
  }
}

export async function getPublicGroupOrder(sessionCode: string) {
  return prisma.groupOrder.findUnique({
    where: { sessionCode },
    include: {
      campaign: {
        include: {
          products: {
            include: {
              product: {
                include: {
                  variants: {
                    where: { isActive: true },
                  },
                },
              },
            },
          },
        },
      },
      memberOrders: {
        orderBy: { createdAt: "asc" },
        include: {
          items: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });
}

export async function closeGroupOrder(sessionCode: string): Promise<ActionResult<void>> {
  try {
    const groupOrder = await prisma.groupOrder.findUnique({ where: { sessionCode } });
    if (!groupOrder) return { success: false, error: "Sesi tidak ditemukan" };

    await prisma.groupOrder.update({
      where: { sessionCode },
      data: { status: "CLOSED" },
    });

    return { success: true, data: undefined };
  } catch (e) {
    console.error("closeGroupOrder:", e);
    return { success: false, error: "Gagal menutup sesi" };
  }
}

// ─── Dashboard Actions (auth required) ────────────────────────────────────────

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

export async function getDashboardGroupOrders() {
  const store = await getStore();

  return prisma.groupOrder.findMany({
    where: { campaign: { storeId: store.id } },
    orderBy: { createdAt: "desc" },
    include: {
      campaign: { select: { name: true } },
      _count: { select: { memberOrders: true } },
    },
  });
}

export async function getDashboardGroupOrder(id: string) {
  const store = await getStore();

  const groupOrder = await prisma.groupOrder.findFirst({
    where: { id, campaign: { storeId: store.id } },
    include: {
      campaign: { select: { name: true, id: true } },
      memberOrders: {
        orderBy: { createdAt: "asc" },
        include: {
          items: { orderBy: { productName: "asc" } },
        },
      },
    },
  });

  return groupOrder;
}

export async function updateGroupOrderStatus(
  id: string,
  status: "COLLECTING" | "CLOSED" | "CANCELLED"
): Promise<ActionResult<void>> {
  try {
    const store = await getStore();

    const groupOrder = await prisma.groupOrder.findFirst({
      where: { id, campaign: { storeId: store.id } },
    });

    if (!groupOrder) return { success: false, error: "Group order tidak ditemukan" };

    await prisma.groupOrder.update({ where: { id }, data: { status } });

    return { success: true, data: undefined };
  } catch (e) {
    console.error("updateGroupOrderStatus:", e);
    return { success: false, error: "Gagal update status" };
  }
}
