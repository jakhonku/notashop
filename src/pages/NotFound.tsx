import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container py-28 text-center">
      <div className="font-serif text-[10rem] leading-none italic-serif text-ink/15 select-none">
        404
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.22em] text-ink-subtle">
        Sahifa topilmadi
      </div>
      <h1 className="mt-4 font-serif text-5xl md:text-6xl tracking-tight">
        Bu sahifa <span className="italic-serif">mavjud emas.</span>
      </h1>
      <p className="mt-4 text-ink-muted">
        Havola noto'g'ri yoki sahifa o'chirilgan bo'lishi mumkin.
      </p>
      <Button asChild className="mt-8">
        <Link to="/">Bosh sahifaga</Link>
      </Button>
    </div>
  )
}
