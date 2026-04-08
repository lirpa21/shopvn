import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { categories, products } from "@/lib/mock-data";

/**
 * POST /api/seed — Seed database with mock data
 * Only works when tables are empty
 */
export async function POST() {
  const supabase = await createClient();

  // Check if data already exists
  const { count: catCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  if (catCount && catCount > 0) {
    return NextResponse.json(
      { message: `Database already has ${catCount} categories. Skipping seed.` },
      { status: 200 }
    );
  }

  // Seed categories
  const categoryMap: Record<string, string> = {}; // slug -> uuid

  for (const cat of categories) {
    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: cat.name,
        slug: cat.slug,
        description: cat.description || null,
        image: cat.image,
        product_count: cat.productCount,
      })
      .select("id, slug")
      .single();

    if (error) {
      console.error("[Seed] Category error:", error);
      continue;
    }
    if (data) {
      categoryMap[data.slug] = data.id;
    }
  }

  // Seed products
  let productCount = 0;
  for (const prod of products) {
    const categoryId = categoryMap[prod.categorySlug] || null;

    const { error } = await supabase.from("products").insert({
      title: prod.title,
      slug: prod.slug,
      description: prod.description,
      price: prod.price,
      compare_price: prod.comparePrice || null,
      images: prod.images,
      category_id: categoryId,
      category: prod.category,
      category_slug: prod.categorySlug,
      rating: prod.rating,
      review_count: prod.reviewCount,
      stock: prod.stock,
      status: prod.status,
      featured: prod.featured,
      vendor: prod.vendor || null,
      tags: prod.tags,
      sku: prod.sku || null,
      variant_options: prod.variantOptions || [],
      variants: prod.variants || [],
      created_at: prod.createdAt,
    });

    if (error) {
      console.error("[Seed] Product error:", prod.title, error);
      continue;
    }
    productCount++;
  }

  return NextResponse.json({
    success: true,
    categories: Object.keys(categoryMap).length,
    products: productCount,
  });
}
