"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  comparePrice?: number;
  image: string;
  quantity: number;
  variant?: string; // display label e.g. "Đen / L"
  variantId?: string; // unique variant id
  slug: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

// Unique key: productId + variantId (if exists)
function getCartKey(item: { id: string; variantId?: string }): string {
  return item.variantId ? `${item.id}::${item.variantId}` : item.id;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item, quantity = 1) => {
        const items = get().items;
        const key = getCartKey(item);
        const existingItem = items.find((i) => getCartKey(i) === key);

        if (existingItem) {
          set({
            items: items.map((i) =>
              getCartKey(i) === key
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity }] });
        }
      },

      removeItem: (cartKey) => {
        set({ items: get().items.filter((i) => getCartKey(i) !== cartKey) });
      },

      updateQuantity: (cartKey, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartKey);
          return;
        }
        set({
          items: get().items.map((i) =>
            getCartKey(i) === cartKey ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "shopvn-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export { getCartKey };
