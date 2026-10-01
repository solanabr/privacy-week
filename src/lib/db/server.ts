import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./types";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

let client: SupabaseClient<Database> | null = null;

/**
 * Server-only Supabase client using the service role key.
 *
 * This module must never be imported from a Client Component. All database
 * access goes through Server Components, Server Actions and Route Handlers.
 */
export function getDb(): SupabaseClient<Database> {
  if (!client) {
    client = createClient<Database>(
      required("SUPABASE_URL"),
      required("SUPABASE_SERVICE_ROLE_KEY"),
      {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { "X-Client-Info": "privacy-week-server" } },
      },
    );
  }
  return client;
}

export type { Database };
