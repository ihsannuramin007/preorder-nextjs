"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";
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

function serializeProduct<
  T extends {
    basePrice: unknown;
    variants: Array<{ priceAdjustment: unknown }>;
    recipeItems: Array<{ quantity: unknown; ingredient: { purchaseQty: unknown; purchasePrice: unknown } }>;
  },
>(p: T) {
  return {
    ...p,
    basePrice: Number(p.basePrice),
    variants: p.variants.map((v) => ({ ...v, priceAdjustment: Number(v.priceAdjustment) })),
    recipeItems: p.recipeItems.map((ri) => ({
      ...ri,
      quantity: Number(ri.quantity),
      ingredient: {
        ...ri.ingredient,
        purchaseQty: Number(ri.ingredient.purchaseQty),
        purchasePrice: Number(ri.ingredient.purchasePrice),
      },
    })),
  };
}

export async function getProducts() {
  const store = await getStore();
  const rows = await prisma.product.findMany({
    where: { storeId: store.id },
    include: { variants: true, recipeItems: { include: { ingredient: true } } },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(serializeProduct);
}

export async function getProductsList(filters?: {
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
    prisma.product.findMany({
      where,
      include: { variants: true, recipeItems: { include: { ingredient: true } } },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { data: rows.map(serializeProduct), total };
}

export async function getProduct(id: string) {
  const store = await getStore();
  const row = await prisma.product.findFirst({
    where: { id, storeId: store.id },
    include: {
      variants: true,
      recipeItems: { include: { ingredient: true } },
    },
  });
  return row ? serializeProduct(row) : null;
}

export async function createProduct(data: {
  name: string;
  description?: string;
  imageUrl?: string;
  category: string;
  basePrice: number;
  status: string;
  variants: { name: string; priceAdjustment: number; sku?: string }[];
}): Promise<ActionResult<{ id: string }>> {
  try {
    const store = await getStore();
    const product = await prisma.product.create({
      data: {
        storeId: store.id,
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        category: data.category as any,
        basePrice: data.basePrice,
        status: data.status as any,
        variants: {
          create: data.variants.map((v) => ({
            name: v.name,
            priceAdjustment: v.priceAdjustment,
            sku: v.sku,
          })),
        },
      },
    });
    revalidatePath("/produk");
    return { success: true, data: { id: product.id } };
  } catch {
    return { success: false, error: "Terjadi kesalahan saat membuat produk" };
  }
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    basePrice: number;
    status: string;
  }>
): Promise<ActionResult> {
  try {
    const store = await getStore();
    await prisma.product.update({
      where: { id, storeId: store.id },
      data: data as any,
    });
    revalidatePath("/produk");
    revalidatePath(`/produk/${id}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Terjadi kesalahan" };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    const store = await getStore();
    await prisma.product.delete({ where: { id, storeId: store.id } });
    revalidatePath("/produk");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Terjadi kesalahan" };
  }
}

export async function getProductHpp(productId: string): Promise<number> {
  const store = await getStore();
  const product = await prisma.product.findFirst({
    where: { id: productId, storeId: store.id },
    include: { recipeItems: { include: { ingredient: true } } },
  });
  if (!product) return 0;

  return calculateHpp(
    product.recipeItems.map((ri) => ({
      quantity: Number(ri.quantity),
      ingredient: {
        purchaseQty: Number(ri.ingredient.purchaseQty),
        purchasePrice: Number(ri.ingredient.purchasePrice),
      },
    }))
  );
}
