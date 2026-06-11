import { Unit } from "@prisma/client";

export const UNIT_LABELS: Record<Unit, string> = {
  GRAM: "gram",
  KILOGRAM: "kg",
  ML: "ml",
  LITER: "liter",
  PCS: "pcs",
  PACK: "pack",
};

export const UNIT_OPTIONS = Object.entries(UNIT_LABELS).map(([value, label]) => ({
  value,
  label,
}));
