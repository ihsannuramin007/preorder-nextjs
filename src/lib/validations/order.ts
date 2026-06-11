import { z } from "zod";

export const orderItemSchema = z.object({
  variantId: z.string().min(1, "Pilih varian produk"),
  quantity: z.coerce.number().int().positive("Jumlah minimal 1"),
});

export const orderSchema = z.object({
  customerName: z.string().min(2, "Nama minimal 2 karakter"),
  customerPhone: z
    .string()
    .min(8, "Nomor HP tidak valid")
    .regex(/^[0-9+\-\s]+$/, "Nomor HP tidak valid"),
  customerAddress: z.string().min(5, "Alamat minimal 5 karakter"),
  customerNotes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "Tambahkan minimal 1 produk"),
});

export type OrderInput = z.infer<typeof orderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
