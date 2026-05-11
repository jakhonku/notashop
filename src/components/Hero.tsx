import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh pointer-events-none" aria-hidden />
      <div className="container relative pt-20 pb-24 md:pt-32 md:pb-36 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full bg-white/80 ring-1 ring-black/5 px-4 py-1.5 text-xs font-medium text-ink-muted shadow-soft"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Yangi to'plam — O'zbek mumtoz kuylari
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-balance text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-ink leading-[1.02]"
        >
          Notalar. <br />
          <span className="bg-gradient-to-b from-ink to-ink-subtle bg-clip-text text-transparent">
            Bir joyda, beg'ubor.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-ink-muted text-balance"
        >
          Klassikadan tortib zamonaviy va o'zbek kuylarigacha — har bir nota mukammal ko'rinishda.
          Tanlang, sotib oling va darhol yuklab oling.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button asChild size="lg" className="min-w-[160px]">
            <Link to="/catalog">
              Katalogga o'tish
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="min-w-[160px]">
            <Link to="/auth/register">Hisob ochish</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-14 grid grid-cols-3 max-w-xl mx-auto gap-6 text-left sm:text-center"
        >
          <div>
            <div className="text-2xl md:text-3xl font-semibold tracking-tight tabular-nums">1200+</div>
            <div className="text-xs text-ink-subtle mt-1">Asarlar</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-semibold tracking-tight tabular-nums">12</div>
            <div className="text-xs text-ink-subtle mt-1">Cholg'u turi</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-semibold tracking-tight tabular-nums">99%</div>
            <div className="text-xs text-ink-subtle mt-1">Mamnun foydalanuvchi</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
