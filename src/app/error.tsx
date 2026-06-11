"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const entry = {
      timestamp: new Date().toISOString(),
      digest: error.digest,
      message: error.message,
      stack: error.stack,
      cause: error.cause instanceof Error ? (error.cause as Error).stack : String(error.cause ?? ""),
    };
    console.error("[ERROR] [client:error-boundary]", JSON.stringify(entry, null, 2));
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div>
        <p className="text-5xl font-bold text-error">500</p>
        <h1 className="mt-4 text-2xl font-bold">Terjadi kesalahan</h1>
        <p className="mt-2 text-muted-foreground">
          Sesuatu yang tidak terduga terjadi. Silakan coba lagi.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            ID: {error.digest}
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>Coba lagi</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
          Ke Dashboard
        </Button>
      </div>
    </div>
  );
}
