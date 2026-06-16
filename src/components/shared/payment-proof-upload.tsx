"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadPaymentProof } from "@/actions/orders";
import { Upload, Loader2 } from "lucide-react";

export function PaymentProofUpload({
  orderId,
  onUploaded,
}: {
  orderId: string;
  onUploaded: () => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File maksimal 10MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("bucket", process.env.NEXT_PUBLIC_STORAGE_BUCKET_PAYMENTS ?? "payment-proofs");
      formData.set("folder", "payment-proofs");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error ?? "Gagal mengunggah file");
        return;
      }

      startTransition(async () => {
        const updateResult = await uploadPaymentProof(orderId, result.url);
        if (updateResult.success) {
          toast.success("Bukti pembayaran terkirim!");
          onUploaded();
        } else {
          toast.error(updateResult.error);
        }
      });
    } catch {
      toast.error("Gagal mengunggah file");
    } finally {
      setIsUploading(false);
    }
  }

  const busy = isUploading || isPending;

  return (
    <div>
      <input
        type="file"
        id="payment-proof-input"
        accept="image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={handleFile}
        disabled={busy}
      />
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        disabled={busy}
        onClick={() => document.getElementById("payment-proof-input")?.click()}
      >
        {busy ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Upload className="h-4 w-4 mr-2" />
        )}
        {busy ? "Mengunggah..." : "Upload Bukti Pembayaran"}
      </Button>
      <p className="text-xs text-muted-foreground mt-1.5 text-center">
        Format JPG, PNG, atau PDF — maksimal 10MB
      </p>
    </div>
  );
}
