import { z } from "zod";
import { ProductCategory, ProductStatus } from "@prisma/client";

export const productSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  category: z.nativeEnum(ProductCategory).default(ProductCategory.OTHER),
  basePrice: z.coerce.number().min(0, "Harga harus lebih dari 0"),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT),
});

export type ProductInput = z.infer<typeof productSchema>;
