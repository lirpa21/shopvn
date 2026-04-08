"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category } from "@/lib/mock-data";
import { categories as defaultCategories } from "@/lib/mock-data";

interface CategoryManagementState {
  categories: Category[];
  addCategory: (category: Category) => boolean;
  updateCategory: (id: string, data: Partial<Category>) => boolean;
  deleteCategory: (id: string) => void;
  getCategory: (id: string) => Category | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
}

export const useCategoryManagement = create<CategoryManagementState>()(
  persist(
    (set, get) => ({
      categories: defaultCategories,

      addCategory: (category) => {
        const existing = get().categories.find(
          (c) => c.id === category.id || c.slug === category.slug
        );
        if (existing) return false;
        set({ categories: [...get().categories, category] });
        return true;
      },

      updateCategory: (id, data) => {
        const categories = get().categories;
        const idx = categories.findIndex((c) => c.id === id);
        if (idx === -1) return false;
        const updated = [...categories];
        updated[idx] = { ...updated[idx], ...data };
        set({ categories: updated });
        return true;
      },

      deleteCategory: (id) => {
        set({ categories: get().categories.filter((c) => c.id !== id) });
      },

      getCategory: (id) => get().categories.find((c) => c.id === id),

      getCategoryBySlug: (slug) =>
        get().categories.find((c) => c.slug === slug),
    }),
    {
      name: "shopvn-category-management",
    }
  )
);

// Generate next category ID
export function generateCategoryId(categories: Category[]): string {
  const maxId = Math.max(0, ...categories.map((c) => parseInt(c.id) || 0));
  return String(maxId + 1);
}
