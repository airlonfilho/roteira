import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Cria um cliente Supabase que funciona com segurança no navegador do usuário
  return createBrowserClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )
}