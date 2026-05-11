import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const items = [
  {
    name: 'Klassik',
    label: 'I',
    desc: 'Bax, Mozart, Shopen va boshqa mumtoz bastakorlar.',
    tone: 'bg-[#1f3a5f] text-white',
  },
  {
    name: 'Zamonaviy',
    label: 'II',
    desc: 'XX–XXI asr bastakorlari va aranjirovkalari.',
    tone: 'bg-[#2c2925] text-white',
  },
  {
    name: "O'zbek",
    label: 'III',
    desc: "Milliy mumtoz kuylar va xalq qo'shiqlari.",
    tone: 'bg-[#a8624b] text-white',
  },
  {
    name: 'Jazz',
    label: 'IV',
    desc: 'Jazz standartlari, blues va improvizatsiya.',
    tone: 'bg-[#7d5a2b] text-white',
  },
  {
    name: 'Pop',
    label: 'V',
    desc: 'Bugungi mashhur kompozitsiyalar va xitlar.',
    tone: 'bg-[#594066] text-white',
  },
]

export function CategoryGrid() {
  return (
    <section className="container py-20 md:py-28">
      <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16 items-end mb-12">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-ink-subtle">
            Bo'limlar
          </div>
          <h2 className="mt-3 font-serif text-4xl md:text-6xl leading-[1.02] tracking-tight text-ink text-balance">
            Beshta yo'nalish, <br />
            <span className="italic-serif text-accent">bir tanlov.</span>
          </h2>
        </div>
        <p className="text-ink-muted text-lg max-w-lg text-pretty">
          Har bir bo'limda yetakchi bastakorlar va xalq durdonalari jamlangan. O'zingizga
          yoqqan yo'nalishni tanlang va kashfiyotni boshlang.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className={i === 0 ? 'lg:row-span-2' : i === 4 ? 'md:col-span-2 lg:col-span-1' : ''}
          >
            <Link
              to={`/catalog?category=${encodeURIComponent(c.name)}`}
              className={`group relative block overflow-hidden rounded-3xl ${c.tone} p-7 md:p-9 h-full min-h-[220px] transition-all hover:-translate-y-0.5 hover:shadow-lift`}
            >
              <div className="absolute inset-0 opacity-[0.06] mix-blend-screen pointer-events-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, currentColor 0, currentColor 1px, transparent 1px, transparent 8px)',
                }}
              />
              <div className="relative flex flex-col h-full justify-between gap-12">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-serif text-2xl opacity-50">{c.label}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] opacity-60">
                    {i === 0 ? 'Tavsiya' : ''}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight">
                    {c.name}
                  </h3>
                  <p className="mt-2 text-sm opacity-75 max-w-[36ch]">{c.desc}</p>
                  <div className="mt-5 text-xs uppercase tracking-[0.18em] opacity-80 flex items-center gap-1">
                    <span>Ko'rish</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
