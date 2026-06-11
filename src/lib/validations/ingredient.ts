import { z } from "zod";
import { Unit } from "@prisma/client";

export const ingredientSchema = z.object({
  name: z.string().min(2, "Nama bahan minimal 2 karakter"),
  unit: z.nativeEnum(Unit),
  purchaseQty: z.coerce.number().positive("Jumlah pembelian harus lebih dari 0"),
  purchasePrice: z.coerce.number().positive("Harga pembelian harus lebih dari 0"),
});

export type IngredientInput = z.infer<typeof ingredientSchema>;
