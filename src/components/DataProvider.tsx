"use client";

import { useEffect, useRef } from "react";
import { useProductManagement } from "@/stores/product-store";
import { useCategoryManagement } from "@/stores/category-store";

/**
 * DataProvider — auto-fetches products and categories from Supabase on mount.
 * Place in the root layout so data is loaded once for the entire app.
 */
export default function DataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetchProducts = useProductManagement((s) => s.fetchProducts);
  const fetchCategories = useCategoryManagement((s) => s.fetchCategories);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchProducts();
      fetchCategories();
    }
  }, [fetchProducts, fetchCategories]);

  return <>{children}</>;
}
