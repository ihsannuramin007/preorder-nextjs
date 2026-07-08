"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { approvePayment, rejectPayment } from "@/actions/payments";
import { CheckCircle, XCircle, Eye } from "lucide-react";
type PaymentVerificationProps = { orderId: string; paymentProofUrl: string | null };

export function PaymentVerification({ orderId, paymentProofUrl }: PaymentVerificationProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [proofOpen, setProofOpen] = useState(false);

  function handleApprove() {
    startTransition(async () => {
      const result = await approvePayment(orderId);
      if (result.success) {
        toast.success("Pembayaran disetujui!");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleReject() {
    if (!reason.trim()) {
      toast.error("Masukkan alasan penolakan");
      return;
    }
    startTransition(async () => {
      const result = await rejectPayment(orderId, reason);
      if (result.success) {
        toast.success("Pembayaran ditolak");
        setRejectOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-base text-yellow-800">Verifikasi Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentProofUrl ? (
            <Button variant="outline" size="sm" onClick={() => setProofOpen(true)} data-testid="btn-lihat-bukti-bayar">
              <Eye className="h-4 w-4 mr-1" />
              Lihat Bukti Pembayaran
            </Button>
          ) : (
            <p className="text-sm text-yellow-700">Pelanggan belum mengunggah bukti pembayaran.</p>
          )}
          <div className="flex gap-2">
            <Button onClick={handleApprove} disabled={isPending} size="sm" className="bg-success hover:bg-green-600" data-testid="btn-setujui-pembayaran">
              <CheckCircle className="h-4 w-4 mr-1" />
              Setujui
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setRejectOpen(true)}
              disabled={isPending}
              data-testid="btn-tolak-pembayaran"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Tolak
            </Button>
          </div>
        </CardContent>
      </Card>

      {paymentProofUrl && (
        <Dialog open={proofOpen} onOpenChange={setProofOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Bukti Pembayaran</DialogTitle>
            </DialogHeader>
            <div className="rounded-lg overflow-hidden border border-border">
              {paymentProofUrl.match(/\.(jpg|jpeg|png)$/i) ? (
                <img
                  src={paymentProofUrl}
                  alt="Bukti pembayaran"
                  className="w-full max-h-[70vh] object-contain"
                />
              ) : (
                <a
                  href={paymentProofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-8 text-center text-primary-600 hover:underline"
                >
                  Buka file PDF
                </a>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="max-w-sm" data-testid="modal-tolak-pembayaran">
          <DialogHeader>
            <DialogTitle>Tolak Pembayaran</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="reason">Alasan Penolakan</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Jumlah transfer tidak sesuai"
              rows={3}
              data-testid="ta-alasan-penolakan"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleReject} disabled={isPending} data-testid="btn-konfirmasi-tolak">
              {isPending ? "Memproses..." : "Tolak Pembayaran"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
