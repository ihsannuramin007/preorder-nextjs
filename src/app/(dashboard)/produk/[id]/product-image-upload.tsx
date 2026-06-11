"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/shared/image-upload";
import { updateProduct } from "@/actions/products";

interface ProductImageUploadProps {
  productId: string;
  initialUrl?: string | null;
}

export function ProductImageUpload({ productId, initialUrl }: ProductImageUploadProps) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [isPending, startTransition] = useTransition();

  function handleChange(newUrl: string) {
    const prev = url;
    setUrl(newUrl);

    startTransition(async () => {
      const result = await updateProduct(productId, {
        imageUrl: newUrl || undefined,
      });
      if (!result.success) {
        toast.error("Gagal menyimpan foto");
        setUrl(prev);
      }
    });
  }

  return (
    <div className="space-y-1.5">
      <ImageUpload value={url} onChange={handleChange} disabled={isPending} />
      {isPending && (
        <p className="text-[11px] text-center text-[#9A9A9A] font-medium">Menyimpan...</p>
      )}
    </div>
  );
}
