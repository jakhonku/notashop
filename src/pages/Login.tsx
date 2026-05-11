import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Loader2, Music } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

type LocationState = { from?: string } | null

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

export default function Login() {
  const location = useLocation()
  const from = (location.state as LocationState)?.from ?? '/account'

  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const signInWithGoogle = async () => {
    setError(null)
    setSubmitting(true)
    const redirectTo = `${window.location.origin}${from}`
    const { error: e } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: { prompt: 'select_account' },
      },
    })
    if (e) {
      setError('Google orqali kirishda xatolik yuz berdi. Qaytadan urinib ko\'ring.')
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-16 max-w-md">
      <div className="text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-[0_4px_12px_rgba(0,113,227,0.3)]">
          <Music className="h-5 w-5" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">Hisobga kirish</h1>
        <p className="mt-2 text-ink-muted">
          Google hisobingiz orqali bir bosishda kiring.
        </p>
      </div>

      <div className="mt-8 rounded-3xl bg-white ring-1 ring-black/5 shadow-soft p-7 space-y-4">
        <Button
          onClick={signInWithGoogle}
          disabled={submitting}
          size="lg"
          variant="outline"
          className="w-full"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="h-5 w-5" />
          )}
          Google bilan davom etish
        </Button>

        {error && <p className="text-sm text-rose-600 text-center">{error}</p>}

        <p className="text-center text-xs text-ink-subtle leading-relaxed">
          Davom etish orqali siz xizmatdan foydalanish shartlariga roziligingizni bildirgan
          hisoblanasiz. Hisobingiz birinchi marta kirayotgan bo'lsa, avtomatik ravishda
          ro'yxatdan o'tasiz.
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Yangi foydalanuvchi?{' '}
        <Link to="/auth/register" className="text-accent font-medium hover:underline">
          Ro'yxatdan o'tish
        </Link>
      </p>
    </div>
  )
}
