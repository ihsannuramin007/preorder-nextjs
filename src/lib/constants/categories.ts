import { ProductCategory } from "@prisma/client";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  BEVERAGE: "Minuman",
  FOOD: "Makanan",
  DESSERT: "Dessert",
  FROZEN_FOOD: "Frozen Food",
  SNACK: "Snack",
  OTHER: "Lainnya",
};

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label })
);
