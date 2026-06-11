"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { generateProductionNeeds } from "@/lib/utils/production";
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

export async function generateProductionSheet(
  campaignId: string
): Promise<ActionResult> {
  try {
    const store = await getStore();
    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, storeId: store.id },
      include: {
        orders: {
          where: { status: { in: ["PAID", "PRODUCTION", "READY", "COMPLETED"] } },
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: {
                      include: {
                        recipeItems: { include: { ingredient: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!campaign) return { success: false, error: "Kampanye tidak ditemukan" };

    const allItems = campaign.orders.flatMap((o) =>
      o.items.map((item) => ({
        quantity: item.quantity,
        variant: item.variant
          ? {
              product: {
                recipeItems: item.variant.product.recipeItems.map((ri) => ({
                  quantity: Number(ri.quantity),
                  ingredient: {
                    id: ri.ingredient.id,
                    name: ri.ingredient.name,
                    unit: ri.ingredient.unit,
                    purchaseQty: Number(ri.ingredient.purchaseQty),
                    purchasePrice: Number(ri.ingredient.purchasePrice),
                  },
                })),
              },
            }
          : null,
      }))
    );

    const needs = generateProductionNeeds(allItems);

    await prisma.productionSheet.upsert({
      where: { campaignId },
      update: {
        items: {
          deleteMany: {},
          create: needs.map((n) => ({
            ingredientId: n.ingredientId,
            ingredientName: n.ingredientName,
            unit: n.unit,
            totalQuantity: n.totalQuantity,
            estimatedCost: n.estimatedCost,
          })),
        },
      },
      create: {
        campaignId,
        items: {
          create: needs.map((n) => ({
            ingredientId: n.ingredientId,
            ingredientName: n.ingredientName,
            unit: n.unit,
            totalQuantity: n.totalQuantity,
            estimatedCost: n.estimatedCost,
          })),
        },
      },
    });

    revalidatePath(`/periode-po/${campaignId}/produksi`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Terjadi kesalahan saat generate lembar produksi" };
  }
}

export async function getProductionSheet(campaignId: string) {
  const store = await getStore();
  return prisma.productionSheet.findFirst({
    where: { campaign: { id: campaignId, storeId: store.id } },
    include: { items: true, campaign: true },
  });
}
