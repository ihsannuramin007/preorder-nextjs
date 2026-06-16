import { z } from "zod";
import { Unit, IngredientCategory, StockAdjustmentReason } from "@prisma/client";

export const ingredientSchema = z.object({
  name: z.string().min(2, "Nama bahan minimal 2 karakter"),
  category: z.nativeEnum(IngredientCategory),
  unit: z.nativeEnum(Unit),
  supplier: z.string().optional(),
  minimumStock: z.coerce.number().min(0, "Minimum stok tidak boleh negatif").default(0),
  initialQuantity: z.coerce.number().positive().optional(),
  initialCost: z.coerce.number().positive().optional(),
});

export type IngredientInput = z.infer<typeof ingredientSchema>;

export const ingredientMetaSchema = z.object({
  name: z.string().min(2, "Nama bahan minimal 2 karakter"),
  category: z.nativeEnum(IngredientCategory),
  unit: z.nativeEnum(Unit),
  supplier: z.string().optional(),
  minimumStock: z.coerce.number().min(0, "Minimum stok tidak boleh negatif").default(0),
});

export const stockPurchaseSchema = z.object({
  purchaseQuantity: z.coerce.number().positive("Jumlah harus lebih dari 0"),
  purchaseCost: z.coerce.number().positive("Biaya harus lebih dari 0"),
  purchaseDate: z.coerce.date().optional(),
  supplier: z.string().optional(),
  invoiceNumber: z.string().optional(),
});

export const stockAdjustmentSchema = z.object({
  quantityChange: z.coerce.number().refine((v) => v !== 0, "Jumlah tidak boleh 0"),
  reason: z.nativeEnum(StockAdjustmentReason),
  note: z.string().optional(),
});
