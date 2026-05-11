import { Link } from 'react-router-dom'
import { Loader2, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Hero } from '@/components/Hero'
import { CategoryGrid } from '@/components/CategoryGrid'
import { NoteCard } from '@/components/NoteCard'
import { useNotes } from '@/lib/queries'

export default function Home() {
  const { data: notes, isLoading } = useNotes()
  const featured = (notes ?? []).slice(0, 8)

  return (
    <>
      <Hero />

      <section className="container py-20 md:py-28">
        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-ink-subtle">
              Yangi qo'shilganlar
            </div>
            <h2 className="mt-3 font-serif text-4xl md:text-6xl leading-[1.02] tracking-tight text-ink text-balance">
              Tahrir <span className="italic-serif">tanlovi.</span>
            </h2>
            <p className="mt-3 text-ink-muted max-w-xl text-pretty">
              Tahririyat tomonidan saralangan, har oy yangilanib turuvchi tanlangan asarlar.
            </p>
          </div>
          <Link
            to="/catalog"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent group"
          >
            Barchasini ko'rish
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-ink-subtle" />
          </div>
        ) : featured.length === 0 ? (
          <div className="rounded-3xl bg-surface ring-1 ring-ink/8 p-12 text-center">
            <p className="text-ink-muted">Hozircha notalar mavjud emas. Tez orada qo'shamiz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((n, i) => (
              <NoteCard key={n.id} note={n} index={i} />
            ))}
          </div>
        )}
      </section>

      <CategoryGrid />

      <section className="container py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] bg-surface-deep text-surface-base p-10 md:p-16"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, currentColor 0, currentColor 1px, transparent 1px, transparent 12px)',
            }}
          />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold/30 blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl">
            <div className="text-xs uppercase tracking-[0.22em] text-gold-soft">
              Ro'yxatdan o'tish
            </div>
            <h3 className="mt-3 font-serif text-4xl md:text-6xl leading-[1.02] tracking-tight text-balance">
              Ijroni shu yerdan <span className="italic-serif text-gold-soft">boshlang.</span>
            </h3>
            <p className="mt-5 text-white/65 text-lg max-w-lg text-pretty">
              Bepul hisob oching va minglab notadan birini bir bosishda yuklab oling.
              Email tasdiqlash, parol o'ylab topish — hech narsasi shart emas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/auth/register"
                className="inline-flex h-12 items-center justify-center rounded-full bg-gold text-ink px-7 text-sm font-medium hover:bg-gold/90 transition-colors"
              >
                Hisob ochish
              </Link>
              <Link
                to="/catalog"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 text-white px-7 text-sm font-medium hover:bg-white/15 transition-colors"
              >
                Avval katalogni ko'rish
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
