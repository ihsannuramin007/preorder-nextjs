"use client";

import { create } from "zustand";

type CartItem = {
  variantId: string;
  productName: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  total: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((s) => {
      const existing = s.items.find((i) => i.variantId === item.variantId);
      if (existing) {
        return {
          items: s.items.map((i) =>
            i.variantId === item.variantId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...s.items, item] };
    }),
  updateQuantity: (variantId, quantity) =>
    set((s) => ({
      items:
        quantity <= 0
          ? s.items.filter((i) => i.variantId !== variantId)
          : s.items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
    })),
  removeItem: (variantId) =>
    set((s) => ({ items: s.items.filter((i) => i.variantId !== variantId) })),
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
}));
