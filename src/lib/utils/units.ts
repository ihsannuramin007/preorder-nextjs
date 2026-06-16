import { Unit } from "@prisma/client";

const FINE_UNIT: Partial<Record<Unit, Unit>> = {
  KILOGRAM: "GRAM",
  LITER: "ML",
};

const CONVERSION_FACTOR: Partial<Record<Unit, number>> = {
  KILOGRAM: 1000, // 1 KILOGRAM = 1000 GRAM
  LITER: 1000, // 1 LITER = 1000 ML
};

// Units a quantity-usage input may offer for a given base unit: [baseUnit] or [fineUnit, baseUnit]
export function getInputUnitOptions(baseUnit: Unit): Unit[] {
  const fine = FINE_UNIT[baseUnit];
  return fine ? [fine, baseUnit] : [baseUnit];
}

export function getDefaultInputUnit(baseUnit: Unit): Unit {
  return FINE_UNIT[baseUnit] ?? baseUnit;
}

// Convert a value typed in `inputUnit` into the ingredient's base unit for storage
export function toBaseUnit(value: number, inputUnit: Unit, baseUnit: Unit): number {
  if (inputUnit === baseUnit) return value;
  const factor = CONVERSION_FACTOR[baseUnit];
  return factor ? value / factor : value;
}

// Convert a stored base-unit value into the friendliest display unit + value
export function toDisplayUnit(value: number, baseUnit: Unit): { value: number; unit: Unit } {
  const fine = FINE_UNIT[baseUnit];
  const factor = CONVERSION_FACTOR[baseUnit];
  if (fine && factor && value < 1) {
    return { value: value * factor, unit: fine };
  }
  return { value, unit: baseUnit };
}
