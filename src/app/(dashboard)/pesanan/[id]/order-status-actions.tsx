"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/actions/orders";
import type { OrderStatus } from "@prisma/client";

const TRANSITIONS: Partial<Record<OrderStatus, { next: OrderStatus; label: string }>> = {
  PAID: { next: "PRODUCTION", label: "Mulai Produksi" },
  PRODUCTION: { next: "READY", label: "Siap Kirim" },
  READY: { next: "COMPLETED", label: "Selesaikan" },
};

export function OrderStatusActions({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const transition = TRANSITIONS[status];
  if (!transition) return null;

  function handleUpdate() {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, transition!.next);
      if (result.success) {
        toast.success("Status pesanan diperbarui!");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Button onClick={handleUpdate} disabled={isPending} size="sm">
      {isPending ? "Memproses..." : transition.label}
    </Button>
  );
}
