"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateCampaignStatus } from "@/actions/campaigns";
import type { CampaignStatus } from "@prisma/client";

type Campaign = {
  id: string;
  status: CampaignStatus;
};

const TRANSITIONS: Partial<Record<CampaignStatus, { next: CampaignStatus; label: string; variant?: any }>> = {
  DRAFT: { next: "OPEN", label: "Buka PO" },
  OPEN: { next: "CLOSED", label: "Tutup PO" },
  CLOSED: { next: "PRODUCTION", label: "Mulai Produksi" },
  PRODUCTION: { next: "COMPLETED", label: "Selesai" },
};

export function CampaignStatusActions({ campaign }: { campaign: Campaign }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const transition = TRANSITIONS[campaign.status];

  if (!transition) return null;

  function handleUpdate() {
    startTransition(async () => {
      const result = await updateCampaignStatus(campaign.id, transition!.next);
      if (result.success) {
        toast.success(`Status berhasil diubah ke ${transition!.label}`);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  const testIdMap: Record<string, string> = {
    "Buka PO": "btn-buka-kampanye",
    "Tutup PO": "btn-tutup-kampanye",
    "Mulai Produksi": "btn-mulai-produksi",
    "Selesai": "btn-selesaikan-kampanye",
  };

  return (
    <Button
      onClick={handleUpdate}
      disabled={isPending}
      size="sm"
      data-testid={testIdMap[transition.label] ?? "btn-ubah-status-kampanye"}
    >
      {isPending ? "Memproses..." : transition.label}
    </Button>
  );
}
