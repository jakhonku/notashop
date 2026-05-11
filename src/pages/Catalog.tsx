import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { NoteCard } from '@/components/NoteCard'
import { useNotes } from '@/lib/queries'
import { CATEGORIES, DIFFICULTIES, INSTRUMENTS } from '@/lib/utils'
import type { Difficulty } from '@/types'

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const { data: notes, isLoading } = useNotes()

  const [search, setSearch] = useState(params.get('q') ?? '')
  const [category, setCategory] = useState(params.get('category') ?? '')
  const [instrument, setInstrument] = useState(params.get('instrument') ?? '')
  const [difficulty, setDifficulty] = useState<Difficulty | ''>(
    (params.get('difficulty') as Difficulty) ?? '',
  )
  const [minPrice, setMinPrice] = useState(params.get('min') ?? '')
  const [maxPrice, setMaxPrice] = useState(params.get('max') ?? '')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    const p = new URLSearchParams()
    if (search) p.set('q', search)
    if (category) p.set('category', category)
    if (instrument) p.set('instrument', instrument)
    if (difficulty) p.set('difficulty', difficulty)
    if (minPrice) p.set('min', minPrice)
    if (maxPrice) p.set('max', maxPrice)
    setParams(p, { replace: true })
  }, [search, category, instrument, difficulty, minPrice, maxPrice, setParams])

  const filtered = useMemo(() => {
    let result = notes ?? []
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          (n.composer?.toLowerCase().includes(q) ?? false),
      )
    }
    if (category) result = result.filter((n) => n.category === category)
    if (instrument) result = result.filter((n) => n.instrument === instrument)
    if (difficulty) result = result.filter((n) => n.difficulty === difficulty)
    if (minPrice) result = result.filter((n) => n.price_uzs >= Number(minPrice))
    if (maxPrice) result = result.filter((n) => n.price_uzs <= Number(maxPrice))
    return result
  }, [notes, search, category, instrument, difficulty, minPrice, maxPrice])

  const reset = () => {
    setSearch('')
    setCategory('')
    setInstrument('')
    setDifficulty('')
    setMinPrice('')
    setMaxPrice('')
  }

  const hasFilter =
    !!search || !!category || !!instrument || !!difficulty || !!minPrice || !!maxPrice

  const FiltersPanel = (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
          Kategoriya
        </label>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2">
          <option value="">Barchasi</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
          Cholg'u
        </label>
        <Select
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
          className="mt-2"
        >
          <option value="">Barchasi</option>
          {INSTRUMENTS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
          Darajasi
        </label>
        <Select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty | '')}
          className="mt-2"
        >
          <option value="">Barchasi</option>
          {DIFFICULTIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
          Narx oralig'i (so'm)
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Input
            placeholder="dan"
            inputMode="numeric"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ''))}
          />
          <Input
            placeholder="gacha"
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ''))}
          />
        </div>
      </div>

      {hasFilter && (
        <Button onClick={reset} variant="secondary" className="w-full">
          Filtrlarni tozalash
        </Button>
      )}
    </div>
  )

  return (
    <div className="container py-10 md:py-14">
      <div className="mb-8">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-ink">Katalog</h1>
        <p className="mt-2 text-ink-muted">
          {isLoading
            ? 'Yuklanmoqda...'
            : `${filtered.length} ta nota topildi`}
        </p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl bg-white ring-1 ring-black/5 shadow-soft p-6">
            <h2 className="font-semibold mb-5 text-ink">Filtrlar</h2>
            {FiltersPanel}
          </div>
        </aside>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle pointer-events-none" />
              <Input
                placeholder="Asar yoki muallifni qidiring..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11"
              />
            </div>
            <Button
              variant="secondary"
              className="lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtr
            </Button>
          </div>

          {isLoading ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-ink-subtle" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl bg-white ring-1 ring-black/5 p-12 text-center">
              <p className="text-ink-muted">Hech narsa topilmadi. Filtrlarni o'zgartiring.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((n, i) => (
                <NoteCard key={n.id} note={n} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileFiltersOpen(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Filtrlar</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-full p-1.5 hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {FiltersPanel}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
