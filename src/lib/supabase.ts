import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const rawAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const url = rawUrl?.trim().replace(/\/+$/, '')
const anon = rawAnon?.trim()

if (!url || !anon) {
  console.error(
    '[NotaShop] VITE_SUPABASE_URL yoki VITE_SUPABASE_ANON_KEY belgilanmagan. ' +
      'Vercel → Settings → Environment Variables ni tekshiring va qayta deploy qiling.',
  )
}

export const supabase = createClient(
  url ?? 'https://example.invalid',
  anon ?? 'missing-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'implicit',
    },
  },
)

export const isSupabaseConfigured = Boolean(url && anon)
