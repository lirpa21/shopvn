import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isConfigured =
  SUPABASE_URL &&
  SUPABASE_KEY &&
  SUPABASE_URL !== "your_supabase_project_url" &&
  SUPABASE_KEY !== "your_supabase_anon_key";

export async function createClient() {
  const cookieStore = await cookies();

  const url = isConfigured ? SUPABASE_URL : "https://placeholder.supabase.co";
  const key = isConfigured
    ? SUPABASE_KEY
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

export { isConfigured as isSupabaseConfigured };
