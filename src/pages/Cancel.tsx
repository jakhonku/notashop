import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function Cancel() {
  return (
    <div className="container py-24 max-w-xl text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 16, stiffness: 200 }}
        className="mx-auto h-20 w-20 rounded-full bg-surface ring-1 ring-ink/10 flex items-center justify-center"
      >
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-ink-muted" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="m9 9 6 6m0-6-6 6" strokeLinecap="round" />
        </svg>
      </motion.div>
      <div className="mt-7 text-xs uppercase tracking-[0.22em] text-ink-subtle">Status</div>
      <h1 className="mt-3 font-serif text-5xl md:text-6xl tracking-tight">
        To'lov to'xtatildi
      </h1>
      <p className="mt-4 text-ink-muted text-lg text-pretty">
        Sizdan hech qanday mablag' yechib olinmadi. Xohlasangiz savatchaga qaytib qaytadan urinib ko'ring.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link to="/cart">Savatchaga qaytish</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/">Bosh sahifa</Link>
        </Button>
      </div>
    </div>
  )
}
