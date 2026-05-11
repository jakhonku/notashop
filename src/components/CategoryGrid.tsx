import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Piano, Guitar, Drum, Mic2, Music2 } from 'lucide-react'

const items = [
  {
    name: 'Klassik',
    desc: 'Mumtoz asarlar va kompozitorlar',
    Icon: Piano,
    tone: 'from-blue-500/10 to-indigo-500/5',
    accent: 'text-blue-600',
  },
  {
    name: 'Zamonaviy',
    desc: 'Zamonaviy aranjirovkalar',
    Icon: Music2,
    tone: 'from-purple-500/10 to-fuchsia-500/5',
    accent: 'text-purple-600',
  },
  {
    name: "O'zbek",
    desc: 'Milliy va xalq kuylari',
    Icon: Drum,
    tone: 'from-emerald-500/10 to-teal-500/5',
    accent: 'text-emerald-600',
  },
  {
    name: 'Jazz',
    desc: 'Jazz standartlari va improvizatsiya',
    Icon: Guitar,
    tone: 'from-amber-500/10 to-orange-500/5',
    accent: 'text-amber-700',
  },
  {
    name: 'Pop',
    desc: 'Hozirgi mashhur hit asarlar',
    Icon: Mic2,
    tone: 'from-rose-500/10 to-pink-500/5',
    accent: 'text-rose-600',
  },
]

export function CategoryGrid() {
  return (
    <section className="container py-16 md:py-20">
      <div className="flex items-end justify-between mb-8 md:mb-10">
        <div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-ink">
            Kategoriyalar bo'yicha
          </h2>
          <p className="mt-2 text-ink-muted">Sizga mos uslubni tanlang.</p>
        </div>
        <Link to="/catalog" className="hidden md:inline text-sm font-medium text-accent hover:underline">
          Barchasini ko'rish →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to={`/catalog?category=${encodeURIComponent(c.name)}`}
              className={`group block rounded-3xl bg-gradient-to-br ${c.tone} ring-1 ring-black/5 p-6 h-full transition-all hover:-translate-y-1 hover:shadow-lift`}
            >
              <c.Icon className={`h-8 w-8 ${c.accent}`} />
              <h3 className="mt-6 text-lg font-semibold tracking-tight">{c.name}</h3>
              <p className="mt-1 text-sm text-ink-muted">{c.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
