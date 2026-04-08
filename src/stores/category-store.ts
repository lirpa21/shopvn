"use client";

import { create } from "zustand";
import type { Category } from "@/lib/mock-data";
import { categories as defaultCategories } from "@/lib/mock-data";
import {
  getCategories as dbGetCategories,
  createCategory as dbCreateCategory,
  updateCategory as dbUpdateCategory,
  deleteCategory as dbDeleteCategory,
  dbCategoryToLegacy,
} from "@/lib/db";

interface CategoryManagementState {
  categories: Category[];
  isLoading: boolean;
  isDbConnected: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Category) => Promise<boolean>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  getCategory: (id: string) => Category | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
}

export const useCategoryManagement = create<CategoryManagementState>()(
  (set, get) => ({
    categories: defaultCategories,
    isLoading: false,
    isDbConnected: false,

    fetchCategories: async () => {
      set({ isLoading: true });
      try {
        const dbCategories = await dbGetCategories();
        if (dbCategories.length > 0) {
          const categories = dbCategories.map(dbCategoryToLegacy) as Category[];
          set({ categories, isDbConnected: true, isLoading: false });
        } else {
          set({ categories: defaultCategories, isDbConnected: false, isLoading: false });
        }
      } catch {
        console.warn("[CategoryStore] DB fetch failed, using mock data");
        set({ categories: defaultCategories, isDbConnected: false, isLoading: false });
      }
    },

    addCategory: async (category) => {
      const existing = get().categories.find(
        (c) => c.id === category.id || c.slug === category.slug
      );
      if (existing) return false;

      try {
        const dbCat = await dbCreateCategory({
          name: category.name,
          slug: category.slug,
          description: category.description || null,
          image: category.image || null,
          product_count: category.productCount || 0,
        });

        if (dbCat) {
          const newCat = dbCategoryToLegacy(dbCat) as Category;
          set({ categories: [...get().categories, newCat] });
          return true;
        }
      } catch (err) {
        console.warn("[CategoryStore] DB insert failed:", err);
      }

      // Fallback: add locally
      set({ categories: [...get().categories, category] });
      return true;
    },

    updateCategory: async (id, data) => {
      const categories = get().categories;
      const idx = categories.findIndex((c) => c.id === id);
      if (idx === -1) return false;

      // Build DB update
      const dbUpdates: Record<string, unknown> = {};
      if (data.name !== undefined) dbUpdates.name = data.name;
      if (data.slug !== undefined) dbUpdates.slug = data.slug;
      if (data.description !== undefined) dbUpdates.description = data.description;
      if (data.image !== undefined) dbUpdates.image = data.image;
      if (data.productCount !== undefined) dbUpdates.product_count = data.productCount;

      try {
        await dbUpdateCategory(id, dbUpdates);
      } catch (err) {
        console.warn("[CategoryStore] DB update failed:", err);
      }

      const updated = [...categories];
      updated[idx] = { ...updated[idx], ...data };
      set({ categories: updated });
      return true;
    },

    deleteCategory: async (id) => {
      try {
        const success = await dbDeleteCategory(id);
        if (!success) return false;
      } catch (err) {
        console.warn("[CategoryStore] DB delete failed:", err);
      }

      set({ categories: get().categories.filter((c) => c.id !== id) });
      return true;
    },

    getCategory: (id) => get().categories.find((c) => c.id === id),

    getCategoryBySlug: (slug) =>
      get().categories.find((c) => c.slug === slug),
  })
);

// Generate next category ID — not used with UUID, kept for compatibility
export function generateCategoryId(categories: Category[]): string {
  const maxId = Math.max(0, ...categories.map((c) => parseInt(c.id) || 0));
  return String(maxId + 1);
}
