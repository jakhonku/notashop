import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/lib/queries'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

const perks = [
  'Hisob ochish bepul va tezkor',
  "Sotib olingan notalar profilingizda saqlanib qoladi",
  'Email tasdiqlash va parol talab qilinmaydi',
  "Istalgan vaqtda yuklab olish imkoniyati",
]

export default function Register() {
  const navigate = useNavigate()
  const { user, loading } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      navigate('/account', { replace: true })
    }
  }, [user, loading, navigate])

  const signUpWithGoogle = async () => {
    setError(null)
    setSubmitting(true)
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/account')}`
    const { error: e } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: { prompt: 'select_account' },
      },
    })
    if (e) {
      setError("Ro'yxatdan o'tishda xatolik yuz berdi. Qaytadan urinib ko'ring.")
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-20 max-w-md">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.22em] text-ink-subtle">NotaShop</div>
        <h1 className="mt-3 font-serif text-5xl tracking-tight">
          Birga <span className="italic-serif">boshlaymiz.</span>
        </h1>
        <p className="mt-3 text-ink-muted">
          Google hisobingiz bilan bir daqiqada hisob oching.
        </p>
      </div>

      <div className="mt-10 rounded-3xl bg-surface ring-1 ring-ink/8 shadow-soft p-7 space-y-5">
        <Button
          onClick={signUpWithGoogle}
          disabled={submitting || loading}
          size="lg"
          variant="outline"
          className="w-full"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="h-5 w-5" />
          )}
          Google bilan ro'yxatdan o'tish
        </Button>

        <div className="ink-divider" />

        <ul className="space-y-3 text-sm text-ink-muted">
          {perks.map((p) => (
            <li key={p} className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-gold-deep mt-0.5 shrink-0" strokeWidth={2.5} />
              <span>{p}</span>
            </li>
          ))}
        </ul>

        {error && <p className="text-sm text-rose-700 text-center">{error}</p>}
      </div>

      <p className="mt-8 text-center text-sm text-ink-muted">
        Hisobingiz bormi?{' '}
        <Link to="/auth/login" className="text-ink font-medium hover:text-accent underline-offset-4 hover:underline">
          Kirish
        </Link>
      </p>
    </div>
  )
}
