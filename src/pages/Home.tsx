import { Link } from 'react-router-dom'
import { Hero } from '@/components/Hero'
import { CategoryGrid } from '@/components/CategoryGrid'
import { NoteCard } from '@/components/NoteCard'
import { useNotes } from '@/lib/queries'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const { data: notes, isLoading } = useNotes()
  const featured = (notes ?? []).slice(0, 8)

  return (
    <>
      <Hero />

      <section className="container py-16 md:py-20">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-ink">
              Tanlangan asarlar
            </h2>
            <p className="mt-2 text-ink-muted">Eng so'nggi va eng mashhur notalar.</p>
          </div>
          <Link to="/catalog" className="hidden md:inline text-sm font-medium text-accent hover:underline">
            Barchasini ko'rish →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-ink-subtle" />
          </div>
        ) : featured.length === 0 ? (
          <div className="rounded-3xl bg-white ring-1 ring-black/5 p-12 text-center">
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

      <section className="container py-16 md:py-20">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-ink to-[#2a2a2c] text-white p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl pointer-events-none" />
          <div className="relative max-w-2xl">
            <h3 className="text-3xl md:text-5xl font-semibold tracking-tight text-balance">
              Ijroni shu yerdan boshlang.
            </h3>
            <p className="mt-4 text-white/70 text-lg">
              Hisob oching va minglab notalardan birini darhol yuklab oling.
            </p>
            <div className="mt-7 flex gap-3">
              <Link
                to="/auth/register"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white text-ink px-7 text-sm font-medium hover:bg-white/90 transition-colors"
              >
                Hisob ochish
              </Link>
              <Link
                to="/catalog"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white/10 text-white px-7 text-sm font-medium hover:bg-white/20 transition-colors"
              >
                Katalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
