import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Singleton instance for client-side usage
let clientInstance: ReturnType<typeof createClient> | null = null

export function getClient() {
  if (!clientInstance) {
    clientInstance = createClient()
  }
  return clientInstance
}
