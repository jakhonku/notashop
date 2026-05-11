import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const rawAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const sanitizeJwt = (v: string | undefined): string | undefined =>
  v?.replace(/[^A-Za-z0-9._-]/g, '') || undefined

const sanitizeUrl = (v: string | undefined): string | undefined => {
  const cleaned = v?.replace(/\s+/g, '').replace(/\/+$/, '')
  return cleaned || undefined
}

const url = sanitizeUrl(rawUrl)
const anon = sanitizeJwt(rawAnon)

if (!url || !anon) {
  console.error(
    '[NotaShop] VITE_SUPABASE_URL yoki VITE_SUPABASE_ANON_KEY belgilanmagan. ' +
      'Vercel → Settings → Environment Variables ni tekshiring va qayta deploy qiling.',
  )
} else {
  console.info(
    `[NotaShop] Supabase ulandi. URL: ${url}. Anon length: ${anon.length}`,
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
