import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Music } from 'lucide-react'
import type { Note } from '@/types'
import { cn, difficultyTone, formatPriceUZS } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

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
        duration: 0.45,
        delay: Math.min(index * 0.04, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn('group', className)}
    >
      <Link to={`/note/${note.id}`} className="block">
        <div className="rounded-3xl bg-white ring-1 ring-black/5 shadow-soft overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
          <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-surface-alt to-white">
            {note.cover_url ? (
              <img
                src={note.cover_url}
                alt={note.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink-subtle">
                <Music className="h-12 w-12" />
              </div>
            )}
            <div className="absolute top-3 left-3 flex gap-1.5">
              <Badge className={difficultyTone(note.difficulty)}>{note.difficulty}</Badge>
            </div>
          </div>
          <div className="p-4">
            <div className="text-xs text-ink-subtle mb-1">{note.instrument} · {note.category}</div>
            <h3 className="font-semibold text-ink tracking-tight line-clamp-2 leading-snug">
              {note.title}
            </h3>
            {note.composer && (
              <p className="mt-1 text-sm text-ink-muted line-clamp-1">{note.composer}</p>
            )}
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-base font-semibold text-ink tabular-nums">
                {formatPriceUZS(note.price_uzs)}
              </span>
              <span className="text-xs text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Batafsil →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
