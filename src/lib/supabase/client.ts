// Supabase Client Configuration
// Browser and Server clients for Padel Club Manager

import { createBrowserClient, createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Creates a Supabase client for use in browser/client components
 * Use this in components with 'use client' directive
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Creates a Supabase client for use in server components
 * Use this in Server Components, Route Handlers, and Server Actions
 */
export function createServerComponentClient(cookieStore: {
  get: (name: string) => { value: string } | undefined;
}) {
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });
}

/**
 * Creates a Supabase client for use in Server Actions and Route Handlers
 * This version can both read and write cookies
 */
export function createServerActionClient(cookieStore: {
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, options?: Record<string, unknown>) => void;
  delete: (name: string) => void;
}) {
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        cookieStore.set(name, value, options);
      },
      remove(name: string, _options: Record<string, unknown>) {
        cookieStore.delete(name);
      },
    },
  });
}

// Re-export types for convenience
export type { Database };
