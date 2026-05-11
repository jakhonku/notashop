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

    const providerError = params.get('error_description') || params.get('error')
    if (providerError) {
      setError(decodeURIComponent(providerError))
      const t = window.setTimeout(() => navigate('/auth/login', { replace: true }), 2500)
      return () => window.clearTimeout(t)
    }

    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      if (data.session) navigate(next, { replace: true })
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      if (session) navigate(next, { replace: true })
    })

    const fallback = window.setTimeout(() => {
      if (!mounted) return
      setError("Tizimga kirish kutilganidan ko'proq vaqt oldi. Qaytadan urinib ko'ring.")
      window.setTimeout(() => navigate('/auth/login', { replace: true }), 1500)
    }, 8000)

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
      window.clearTimeout(fallback)
    }
  }, [navigate, params])

  return (
    <div className="container flex h-[60vh] flex-col items-center justify-center text-center">
      <Loader2 className="h-7 w-7 animate-spin text-ink-subtle" />
      <p className="mt-4 text-ink-muted">Hisobingizga kirilmoqda...</p>
      {error && <p className="mt-3 text-sm text-rose-600 max-w-sm">{error}</p>}
    </div>
  )
}
