import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(2, "Nama toko minimal 2 karakter"),
  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .max(50, "Slug maksimal 50 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  description: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  logoUrl: z.string().optional(),
  coverUrl: z.string().optional(),
});

export type StoreInput = z.infer<typeof storeSchema>;
