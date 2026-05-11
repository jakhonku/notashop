import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container py-24 text-center">
      <p className="text-sm font-semibold text-accent tracking-wider uppercase">404</p>
      <h1 className="mt-3 text-5xl md:text-6xl font-semibold tracking-tight">Sahifa topilmadi</h1>
      <p className="mt-4 text-ink-muted">Bu sahifa mavjud emas yoki o'chirilgan.</p>
      <Button asChild className="mt-7">
        <Link to="/">Bosh sahifaga</Link>
      </Button>
    </div>
  )
}
