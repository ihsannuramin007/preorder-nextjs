"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateGroupOrderStatus } from "@/actions/group-orders";

type Status = "COLLECTING" | "CLOSED" | "PAYMENT_REVIEW" | "PAID" | "CANCELLED";

export function GroupOrderStatusActions({
  groupOrderId,
  status,
}: {
  groupOrderId: string;
  status: Status;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleUpdate(next: Status) {
    startTransition(async () => {
      const result = await updateGroupOrderStatus(groupOrderId, next);
      if (result.success) {
        toast.success("Status diperbarui");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  if (status === "COLLECTING") {
    return (
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        disabled={isPending}
        onClick={() => handleUpdate("CLOSED")}
      >
        Tutup Sesi
      </Button>
    );
  }

  if (status === "CLOSED") {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="w-full text-muted-foreground"
        disabled={isPending}
        onClick={() => handleUpdate("COLLECTING")}
      >
        Buka Kembali
      </Button>
    );
  }

  if (status === "PAYMENT_REVIEW" || status === "PAID") {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="w-full text-destructive"
        disabled={isPending}
        onClick={() => handleUpdate("CANCELLED")}
      >
        Batalkan
      </Button>
    );
  }

  return null;
}
