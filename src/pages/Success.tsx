import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/store/cartStore'

export default function Success() {
  const clear = useCart((s) => s.clear)

  useEffect(() => {
    clear()
  }, [clear])

  return (
    <div className="container py-20 max-w-lg text-center">
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="mx-auto h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
      </motion.div>
      <h1 className="mt-7 text-4xl md:text-5xl font-semibold tracking-tight">
        Rahmat!
      </h1>
      <p className="mt-3 text-ink-muted text-lg">
        To'lovingiz qabul qilindi. Sotib olingan notalarni profilingizdan yuklab olishingiz mumkin.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild size="lg">
          <Link to="/account">Profilga o'tish</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link to="/catalog">Katalogga qaytish</Link>
        </Button>
      </div>
    </div>
  )
}
