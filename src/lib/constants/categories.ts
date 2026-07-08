import { ProductCategory } from "@prisma/client";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  BEVERAGE: "Minuman",
  FOOD: "Makanan",
  DESSERT: "Dessert",
  FROZEN_FOOD: "Frozen Food",
  SNACK: "Snack",
  FASHION: "Fashion",
  CRAFT: "Kerajinan",
  ACCESSORY: "Aksesoris",
  ELECTRONIC: "Elektronik",
  HOUSEHOLD: "Rumah Tangga",
  BEAUTY: "Kecantikan",
  OTHER: "Lainnya",
};

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label })
);
