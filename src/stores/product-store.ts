"use client";

import { create } from "zustand";
import type { Product } from "@/lib/mock-data";
import { products as defaultProducts } from "@/lib/mock-data";
import {
  getProducts as dbGetProducts,
  createProduct as dbCreateProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct,
  dbProductToLegacy,
} from "@/lib/db";
import type { DbProduct } from "@/lib/db";

interface ProductManagementState {
  products: Product[];
  isLoading: boolean;
  isDbConnected: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<boolean>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
}

export const useProductManagement = create<ProductManagementState>()(
  (set, get) => ({
    products: defaultProducts,
    isLoading: false,
    isDbConnected: false,

    fetchProducts: async () => {
      set({ isLoading: true });
      try {
        const dbProducts = await dbGetProducts();
        if (dbProducts.length > 0) {
          const products = dbProducts.map(dbProductToLegacy) as Product[];
          set({ products, isDbConnected: true, isLoading: false });
        } else {
          // Fallback to mock data
          set({ products: defaultProducts, isDbConnected: false, isLoading: false });
        }
      } catch {
        console.warn("[ProductStore] DB fetch failed, using mock data");
        set({ products: defaultProducts, isDbConnected: false, isLoading: false });
      }
    },

    addProduct: async (product) => {
      const existing = get().products.find(
        (p) => p.id === product.id || p.slug === product.slug
      );
      if (existing) return false;

      // Try to save to DB first
      try {
        const dbProduct = await dbCreateProduct({
          title: product.title,
          slug: product.slug,
          description: product.description || null,
          price: product.price,
          compare_price: product.comparePrice || null,
          images: product.images || [],
          category_id: null,
          category: product.category || null,
          category_slug: product.categorySlug || null,
          rating: product.rating || 0,
          review_count: product.reviewCount || 0,
          stock: product.stock || 0,
          status: product.status || "ACTIVE",
          featured: product.featured || false,
          vendor: product.vendor || null,
          tags: product.tags || [],
          sku: product.sku || null,
          variant_options: product.variantOptions?.map((v) => ({
            name: v.name,
            values: v.values,
          })) || [],
          variants: product.variants?.map((v) => ({
            id: v.id,
            sku: v.sku,
            options: v.options,
            price: v.price,
            comparePrice: v.comparePrice,
            stock: v.stock,
            image: v.image,
            colorHex: v.colorHex,
          })) || [],
        });

        if (dbProduct) {
          const newProduct = dbProductToLegacy(dbProduct) as Product;
          set({ products: [newProduct, ...get().products] });
          return true;
        }
      } catch (err) {
        console.warn("[ProductStore] DB insert failed:", err);
      }

      // Fallback: add locally
      set({ products: [product, ...get().products] });
      return true;
    },

    updateProduct: async (id, data) => {
      const products = get().products;
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1) return false;

      // Build DB update object
      const dbUpdates: Partial<DbProduct> = {};
      if (data.title !== undefined) dbUpdates.title = data.title;
      if (data.slug !== undefined) dbUpdates.slug = data.slug;
      if (data.description !== undefined) dbUpdates.description = data.description;
      if (data.price !== undefined) dbUpdates.price = data.price;
      if (data.comparePrice !== undefined) dbUpdates.compare_price = data.comparePrice;
      if (data.images !== undefined) dbUpdates.images = data.images;
      if (data.category !== undefined) dbUpdates.category = data.category;
      if (data.categorySlug !== undefined) dbUpdates.category_slug = data.categorySlug;
      if (data.rating !== undefined) dbUpdates.rating = data.rating;
      if (data.reviewCount !== undefined) dbUpdates.review_count = data.reviewCount;
      if (data.stock !== undefined) dbUpdates.stock = data.stock;
      if (data.status !== undefined) dbUpdates.status = data.status;
      if (data.featured !== undefined) dbUpdates.featured = data.featured;
      if (data.vendor !== undefined) dbUpdates.vendor = data.vendor;
      if (data.tags !== undefined) dbUpdates.tags = data.tags;
      if (data.sku !== undefined) dbUpdates.sku = data.sku;
      if (data.variantOptions !== undefined) {
        dbUpdates.variant_options = data.variantOptions.map((v) => ({
          name: v.name,
          values: v.values,
        }));
      }
      if (data.variants !== undefined) {
        dbUpdates.variants = data.variants.map((v) => ({
          id: v.id,
          sku: v.sku,
          options: v.options,
          price: v.price,
          comparePrice: v.comparePrice,
          stock: v.stock,
          image: v.image,
          colorHex: v.colorHex,
        }));
      }

      // Try DB update
      try {
        await dbUpdateProduct(id, dbUpdates);
      } catch (err) {
        console.warn("[ProductStore] DB update failed:", err);
      }

      // Update local state
      const updated = [...products];
      updated[idx] = { ...updated[idx], ...data };
      set({ products: updated });
      return true;
    },

    deleteProduct: async (id) => {
      try {
        await dbDeleteProduct(id);
      } catch (err) {
        console.warn("[ProductStore] DB delete failed:", err);
      }
      set({ products: get().products.filter((p) => p.id !== id) });
    },

    toggleStatus: async (id) => {
      const product = get().products.find((p) => p.id === id);
      if (!product) return;
      const newStatus = product.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE";

      try {
        await dbUpdateProduct(id, { status: newStatus });
      } catch (err) {
        console.warn("[ProductStore] DB toggle failed:", err);
      }

      set({
        products: get().products.map((p) =>
          p.id === id ? { ...p, status: newStatus as "ACTIVE" | "ARCHIVED" } : p
        ),
      });
    },

    getProduct: (id) => get().products.find((p) => p.id === id),
  })
);

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

// Generate next ID — not used with UUID, kept for compatibility
export function generateProductId(products: Product[]): string {
  const maxId = Math.max(0, ...products.map((p) => parseInt(p.id) || 0));
  return String(maxId + 1);
}
