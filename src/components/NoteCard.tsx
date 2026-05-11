import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Music } from 'lucide-react'
import type { Note } from '@/types'
import { cn, difficultyTone, formatPriceUZS } from '@/lib/utils'

type Props = {
  note: Note
  index?: number
  className?: string
}

export function NoteCard({ note, index = 0, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.04, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn('group', className)}
    >
      <Link to={`/note/${note.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-surface ring-1 ring-ink/8 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
          <div className="aspect-[3/4] relative overflow-hidden bg-surface-alt">
            {note.cover_url ? (
              <img
                src={note.cover_url}
                alt={note.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink-subtle">
                <Music className="h-12 w-12" strokeWidth={1.25} />
              </div>
            )}
            <div className="absolute top-3 left-3">
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full bg-surface/90 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] font-medium ring-1 ring-inset',
                  difficultyTone(note.difficulty),
                )}
              >
                {note.difficulty}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-surface/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-ink/70 backdrop-blur px-2 py-1 rounded">
                Opus N° {note.id.slice(0, 4).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="p-4 pt-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-ink-subtle">
              {note.instrument} · {note.category}
            </div>
            <h3 className="mt-2 font-serif text-xl leading-tight text-ink line-clamp-2">
              {note.title}
            </h3>
            {note.composer && (
              <p className="mt-1 text-sm italic-serif text-ink-muted line-clamp-1">
                {note.composer}
              </p>
            )}
            <div className="mt-3 pt-3 border-t border-ink/8 flex items-baseline justify-between">
              <span className="text-base font-medium text-ink tabular-nums">
                {formatPriceUZS(note.price_uzs)}
              </span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Batafsil
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
