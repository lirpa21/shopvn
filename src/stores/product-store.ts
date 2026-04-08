"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/mock-data";
import { products as defaultProducts } from "@/lib/mock-data";

interface ProductManagementState {
  products: Product[];
  addProduct: (product: Product) => boolean;
  updateProduct: (id: string, data: Partial<Product>) => boolean;
  deleteProduct: (id: string) => void;
  toggleStatus: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

export const useProductManagement = create<ProductManagementState>()(
  persist(
    (set, get) => ({
      products: defaultProducts,

      addProduct: (product) => {
        const existing = get().products.find((p) => p.id === product.id || p.slug === product.slug);
        if (existing) return false;
        set({ products: [...get().products, product] });
        return true;
      },

      updateProduct: (id, data) => {
        const products = get().products;
        const idx = products.findIndex((p) => p.id === id);
        if (idx === -1) return false;
        const updated = [...products];
        updated[idx] = { ...updated[idx], ...data };
        set({ products: updated });
        return true;
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) });
      },

      toggleStatus: (id) => {
        const products = get().products;
        set({
          products: products.map((p) =>
            p.id === id
              ? { ...p, status: p.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE" }
              : p
          ),
        });
      },

      getProduct: (id) => get().products.find((p) => p.id === id),
    }),
    {
      name: "shopvn-product-management",
    }
  )
);

// Generate next ID
export function generateProductId(products: Product[]): string {
  const maxId = Math.max(0, ...products.map((p) => parseInt(p.id) || 0));
  return String(maxId + 1);
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
