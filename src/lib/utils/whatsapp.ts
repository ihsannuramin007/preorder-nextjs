/**
 * Zero-cost WhatsApp companion utilities — wa.me deep links only, no provider/API.
 */

export function cleanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Convert local "08..." to international "628..." so wa.me resolves correctly
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
}

export function buildWaLink(phone: string, message: string): string {
  return `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(message)}`;
}

type OrderItemLike = { productName: string; quantity: number };

function formatProductList(items: OrderItemLike[]): string {
  return items.map((i) => `${i.productName} x${i.quantity}`).join(", ");
}

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function buildChatSellerMessage(params: {
  orderNumber: string;
  customerName: string;
  items: OrderItemLike[];
}): string {
  return [
    "Halo Kak,",
    "",
    "Saya baru membuat pesanan.",
    "",
    `Order ID: ${params.orderNumber}`,
    `Nama: ${params.customerName}`,
    `Produk: ${formatProductList(params.items)}`,
    "",
    "Terima kasih.",
  ].join("\n");
}

export function buildPaymentProofFollowupMessage(params: { orderNumber: string }): string {
  return [
    "Halo Kak,",
    "",
    "Saya sudah melakukan pembayaran.",
    "",
    `Order ID: ${params.orderNumber}`,
    "",
    "Mohon dibantu cek pembayaran saya.",
    "",
    "Terima kasih.",
  ].join("\n");
}

export function buildPaymentApprovedMessage(params: { orderNumber: string }): string {
  return [
    "Halo Kak,",
    "",
    `Pembayaran untuk Order: ${params.orderNumber}`,
    "",
    "sudah kami terima. Pesanan sedang kami proses.",
    "",
    "Terima kasih.",
  ].join("\n");
}

export function buildPaymentRejectedMessage(params: { orderNumber: string; reason?: string }): string {
  return [
    "Halo Kak,",
    "",
    "Mohon maaf.",
    "",
    `Pembayaran untuk Order: ${params.orderNumber}`,
    "",
    "belum dapat kami verifikasi.",
    ...(params.reason ? [`Alasan: ${params.reason}`] : []),
    "",
    "Silakan cek kembali bukti transfer atau hubungi kami.",
    "",
    "Terima kasih.",
  ].join("\n");
}

export function buildProductionStartedMessage(params: { orderNumber: string }): string {
  return [
    "Halo Kak,",
    "",
    `Pesanan: ${params.orderNumber}`,
    "",
    "sudah masuk proses produksi. Kami akan mengabari kembali saat pesanan siap.",
    "",
    "Terima kasih.",
  ].join("\n");
}

export function buildReadyMessage(params: { orderNumber: string }): string {
  return [
    "Halo Kak,",
    "",
    `Pesanan: ${params.orderNumber}`,
    "",
    "sudah siap diambil. Silakan datang sesuai jam operasional.",
    "",
    "Terima kasih.",
  ].join("\n");
}

export function buildDeliveryMessage(params: { orderNumber: string }): string {
  return [
    "Halo Kak,",
    "",
    `Pesanan: ${params.orderNumber}`,
    "",
    "saat ini sedang dalam proses pengiriman.",
    "",
    "Terima kasih.",
  ].join("\n");
}

export function buildCompletedMessage(params: { orderNumber: string }): string {
  return [
    "Halo Kak,",
    "",
    `Pesanan: ${params.orderNumber}`,
    "",
    "telah selesai. Terima kasih sudah melakukan pemesanan.",
  ].join("\n");
}

export { formatRupiah };
