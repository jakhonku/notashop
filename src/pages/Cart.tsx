import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Trash2, Music, Loader2, ArrowRight, CheckCircle2, Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatPriceUZS } from '@/lib/utils'
import { useProfile, useSession } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { CLICK_PAYMENT } from '@/lib/click'

type Stage = 'cart' | 'payment' | 'submitting' | 'done'

export default function Cart() {
  const cart = useCart()
  const { user } = useSession()
  const { data: profile } = useProfile(user)
  const navigate = useNavigate()
  const [stage, setStage] = useState<Stage>('cart')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const goToPayment = () => {
    if (!user) {
      navigate('/auth/login', { state: { from: '/cart' } })
      return
    }
    if (cart.items.length === 0) return
    setStage('payment')
  }

  const copyAmount = async () => {
    try {
      await navigator.clipboard.writeText(cart.total().toString())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  const submitOrder = async () => {
    setError(null)
    if (!user) {
      setError("Avval tizimga kiring")
      return
    }
    const trimmed = phone.replace(/\s+/g, '')
    if (!/^\+?998\d{9}$|^\d{9}$/.test(trimmed)) {
      setError("Telefon raqamini to'g'ri kiriting. Masalan: 901234567 yoki +998901234567")
      return
    }
    setStage('submitting')
    const { error: e } = await supabase.from('pending_orders').insert({
      user_id: user.id,
      user_email: user.email ?? null,
      user_name: profile?.full_name ?? null,
      customer_phone: trimmed,
      note_ids: cart.items.map((i) => i.id),
      total_uzs: cart.total(),
    })
    if (e) {
      setError(e.message)
      setStage('payment')
      return
    }
    cart.clear()
    setStage('done')
  }

  if (cart.items.length === 0 && stage !== 'done') {
    return (
      <div className="container py-20 max-w-xl text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-surface ring-1 ring-ink/8 flex items-center justify-center">
          <ShoppingBag className="h-7 w-7 text-ink-subtle" strokeWidth={1.5} />
        </div>
        <h1 className="mt-6 font-serif text-4xl md:text-5xl tracking-tight">
          Savatchangiz bo'sh
        </h1>
        <p className="mt-3 text-ink-muted">
          Katalogdan o'zingizga yoqqan asarlarni tanlang va savatchaga qo'shing.
        </p>
        <Button asChild size="lg" className="mt-7">
          <Link to="/catalog">Katalogga o'tish</Link>
        </Button>
      </div>
    )
  }

  if (stage === 'done') {
    return (
      <div className="container py-24 max-w-xl text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 200 }}
          className="mx-auto h-20 w-20 rounded-full bg-gold/15 ring-1 ring-gold/30 flex items-center justify-center"
        >
          <CheckCircle2 className="h-10 w-10 text-gold-deep" strokeWidth={1.5} />
        </motion.div>
        <div className="mt-7 text-xs uppercase tracking-[0.22em] text-ink-subtle">
          Buyurtma qabul qilindi
        </div>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl tracking-tight">
          Tashakkur.
        </h1>
        <p className="mt-4 text-ink-muted text-pretty">
          Tо'lov amalga oshirilgach, administrator buyurtmangizni tasdiqlaydi va
          notalar profilingizda paydo bo'ladi. Bu odatda <span className="italic-serif text-ink">15 daqiqadan</span> oshmaydi.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/account">Profilim</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/catalog">Yana ko'rish</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (stage === 'payment' || stage === 'submitting') {
    return (
      <div className="container py-12 md:py-16 max-w-2xl">
        <button
          onClick={() => setStage('cart')}
          className="text-sm text-ink-muted hover:text-ink mb-6"
        >
          ← Savatchaga qaytish
        </button>

        <div className="text-xs uppercase tracking-[0.22em] text-ink-subtle">To'lov</div>
        <h1 className="mt-2 font-serif text-5xl md:text-6xl tracking-tight">
          Click bilan <span className="italic-serif">to'lash.</span>
        </h1>

        <div className="mt-10 rounded-3xl bg-surface ring-1 ring-ink/8 shadow-soft overflow-hidden">
          <div className="p-7">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-ink-subtle">To'lanadigan summa</span>
              <button
                onClick={copyAmount}
                className="text-xs text-ink-muted hover:text-ink inline-flex items-center gap-1"
              >
                {copied ? 'Nusxalandi' : 'Summani nusxalash'}
                <Copy className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-2 font-serif text-5xl md:text-6xl tabular-nums tracking-tight">
              {formatPriceUZS(cart.total())}
            </div>

            <div className="mt-7 grid sm:grid-cols-2 gap-2 text-sm">
              <div className="rounded-2xl bg-surface-base ring-1 ring-ink/8 p-4">
                <div className="text-[11px] uppercase tracking-[0.14em] text-ink-subtle">Qabul qiluvchi</div>
                <div className="mt-1 font-medium">{CLICK_PAYMENT.recipient}</div>
              </div>
              <div className="rounded-2xl bg-surface-base ring-1 ring-ink/8 p-4">
                <div className="text-[11px] uppercase tracking-[0.14em] text-ink-subtle">Karta</div>
                <div className="mt-1 font-medium tabular-nums">{CLICK_PAYMENT.cardMasked}</div>
              </div>
            </div>

            <a
              href={CLICK_PAYMENT.p2pLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full h-12 items-center justify-center gap-2 rounded-full bg-ink text-surface-base hover:bg-ink/90 font-medium text-sm transition-colors"
            >
              Click P2P sahifasini ochish
              <ExternalLink className="h-4 w-4" />
            </a>
            <p className="mt-3 text-xs text-ink-subtle text-center">
              Yoki Click Up ilovasidan QR-kodni skanerlang. Telegram: {CLICK_PAYMENT.telegramBot}
            </p>
          </div>

          <div className="ink-divider" />

          <div className="p-7">
            <h3 className="font-serif text-2xl tracking-tight">To'lovni tasdiqlash</h3>
            <p className="mt-2 text-sm text-ink-muted">
              To'lov amalga oshirilgach, biz tekshirib chiqishimiz uchun telefon raqamingizni kiriting.
              Tasdiqlangach, notalar profilingizga avtomatik qo'shiladi.
            </p>

            <div className="mt-5">
              <Label htmlFor="phone">Telefon raqam</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5"
                disabled={stage === 'submitting'}
              />
            </div>

            {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}

            <Button
              onClick={submitOrder}
              disabled={stage === 'submitting'}
              size="lg"
              className="w-full mt-5"
            >
              {stage === 'submitting' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {stage === 'submitting' ? 'Yuborilmoqda...' : "Buyurtmani yuborish"}
            </Button>

            <p className="mt-4 text-xs text-ink-subtle text-center leading-relaxed">
              To'lovingiz qo'lda tekshiriladi. Tasdiqlash odatda 15 daqiqadan oshmaydi.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="text-xs uppercase tracking-[0.22em] text-ink-subtle">Buyurtma</div>
      <h1 className="mt-2 font-serif text-5xl md:text-7xl tracking-tight">Savatcha</h1>
      <p className="mt-3 text-ink-muted">{cart.items.length} ta asar tanlangan</p>

      <div className="mt-12 grid lg:grid-cols-[1fr_360px] gap-10">
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
                className="flex items-center gap-4 rounded-2xl bg-surface ring-1 ring-ink/8 shadow-soft p-4"
              >
                <Link
                  to={`/note/${item.id}`}
                  className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-alt"
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
                    <h3 className="font-serif text-lg leading-tight text-ink truncate">{item.title}</h3>
                  </Link>
                  <p className="mt-1 text-sm tabular-nums text-ink-muted">
                    {formatPriceUZS(item.price_uzs)}
                  </p>
                </div>
                <button
                  onClick={() => cart.remove(item.id)}
                  className="rounded-full p-2 text-ink-subtle hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  aria-label="O'chirish"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={cart.clear}
            className="mt-4 text-sm text-ink-subtle hover:text-rose-700"
          >
            Savatchani tozalash
          </button>
        </div>

        <aside className="h-fit lg:sticky lg:top-24 rounded-3xl bg-surface ring-1 ring-ink/8 shadow-soft p-6">
          <h2 className="font-serif text-2xl tracking-tight">Hisobot</h2>
          <dl className="mt-5 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Asarlar soni</dt>
              <dd className="tabular-nums">{cart.items.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Jami</dt>
              <dd className="tabular-nums">{formatPriceUZS(cart.total())}</dd>
            </div>
          </dl>
          <div className="my-5 ink-divider" />
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-[0.18em] text-ink-subtle">To'lovga</span>
            <span className="font-serif text-3xl tracking-tight tabular-nums">
              {formatPriceUZS(cart.total())}
            </span>
          </div>

          <Button onClick={goToPayment} size="lg" className="w-full mt-6">
            <ArrowRight className="h-4 w-4" />
            Click orqali to'lash
          </Button>

          <p className="mt-4 text-xs text-ink-subtle text-center leading-relaxed">
            To'lov Click P2P orqali amalga oshiriladi. Tasdiqlanganidan keyin notalar
            avtomatik profilingizga qo'shiladi.
          </p>
        </aside>
      </div>
    </div>
  )
}
