"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { CampaignStatus } from "@prisma/client";
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

export async function getCampaigns() {
  const store = await getStore();
  return prisma.campaign.findMany({
    where: { storeId: store.id },
    include: {
      products: { include: { product: true } },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCampaign(id: string) {
  const store = await getStore();
  return prisma.campaign.findFirst({
    where: { id, storeId: store.id },
    include: {
      products: { include: { product: { include: { variants: true } } } },
      orders: { include: { items: true } },
    },
  });
}

export async function createCampaign(data: {
  name: string;
  description?: string;
  openDate: Date;
  closeDate: Date;
  productIds: string[];
}): Promise<ActionResult<{ id: string }>> {
  try {
    const store = await getStore();
    const campaign = await prisma.campaign.create({
      data: {
        storeId: store.id,
        name: data.name,
        description: data.description,
        openDate: data.openDate,
        closeDate: data.closeDate,
        products: {
          create: data.productIds.map((productId) => ({ productId })),
        },
      },
    });
    revalidatePath("/periode-po");
    return { success: true, data: { id: campaign.id } };
  } catch {
    return { success: false, error: "Terjadi kesalahan saat membuat periode PO" };
  }
}

export async function updateCampaignStatus(
  id: string,
  status: CampaignStatus
): Promise<ActionResult> {
  try {
    const store = await getStore();
    await prisma.campaign.update({
      where: { id, storeId: store.id },
      data: { status },
    });
    revalidatePath("/periode-po");
    revalidatePath(`/periode-po/${id}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Terjadi kesalahan" };
  }
}

export async function deleteCampaign(id: string): Promise<ActionResult> {
  try {
    const store = await getStore();
    await prisma.campaign.delete({ where: { id, storeId: store.id } });
    revalidatePath("/periode-po");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Terjadi kesalahan" };
  }
}
