"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { ingredientSchema } from "@/lib/validations/ingredient";
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

function serializeIngredient<T extends { purchaseQty: unknown; purchasePrice: unknown }>(i: T) {
  return { ...i, purchaseQty: Number(i.purchaseQty), purchasePrice: Number(i.purchasePrice) };
}

export async function getIngredients() {
  const store = await getStore();
  const rows = await prisma.ingredient.findMany({
    where: { storeId: store.id },
    orderBy: { name: "asc" },
  });
  return rows.map(serializeIngredient);
}

export async function getIngredientsList(filters?: {
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const store = await getStore();
  const pageSize = filters?.pageSize ?? 10;
  const page = filters?.page ?? 1;
  const skip = (page - 1) * pageSize;

  const where = {
    storeId: store.id,
    ...(filters?.search
      ? { name: { contains: filters.search, mode: "insensitive" as const } }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.ingredient.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.ingredient.count({ where }),
  ]);

  return { data: rows.map(serializeIngredient), total };
}

export async function getIngredient(id: string) {
  const store = await getStore();
  const row = await prisma.ingredient.findFirst({
    where: { id, storeId: store.id },
  });
  return row ? serializeIngredient(row) : null;
}

export async function createIngredient(formData: FormData): Promise<ActionResult<ReturnType<typeof serializeIngredient>>> {
  try {
    const store = await getStore();
    const raw = {
      name: formData.get("name"),
      unit: formData.get("unit"),
      purchaseQty: formData.get("purchaseQty"),
      purchasePrice: formData.get("purchasePrice"),
    };

    const parsed = ingredientSchema.safeParse(raw);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

    const ingredient = await prisma.ingredient.create({
      data: { ...parsed.data, storeId: store.id },
    });
    revalidatePath("/bahan-baku");
    return { success: true, data: serializeIngredient(ingredient) };
  } catch {
    return { success: false, error: "Terjadi kesalahan" };
  }
}

export async function updateIngredient(
  id: string,
  formData: FormData
): Promise<ActionResult<ReturnType<typeof serializeIngredient>>> {
  try {
    const store = await getStore();
    const raw = {
      name: formData.get("name"),
      unit: formData.get("unit"),
      purchaseQty: formData.get("purchaseQty"),
      purchasePrice: formData.get("purchasePrice"),
    };

    const parsed = ingredientSchema.safeParse(raw);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

    const ingredient = await prisma.ingredient.update({
      where: { id, storeId: store.id },
      data: parsed.data,
    });
    revalidatePath("/bahan-baku");
    return { success: true, data: serializeIngredient(ingredient) };
  } catch {
    return { success: false, error: "Terjadi kesalahan" };
  }
}

export async function deleteIngredient(id: string): Promise<ActionResult> {
  try {
    const store = await getStore();
    await prisma.ingredient.delete({ where: { id, storeId: store.id } });
    revalidatePath("/bahan-baku");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Terjadi kesalahan" };
  }
}
