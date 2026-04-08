import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** GET /api/products — List all products */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const search = searchParams.get("q");
  const status = searchParams.get("status") || "ACTIVE";

  let query = supabase.from("products").select("*");

  if (status !== "all") {
    query = query.eq("status", status);
  }
  if (category) {
    query = query.eq("category_slug", category);
  }
  if (featured === "true") {
    query = query.eq("featured", true);
  }
  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,vendor.ilike.%${search}%`
    );
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/** POST /api/products — Create a product */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("products")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
