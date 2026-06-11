import { z } from "zod";
import { ProductCategory, ProductStatus } from "@prisma/client";

export const productVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama varian wajib diisi"),
  priceAdjustment: z.coerce.number().default(0),
  sku: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  category: z.nativeEnum(ProductCategory).default(ProductCategory.OTHER),
  basePrice: z.coerce.number().min(0, "Harga harus lebih dari 0"),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT),
  variants: z.array(productVariantSchema).optional().default([]),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
