import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Loader2, Music, ShoppingBag, User as UserIcon } from 'lucide-react'
import { useMyPurchases, useProfile, useSession } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { formatPriceUZS } from '@/lib/utils'

export default function Account() {
  const { user } = useSession()
  const { data: profile } = useProfile(user)
  const { data: purchases, isLoading } = useMyPurchases(user?.id)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const downloadPdf = async (noteId: string, pdfPath: string) => {
    setError(null)
    setDownloadingId(noteId)
    try {
      const { data, error: e } = await supabase.storage
        .from('pdfs')
        .createSignedUrl(pdfPath, 60 * 60)
      if (e || !data?.signedUrl) throw e ?? new Error('Yuklab olish havolasi olinmadi')
      window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yuklab olishda xatolik')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="container py-10 md:py-14">
      <div className="flex items-center gap-5">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-white shadow-soft">
          <UserIcon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {profile?.full_name || 'Foydalanuvchi'}
          </h1>
          <p className="text-ink-muted">{user?.email}</p>
        </div>
      </div>

      <section className="mt-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Sotib olingan notalar</h2>
            <p className="text-ink-muted text-sm mt-1">
              Notalar PDF formatda yuklab olinadi. Havolalar 1 soat ichida amal qiladi.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-ink-subtle" />
          </div>
        ) : !purchases || purchases.length === 0 ? (
          <div className="rounded-3xl bg-white ring-1 ring-black/5 shadow-soft p-10 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-ink-subtle" />
            <p className="mt-4 text-ink-muted">Sizda hali sotib olingan notalar yo'q.</p>
            <Button asChild className="mt-6">
              <Link to="/catalog">Katalogga o'tish</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {purchases.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="flex items-center gap-4 rounded-3xl bg-white ring-1 ring-black/5 shadow-soft p-4"
              >
                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface-alt">
                  {p.note?.cover_url ? (
                    <img src={p.note.cover_url} alt={p.note.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink-subtle">
                      <Music className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{p.note?.title ?? 'Nota'}</h3>
                  <p className="text-sm text-ink-muted truncate">
                    {p.note?.composer ?? '—'} · {p.note?.instrument ?? ''}
                  </p>
                  <p className="text-xs text-ink-subtle mt-1 tabular-nums">
                    {p.amount_uzs ? formatPriceUZS(p.amount_uzs) : ''} · {' '}
                    {new Date(p.created_at).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
                <Button
                  onClick={() => p.note && downloadPdf(p.note_id, p.note.pdf_path)}
                  disabled={!p.note || downloadingId === p.note_id}
                  variant="secondary"
                >
                  {downloadingId === p.note_id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Yuklab olish
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
      </section>
    </div>
  )
}
