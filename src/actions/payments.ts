"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
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

export async function approvePayment(orderId: string): Promise<ActionResult> {
  try {
    const store = await getStore();
    await prisma.order.update({
      where: { id: orderId, campaign: { storeId: store.id } },
      data: { status: "PAID", verifiedAt: new Date() },
    });
    revalidatePath("/pesanan");
    revalidatePath(`/pesanan/${orderId}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Terjadi kesalahan" };
  }
}

export async function rejectPayment(
  orderId: string,
  reason: string
): Promise<ActionResult> {
  try {
    const store = await getStore();
    await prisma.order.update({
      where: { id: orderId, campaign: { storeId: store.id } },
      data: {
        status: "PENDING_PAYMENT",
        rejectionReason: reason,
        paymentProofUrl: null,
      },
    });
    revalidatePath("/pesanan");
    revalidatePath(`/pesanan/${orderId}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Terjadi kesalahan" };
  }
}
