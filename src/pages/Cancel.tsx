import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Cancel() {
  return (
    <div className="container py-20 max-w-lg text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 200 }}
        className="mx-auto h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center"
      >
        <XCircle className="h-10 w-10 text-rose-600" />
      </motion.div>
      <h1 className="mt-7 text-4xl md:text-5xl font-semibold tracking-tight">
        To'lov bekor qilindi
      </h1>
      <p className="mt-3 text-ink-muted text-lg">
        Sizdan hech qanday mablag' yechilmadi. Xohlasangiz qaytadan urinib ko'rishingiz mumkin.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild size="lg">
          <Link to="/cart">Savatchaga qaytish</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link to="/">Bosh sahifaga</Link>
        </Button>
      </div>
    </div>
  )
}
