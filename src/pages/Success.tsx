import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useCart } from '@/store/cartStore'

export default function Success() {
  const clear = useCart((s) => s.clear)

  useEffect(() => {
    clear()
  }, [clear])

  return (
    <div className="container py-24 max-w-xl text-center">
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 14, stiffness: 200 }}
        className="mx-auto h-20 w-20 rounded-full bg-gold/15 flex items-center justify-center ring-1 ring-gold/30"
      >
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-gold-deep" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="m8 12 3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
      <div className="mt-7 text-xs uppercase tracking-[0.22em] text-ink-subtle">
        To'lov qabul qilindi
      </div>
      <h1 className="mt-3 font-serif text-5xl md:text-6xl tracking-tight">
        Tashakkur.
      </h1>
      <p className="mt-4 text-ink-muted text-lg text-pretty">
        Buyurtmangiz muvaffaqiyatli rasmiylashtirildi. Sotib olingan notalarni profilingizdan
        yuklab olishingiz mumkin.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link to="/account">Profilimga o'tish</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/catalog">Yana ko'rish</Link>
        </Button>
      </div>
    </div>
  )
}
