import { createClient } from "@supabase/supabase-js";

/**
 * Server-only admin client that uses the secret key (bypasses RLS).
 * NEVER import this in client components.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secret) {
    throw new Error("Missing Supabase admin credentials");
  }

  return createClient(url, secret, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
