import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

function StaffLines({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
      aria-hidden
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="0"
          x2="400"
          y1={4 + i * 8}
          y2={4 + i * 8}
          stroke="currentColor"
          strokeWidth="0.6"
        />
      ))}
    </svg>
  )
}

function TrebleClef({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 200" fill="currentColor" aria-hidden>
      <path d="M50 5c-8 0-15 7-15 17 0 8 4 14 10 20-12 8-22 18-22 36 0 22 18 36 38 36 4 0 8-1 11-2l3 22c1 8-4 14-13 14-7 0-12-4-13-10 5 0 9-4 9-9 0-6-5-10-11-10-7 0-12 5-12 13 0 13 11 22 27 22 17 0 28-11 26-26l-3-23c19-3 30-17 30-34 0-15-12-26-27-26-3 0-6 0-9 1l-4-29c12-7 19-19 19-32 0-12-6-20-14-20zm0 8c5 0 9 6 9 14 0 10-7 19-16 23l-3-22c0-9 5-15 10-15zm6 60l4 28c-3 0-5 1-8 1-13 0-23-9-23-22 0-10 6-17 17-22zm12 4c11 0 20 8 20 19 0 12-9 22-22 24l-4-28c2 0 4-1 6-1 5 0 9 3 9 8 0 4-2 7-6 8l1 8c8-2 13-9 13-17 0-10-8-16-17-16-1 0-2 0-3 1l-1-6c2 0 3 0 4 0z" />
    </svg>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-center">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2.5 rounded-full bg-surface ring-1 ring-ink/10 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-ink-muted"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
              Yangi mavsum · Bahor 2026
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 font-serif text-[3.25rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[0.95] tracking-tight text-ink"
            >
              Har bir asar — <br />
              <span className="italic-serif text-accent">o'z ovoziga</span> arzigulik.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl text-lg sm:text-xl text-ink-muted text-pretty leading-relaxed"
            >
              Klassikadan zamonaviy va milliy kuylargacha — puxta tahrirlangan notalar to'plami.
              Tanlang, to'lang, darhol PDF formatda yuklab oling.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <Button asChild size="lg">
                <Link to="/catalog">
                  Katalogga kirish
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Link
                to="/auth/register"
                className="text-sm font-medium text-ink-muted hover:text-ink underline-offset-4 hover:underline"
              >
                Yoki bepul ro'yxatdan o'tish →
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="mt-14 grid grid-cols-3 max-w-md gap-8"
            >
              <div>
                <div className="font-serif text-3xl md:text-4xl tracking-tight tabular-nums text-ink">
                  1200<span className="text-gold">+</span>
                </div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-ink-subtle mt-1.5">
                  Asarlar
                </div>
              </div>
              <div>
                <div className="font-serif text-3xl md:text-4xl tracking-tight tabular-nums text-ink">
                  12
                </div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-ink-subtle mt-1.5">
                  Cholg'u turi
                </div>
              </div>
              <div>
                <div className="font-serif text-3xl md:text-4xl tracking-tight tabular-nums text-ink">
                  99<span className="text-gold">%</span>
                </div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-ink-subtle mt-1.5">
                  Mamnun mijoz
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block relative"
          >
            <div className="relative w-[280px] lg:w-[340px] aspect-[3/4] bg-surface rounded-3xl ring-1 ring-ink/10 shadow-lift overflow-hidden">
              <div className="absolute inset-0 paper" />
              <div className="absolute inset-x-6 top-12 space-y-6 text-ink/35">
                <StaffLines className="w-full h-10" />
                <StaffLines className="w-full h-10" />
                <StaffLines className="w-full h-10" />
                <StaffLines className="w-full h-10" />
                <StaffLines className="w-full h-10" />
              </div>
              <TrebleClef className="absolute right-8 top-6 h-44 w-auto text-gold-deep opacity-90" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
                  Opus N° 042
                </div>
                <div className="mt-1 font-serif text-2xl leading-tight text-ink">
                  Nocturne <span className="italic-serif">in C minor</span>
                </div>
                <div className="text-xs text-ink-muted mt-1">F. Chopin · Pianino</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="ink-divider mt-20" />
      </div>
    </section>
  )
}
