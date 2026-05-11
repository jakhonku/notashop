import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Music, ArrowLeft, Loader2, Check, ShoppingBag, Zap } from 'lucide-react'
import { useNote } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/store/cartStore'
import { difficultyTone, formatPriceUZS } from '@/lib/utils'

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
        <h2 className="text-2xl font-semibold">Nota topilmadi</h2>
        <p className="mt-2 text-ink-muted">Bu havola noto'g'ri yoki nota o'chirilgan.</p>
        <Button asChild className="mt-6">
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
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Orqaga
      </button>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="aspect-[3/4] rounded-3xl overflow-hidden ring-1 ring-black/5 shadow-soft bg-gradient-to-br from-surface-alt to-white">
            {note.cover_url ? (
              <img src={note.cover_url} alt={note.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink-subtle">
                <Music className="h-20 w-20" />
              </div>
            )}
          </div>

          {note.preview_url && (
            <div className="mt-6 rounded-3xl ring-1 ring-black/5 overflow-hidden bg-white">
              <div className="p-4 border-b border-black/5">
                <p className="text-xs uppercase tracking-wider text-ink-subtle font-semibold">
                  Oldindan ko'rish
                </p>
              </div>
              <div className="relative">
                <img
                  src={note.preview_url}
                  alt="Oldindan ko'rish"
                  className="w-full blur-md select-none pointer-events-none"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                  <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-ink-muted ring-1 ring-black/5">
                    To'liq nusxa sotib olishdan keyin ochiladi
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-surface-alt text-ink-muted ring-black/10">{note.category}</Badge>
            <Badge className="bg-surface-alt text-ink-muted ring-black/10">{note.instrument}</Badge>
            <Badge className={difficultyTone(note.difficulty)}>{note.difficulty}</Badge>
          </div>

          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-ink text-balance">
            {note.title}
          </h1>
          {note.composer && (
            <p className="mt-2 text-lg text-ink-muted">{note.composer}</p>
          )}

          {note.description && (
            <p className="mt-6 text-ink leading-relaxed text-balance">
              {note.description}
            </p>
          )}

          <div className="mt-8 rounded-3xl bg-white ring-1 ring-black/5 shadow-soft p-6">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink-subtle">Narxi</span>
              <span className="text-3xl font-semibold tracking-tight tabular-nums">
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
                    Savatchaga qo'shish
                  </>
                )}
              </Button>
              <Button size="lg" onClick={buyNow}>
                <Zap className="h-4 w-4" />
                Hozir sotib olish
              </Button>
            </div>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-ink-muted">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" /> Yuqori sifatli PDF formatda
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" /> Sotib olgandan keyin darhol yuklab olish
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" /> Profil orqali doimiy kirish
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
