import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isConfigured =
  SUPABASE_URL &&
  SUPABASE_KEY &&
  SUPABASE_URL !== "your_supabase_project_url" &&
  SUPABASE_KEY !== "your_supabase_anon_key";

export function createClient() {
  if (!isConfigured) {
    // Return a mock-like client that won't crash the app
    return createBrowserClient(
      "https://placeholder.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder"
    );
  }
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}

export { isConfigured as isSupabaseConfigured };
