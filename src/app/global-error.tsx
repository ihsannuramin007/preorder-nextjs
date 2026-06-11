"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    };
    console.error("[ERROR] [client:global-error-boundary]", JSON.stringify(entry, null, 2));
  }, [error]);

  return (
    <html lang="id">
      <body style={{ fontFamily: "sans-serif", textAlign: "center", padding: "4rem 1rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Aplikasi mengalami error kritis</h1>
        <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
          {error.message ?? "Terjadi kesalahan yang tidak terduga."}
        </p>
        {error.digest && (
          <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.5rem" }}>
            ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            padding: "0.75rem 1.5rem",
            background: "#8B5CF6",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Coba lagi
        </button>
      </body>
    </html>
  );
}
