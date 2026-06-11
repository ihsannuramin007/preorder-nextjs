import { z } from "zod";

export const campaignSchema = z
  .object({
    name: z.string().min(2, "Nama periode PO minimal 2 karakter"),
    description: z.string().optional(),
    openDate: z.coerce.date({ required_error: "Tanggal buka wajib diisi" }),
    closeDate: z.coerce.date({ required_error: "Tanggal tutup wajib diisi" }),
    productIds: z.array(z.string()).min(1, "Pilih minimal 1 produk"),
  })
  .refine((d) => d.closeDate > d.openDate, {
    message: "Tanggal tutup harus setelah tanggal buka",
    path: ["closeDate"],
  });

export type CampaignInput = z.infer<typeof campaignSchema>;
