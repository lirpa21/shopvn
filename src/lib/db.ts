/**
 * Database Service Layer — Supabase CRUD operations
 * for Products and Categories
 */

import { createClient as createBrowserClient } from "@/lib/supabase/client";

// ===================== TYPES =====================

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  product_count: number;
  created_at: string;
}

export interface DbProduct {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  images: string[];
  category_id: string | null;
  category: string | null;
  category_slug: string | null;
  rating: number;
  review_count: number;
  stock: number;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  featured: boolean;
  vendor: string | null;
  tags: string[];
  sku: string | null;
  variant_options: VariantOptionDb[];
  variants: VariantDb[];
  created_at: string;
  updated_at: string;
}

export interface VariantOptionDb {
  name: string;
  values: string[];
}

export interface VariantDb {
  id: string;
  sku?: string;
  options: Record<string, string>;
  price?: number;
  comparePrice?: number;
  stock: number;
  image?: string;
  colorHex?: string;
}

// ===================== SUPABASE CLIENT =====================

function getSupabase() {
  return createBrowserClient();
}

// ===================== CATEGORIES =====================

export async function getCategories(): Promise<DbCategory[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("[DB] getCategories error:", error);
    return [];
  }
  return data || [];
}

export async function getCategoryBySlug(
  slug: string
): Promise<DbCategory | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("[DB] getCategoryBySlug error:", error);
    return null;
  }
  return data;
}

export async function createCategory(
  category: Omit<DbCategory, "id" | "created_at">
): Promise<DbCategory | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select()
    .single();

  if (error) {
    console.error("[DB] createCategory error:", error);
    return null;
  }
  return data;
}

export async function updateCategory(
  id: string,
  updates: Partial<DbCategory>
): Promise<DbCategory | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[DB] updateCategory error:", error);
    return null;
  }
  return data;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("[DB] deleteCategory error:", error);
    return false;
  }
  return true;
}

// ===================== PRODUCTS =====================

export async function getProducts(): Promise<DbProduct[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[DB] getProducts error:", error);
    return [];
  }
  return data || [];
}

export async function getProductBySlug(
  slug: string
): Promise<DbProduct | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("[DB] getProductBySlug error:", error);
    return null;
  }
  return data;
}

export async function getFeaturedProducts(): Promise<DbProduct[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "ACTIVE")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("[DB] getFeaturedProducts error:", error);
    return [];
  }
  return data || [];
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<DbProduct[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_slug", categorySlug)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[DB] getProductsByCategory error:", error);
    return [];
  }
  return data || [];
}

export async function searchProducts(query: string): Promise<DbProduct[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "ACTIVE")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,vendor.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[DB] searchProducts error:", error);
    return [];
  }
  return data || [];
}

export async function createProduct(
  product: Omit<DbProduct, "id" | "created_at" | "updated_at">
): Promise<DbProduct | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error("[DB] createProduct error:", error);
    return null;
  }
  return data;
}

export async function updateProduct(
  id: string,
  updates: Partial<DbProduct>
): Promise<DbProduct | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[DB] updateProduct error:", error);
    return null;
  }
  return data;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("[DB] deleteProduct error:", error);
    return false;
  }
  return true;
}

// ===================== HELPERS =====================

/** Convert DbProduct to the legacy Product interface used by storefront components */
export function dbProductToLegacy(p: DbProduct) {
  return {
    id: p.id,
    sku: p.sku || undefined,
    title: p.title,
    slug: p.slug,
    description: p.description || "",
    price: p.price,
    comparePrice: p.compare_price || undefined,
    images: p.images || [],
    category: p.category || "",
    categorySlug: p.category_slug || "",
    rating: Number(p.rating) || 0,
    reviewCount: p.review_count || 0,
    stock: p.stock || 0,
    status: p.status as "ACTIVE" | "DRAFT" | "ARCHIVED",
    featured: p.featured || false,
    vendor: p.vendor || undefined,
    tags: p.tags || [],
    createdAt: p.created_at,
    variantOptions: p.variant_options?.map((v) => ({
      name: v.name,
      values: v.values,
    })),
    variants: p.variants?.map((v) => ({
      id: v.id,
      sku: v.sku,
      options: v.options,
      price: v.price,
      comparePrice: v.comparePrice,
      stock: v.stock,
      image: v.image,
      colorHex: v.colorHex,
    })),
  };
}

/** Convert DbCategory to the legacy Category interface */
export function dbCategoryToLegacy(c: DbCategory) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || undefined,
    image: c.image || "",
    productCount: c.product_count || 0,
  };
}
