"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { generateProductionSheet } from "@/actions/production";
import { RefreshCw } from "lucide-react";

export function GenerateSheetButton({ campaignId }: { campaignId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleGenerate() {
    startTransition(async () => {
      const result = await generateProductionSheet(campaignId);
      if (result.success) {
        toast.success("Lembar produksi berhasil diperbarui!");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Button onClick={handleGenerate} disabled={isPending} size="sm">
      <RefreshCw className={`h-4 w-4 mr-1 ${isPending ? "animate-spin" : ""}`} />
      {isPending ? "Generating..." : "Generate"}
    </Button>
  );
}
