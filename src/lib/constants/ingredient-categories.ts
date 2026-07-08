import { IngredientCategory, StockAdjustmentReason } from "@prisma/client";

export const INGREDIENT_CATEGORY_LABELS: Record<IngredientCategory, string> = {
  BAHAN_UTAMA: "Bahan Utama",
  BAHAN_TAMBAHAN: "Bahan Tambahan",
  KEMASAN: "Kemasan",
  OTHER: "Lainnya",
};

export const INGREDIENT_CATEGORY_OPTIONS = Object.entries(INGREDIENT_CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label })
);

export const ADJUSTMENT_REASON_LABELS: Record<StockAdjustmentReason, string> = {
  CORRECTION: "Koreksi Manual",
  EXPIRED: "Kedaluwarsa",
  LOST: "Hilang",
  DAMAGED: "Rusak",
  WASTE: "Terbuang/Waste",
};

export const ADJUSTMENT_REASON_OPTIONS = Object.entries(ADJUSTMENT_REASON_LABELS).map(
  ([value, label]) => ({ value, label })
);
