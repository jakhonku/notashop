import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Loader2, Music, ShoppingBag } from 'lucide-react'
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

  const initial = (profile?.full_name || user?.email || '?').charAt(0).toUpperCase()

  return (
    <div className="container py-12 md:py-16">
      <div className="flex items-center gap-5">
        <div className="h-16 w-16 rounded-full bg-ink text-surface-base flex items-center justify-center font-serif text-2xl shadow-soft">
          {initial}
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-ink-subtle">Mening profilim</div>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl tracking-tight">
            {profile?.full_name || "Xush kelibsiz"}
          </h1>
          <p className="text-ink-muted text-sm mt-0.5">{user?.email}</p>
        </div>
      </div>

      <section className="mt-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-ink-subtle">Yig'ilma</div>
            <h2 className="mt-2 font-serif text-3xl tracking-tight">Notalar to'plamim</h2>
            <p className="text-ink-muted text-sm mt-2 max-w-md">
              Sotib olingan barcha asarlar. Yuklab olish havolasi 1 soat davomida amal qiladi —
              keyin yangisini olishingiz mumkin.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-ink-subtle" />
          </div>
        ) : !purchases || purchases.length === 0 ? (
          <div className="rounded-3xl bg-surface ring-1 ring-ink/8 shadow-soft p-12 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-ink-subtle" strokeWidth={1.5} />
            <p className="mt-4 text-ink-muted">
              To'plamingiz bo'sh. Birinchi asaringizni katalogdan tanlang.
            </p>
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
                className="flex items-center gap-4 rounded-2xl bg-surface ring-1 ring-ink/8 shadow-soft p-4"
              >
                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                  {p.note?.cover_url ? (
                    <img src={p.note.cover_url} alt={p.note.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink-subtle">
                      <Music className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg leading-tight truncate">{p.note?.title ?? 'Asar'}</h3>
                  <p className="text-sm italic-serif text-ink-muted truncate">
                    {p.note?.composer ?? '—'} · {p.note?.instrument ?? ''}
                  </p>
                  <p className="text-xs text-ink-subtle mt-1 tabular-nums">
                    {p.amount_uzs ? formatPriceUZS(p.amount_uzs) : ''} ·{' '}
                    {new Date(p.created_at).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
                <Button
                  onClick={() => p.note && downloadPdf(p.note_id, p.note.pdf_path)}
                  disabled={!p.note || downloadingId === p.note_id}
                  variant="outline"
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

        {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}
      </section>
    </div>
  )
}
