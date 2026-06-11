export function formatIDR(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function parseIDR(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]/g, "")) || 0;
}
