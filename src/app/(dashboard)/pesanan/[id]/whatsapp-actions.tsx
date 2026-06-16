"use client";

import { Button } from "@/components/ui/button";
import {
  buildWaLink,
  buildPaymentApprovedMessage,
  buildPaymentRejectedMessage,
  buildProductionStartedMessage,
  buildReadyMessage,
  buildDeliveryMessage,
  buildCompletedMessage,
} from "@/lib/utils/whatsapp";
import { MessageCircle, Bell } from "lucide-react";
import type { OrderStatus } from "@prisma/client";

type Props = {
  customerPhone: string;
  orderNumber: string;
  status: OrderStatus;
  rejectionReason: string | null;
};

export function WhatsAppActions({ customerPhone, orderNumber, status, rejectionReason }: Props) {
  const openChatLink = buildWaLink(customerPhone, "");

  const notifyOptions: { label: string; message: string }[] = [];
  if (status === "PAID") {
    notifyOptions.push({
      label: "Notify: Pembayaran Diterima",
      message: buildPaymentApprovedMessage({ orderNumber }),
    });
  }
  if (status === "PENDING_PAYMENT" && rejectionReason) {
    notifyOptions.push({
      label: "Notify: Pembayaran Ditolak",
      message: buildPaymentRejectedMessage({ orderNumber, reason: rejectionReason }),
    });
  }
  if (status === "PRODUCTION") {
    notifyOptions.push({
      label: "Notify: Mulai Produksi",
      message: buildProductionStartedMessage({ orderNumber }),
    });
  }
  if (status === "READY") {
    notifyOptions.push({
      label: "Notify: Siap Diambil",
      message: buildReadyMessage({ orderNumber }),
    });
    notifyOptions.push({
      label: "Notify: Sedang Dikirim",
      message: buildDeliveryMessage({ orderNumber }),
    });
  }
  if (status === "COMPLETED") {
    notifyOptions.push({
      label: "Notify: Pesanan Selesai",
      message: buildCompletedMessage({ orderNumber }),
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild size="sm" className="bg-green-500 hover:bg-green-600 text-white border-0">
        <a href={openChatLink} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-4 w-4 mr-1" />
          Buka WhatsApp
        </a>
      </Button>
      {notifyOptions.map((opt) => (
        <Button key={opt.label} asChild size="sm" variant="outline">
          <a href={buildWaLink(customerPhone, opt.message)} target="_blank" rel="noopener noreferrer">
            <Bell className="h-4 w-4 mr-1" />
            {opt.label}
          </a>
        </Button>
      ))}
    </div>
  );
}
