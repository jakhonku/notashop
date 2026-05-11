import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!url || !anon) {
  console.warn(
    '[NotaShop] VITE_SUPABASE_URL yoki VITE_SUPABASE_ANON_KEY .env faylida belgilanmagan.',
  )
}

export const supabase = createClient(url ?? 'http://localhost', anon ?? 'public-anon-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const isSupabaseConfigured = Boolean(url && anon)
