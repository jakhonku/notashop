import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Trash2, Music, Loader2, Lock } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { formatPriceUZS } from '@/lib/utils'
import { useSession } from '@/lib/queries'
import { supabase } from '@/lib/supabase'

export default function Cart() {
  const cart = useCart()
  const { user } = useSession()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkout = async () => {
    setError(null)
    if (!user) {
      navigate('/auth/login', { state: { from: '/cart' } })
      return
    }
    if (cart.items.length === 0) return

    setLoading(true)
    try {
      const { data, error: fnError } = await supabase.functions.invoke<{ url: string }>(
        'create-checkout',
        {
          body: {
            noteIds: cart.items.map((i) => i.id),
            userId: user.id,
            successUrl: `${window.location.origin}/success`,
            cancelUrl: `${window.location.origin}/cancel`,
          },
        },
      )
      if (fnError) throw fnError
      if (!data?.url) throw new Error("To'lov sahifasi yaratilmadi")
      window.location.href = data.url
    } catch (e) {
      const msg = e instanceof Error ? e.message : "To'lovni boshlashda xatolik"
      setError(msg)
      setLoading(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="container py-20 max-w-xl text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-surface-alt flex items-center justify-center">
          <ShoppingBag className="h-7 w-7 text-ink-subtle" />
        </div>
        <h1 className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight">
          Savatchangiz bo'sh
        </h1>
        <p className="mt-3 text-ink-muted">
          Katalogdan o'zingizga yoqqan notalarni tanlang va savatchaga qo'shing.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/catalog">Katalogga o'tish</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-10 md:py-14">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Savatcha</h1>
      <p className="mt-2 text-ink-muted">{cart.items.length} ta nota tanlangan</p>

      <div className="mt-10 grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {cart.items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-4 rounded-3xl bg-white ring-1 ring-black/5 shadow-soft p-4"
              >
                <Link
                  to={`/note/${item.id}`}
                  className="h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface-alt"
                >
                  {item.cover_url ? (
                    <img src={item.cover_url} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink-subtle">
                      <Music className="h-5 w-5" />
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/note/${item.id}`} className="block">
                    <h3 className="font-medium text-ink truncate">{item.title}</h3>
                  </Link>
                  <p className="mt-1 text-sm tabular-nums text-ink-muted">
                    {formatPriceUZS(item.price_uzs)}
                  </p>
                </div>
                <button
                  onClick={() => cart.remove(item.id)}
                  className="rounded-full p-2 text-ink-subtle hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  aria-label="O'chirish"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={cart.clear}
            className="mt-4 text-sm text-ink-subtle hover:text-rose-600"
          >
            Savatchani tozalash
          </button>
        </div>

        <aside className="h-fit lg:sticky lg:top-24 rounded-3xl bg-white ring-1 ring-black/5 shadow-soft p-6">
          <h2 className="font-semibold text-ink">Buyurtma xulosasi</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Notalar</dt>
              <dd className="tabular-nums">{cart.items.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Jami summa</dt>
              <dd className="tabular-nums">{formatPriceUZS(cart.total())}</dd>
            </div>
          </dl>
          <div className="my-4 h-px bg-black/5" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-ink-muted">To'lovga</span>
            <span className="text-2xl font-semibold tabular-nums">
              {formatPriceUZS(cart.total())}
            </span>
          </div>

          <Button onClick={checkout} disabled={loading} size="lg" className="w-full mt-6">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {loading ? 'Yo\'naltirilmoqda...' : "To'lovga o'tish"}
          </Button>

          {error && (
            <p className="mt-3 text-sm text-rose-600 text-center">{error}</p>
          )}

          <p className="mt-3 text-xs text-ink-subtle text-center">
            To'lov Stripe orqali xavfsiz amalga oshiriladi.
          </p>
        </aside>
      </div>
    </div>
  )
}
