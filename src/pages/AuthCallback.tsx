import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const next = params.get('next') || '/account'
    const code = params.get('code')

    const finish = async () => {
      try {
        if (code) {
          const { error: e } = await supabase.auth.exchangeCodeForSession(code)
          if (e) throw e
        }

        const { data } = await supabase.auth.getSession()
        if (data.session) {
          navigate(next, { replace: true })
          return
        }

        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            sub.subscription.unsubscribe()
            navigate(next, { replace: true })
          }
        })

        const fallback = window.setTimeout(() => {
          sub.subscription.unsubscribe()
          navigate('/auth/login', { replace: true })
        }, 5000)

        return () => {
          window.clearTimeout(fallback)
          sub.subscription.unsubscribe()
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Kirishda xatolik')
      }
    }

    void finish()
  }, [navigate, params])

  return (
    <div className="container flex h-[60vh] flex-col items-center justify-center text-center">
      <Loader2 className="h-7 w-7 animate-spin text-ink-subtle" />
      <p className="mt-4 text-ink-muted">Hisobingizga kirilmoqda...</p>
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
    </div>
  )
}
