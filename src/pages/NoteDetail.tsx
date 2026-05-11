import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Music, ArrowLeft, Loader2, Check, ShoppingBag, Zap } from 'lucide-react'
import { useNote } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { useCart } from '@/store/cartStore'
import { cn, difficultyTone, formatPriceUZS } from '@/lib/utils'

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: note, isLoading } = useNote(id)
  const cart = useCart()

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-subtle" />
      </div>
    )
  }

  if (!note) {
    return (
      <div className="container py-20 text-center">
        <h2 className="font-serif text-4xl">Asar topilmadi</h2>
        <p className="mt-3 text-ink-muted">Bu havola noto'g'ri yoki nota olib tashlangan.</p>
        <Button asChild className="mt-7">
          <Link to="/catalog">Katalogga qaytish</Link>
        </Button>
      </div>
    )
  }

  const inCart = cart.has(note.id)
  const addToCart = () => {
    cart.add({
      id: note.id,
      title: note.title,
      price_uzs: note.price_uzs,
      cover_url: note.cover_url,
    })
  }
  const buyNow = () => {
    if (!inCart) addToCart()
    navigate('/cart')
  }

  return (
    <div className="container py-10 md:py-14">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Orqaga
      </button>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="aspect-[3/4] rounded-3xl overflow-hidden ring-1 ring-ink/8 shadow-soft bg-surface-alt">
            {note.cover_url ? (
              <img src={note.cover_url} alt={note.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink-subtle">
                <Music className="h-20 w-20" strokeWidth={1.25} />
              </div>
            )}
          </div>

          {note.preview_url && (
            <div className="mt-6 rounded-3xl ring-1 ring-ink/8 overflow-hidden bg-surface">
              <div className="p-4 border-b border-ink/8">
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-subtle">
                  Oldindan ko'rish
                </p>
              </div>
              <div className="relative">
                <img
                  src={note.preview_url}
                  alt="Oldindan ko'rish"
                  className="w-full blur-md select-none pointer-events-none"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-surface/40">
                  <span className="rounded-full bg-surface/95 px-4 py-2 text-sm text-ink-muted ring-1 ring-ink/8">
                    To'liq nusxa to'lovdan keyin ochiladi
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-[11px] uppercase tracking-[0.22em] text-ink-subtle">
            {note.instrument} · {note.category}
          </div>

          <h1 className="mt-3 font-serif text-5xl md:text-6xl leading-[1.02] tracking-tight text-ink text-balance">
            {note.title}
          </h1>

          {note.composer && (
            <p className="mt-3 text-xl italic-serif text-ink-muted">{note.composer}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] font-medium ring-1 ring-inset',
                difficultyTone(note.difficulty),
              )}
            >
              {note.difficulty}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface ring-1 ring-ink/10 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              PDF format
            </span>
          </div>

          {note.description && (
            <div className="mt-8 prose prose-stone max-w-none">
              <p className="text-ink leading-relaxed text-lg text-pretty">
                {note.description}
              </p>
            </div>
          )}

          <div className="mt-10 rounded-3xl bg-surface ring-1 ring-ink/8 shadow-soft p-6">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-ink-subtle">Narxi</span>
              <span className="font-serif text-4xl tracking-tight tabular-nums text-ink">
                {formatPriceUZS(note.price_uzs)}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                size="lg"
                variant={inCart ? 'secondary' : 'outline'}
                onClick={addToCart}
                disabled={inCart}
              >
                {inCart ? (
                  <>
                    <Check className="h-4 w-4" />
                    Savatchada
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Savatchaga
                  </>
                )}
              </Button>
              <Button size="lg" onClick={buyNow}>
                <Zap className="h-4 w-4" />
                Sotib olish
              </Button>
            </div>
          </div>

          <ul className="mt-8 space-y-3 text-sm text-ink-muted">
            <li className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-gold-deep" strokeWidth={2.5} />
              Asl, professional tahrirlangan PDF
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-gold-deep" strokeWidth={2.5} />
              To'lovdan keyin darhol yuklab olinadi
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-gold-deep" strokeWidth={2.5} />
              Profil orqali doimiy kirish — yo'qotmaysiz
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
