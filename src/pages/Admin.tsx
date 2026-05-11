import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useNotes } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { CATEGORIES, DIFFICULTIES, INSTRUMENTS, cn, difficultyTone, formatPriceUZS } from '@/lib/utils'
import { PendingOrdersPanel } from '@/components/PendingOrdersPanel'
import type { Difficulty } from '@/types'

const schema = z.object({
  title: z.string().min(2, "Sarlavha kamida 2 ta belgi bo'lsin"),
  composer: z.string().optional(),
  description: z.string().optional(),
  category: z.enum(CATEGORIES),
  instrument: z.enum(INSTRUMENTS),
  difficulty: z.enum(DIFFICULTIES),
  price_uzs: z.coerce.number().int().nonnegative("Narx 0 dan kichik bo'lmasin"),
})

type FormValues = z.infer<typeof schema>

export default function Admin() {
  const { data: notes, isLoading, refetch } = useNotes()
  const qc = useQueryClient()
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      composer: '',
      description: '',
      category: 'Klassik',
      instrument: 'Pianino',
      difficulty: "Boshlang'ich" as Difficulty,
      price_uzs: 50000,
    },
  })

  const onSubmit = async (values: FormValues) => {
    setError(null)
    setSuccess(null)
    if (!pdfFile) {
      setError("PDF fayl yuklash majburiy")
      return
    }
    setSubmitting(true)
    try {
      const stamp = Date.now()
      const safeName = values.title.replace(/[^a-z0-9-_]+/gi, '-').toLowerCase()

      const pdfPath = `${stamp}-${safeName}.pdf`
      const { error: pdfErr } = await supabase.storage
        .from('pdfs')
        .upload(pdfPath, pdfFile, { contentType: 'application/pdf' })
      if (pdfErr) throw pdfErr

      let coverUrl: string | null = null
      if (coverFile) {
        const ext = coverFile.name.split('.').pop() ?? 'jpg'
        const coverPath = `${stamp}-${safeName}.${ext}`
        const { error: coverErr } = await supabase.storage
          .from('covers')
          .upload(coverPath, coverFile, { contentType: coverFile.type })
        if (coverErr) throw coverErr
        const { data: pub } = supabase.storage.from('covers').getPublicUrl(coverPath)
        coverUrl = pub.publicUrl
      }

      const { error: insertErr } = await supabase.from('notes').insert({
        title: values.title,
        composer: values.composer || null,
        description: values.description || null,
        category: values.category,
        instrument: values.instrument,
        difficulty: values.difficulty,
        price_uzs: values.price_uzs,
        pdf_path: pdfPath,
        cover_url: coverUrl,
      })
      if (insertErr) throw insertErr

      setSuccess("Asar muvaffaqiyatli qo'shildi")
      form.reset()
      setCoverFile(null)
      setPdfFile(null)
      await qc.invalidateQueries({ queryKey: ['notes'] })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yuklashda xatolik')
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm("Asarni o'chirishni tasdiqlaysizmi?")) return
    const { error: e } = await supabase.from('notes').delete().eq('id', id)
    if (e) {
      setError(e.message)
      return
    }
    await refetch()
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="text-xs uppercase tracking-[0.22em] text-ink-subtle">Boshqaruv</div>
      <h1 className="mt-2 font-serif text-5xl md:text-6xl tracking-tight">Admin paneli</h1>
      <p className="mt-3 text-ink-muted">
        Asarlarni qo'shish, tahrirlash va o'chirish.
      </p>

      <section className="mt-12 rounded-3xl bg-surface ring-1 ring-ink/8 shadow-soft p-6">
        <div className="text-xs uppercase tracking-[0.22em] text-ink-subtle">Buyurtmalar</div>
        <h2 className="mt-2 font-serif text-3xl tracking-tight mb-6">
          To'lov tasdig'i
        </h2>
        <PendingOrdersPanel />
      </section>

      <div className="mt-12 grid lg:grid-cols-[420px_1fr] gap-10">
        <section className="rounded-3xl bg-surface ring-1 ring-ink/8 shadow-soft p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl flex items-center gap-2 tracking-tight">
            <Plus className="h-5 w-5 text-gold-deep" />
            Yangi asar
          </h2>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <div>
              <Label htmlFor="title">Sarlavha</Label>
              <Input id="title" className="mt-1.5" {...form.register('title')} />
              {form.formState.errors.title && (
                <p className="mt-1 text-xs text-rose-700">{form.formState.errors.title.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="composer">Muallif</Label>
              <Input id="composer" className="mt-1.5" {...form.register('composer')} />
            </div>
            <div>
              <Label htmlFor="description">Tavsif</Label>
              <Textarea id="description" className="mt-1.5" {...form.register('description')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Bo'lim</Label>
                <Select className="mt-1.5" {...form.register('category')}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Cholg'u</Label>
                <Select className="mt-1.5" {...form.register('instrument')}>
                  {INSTRUMENTS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Daraja</Label>
                <Select className="mt-1.5" {...form.register('difficulty')}>
                  {DIFFICULTIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Narx (so'm)</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  className="mt-1.5"
                  {...form.register('price_uzs')}
                />
              </div>
            </div>

            <div>
              <Label>Muqova rasmi</Label>
              <Input
                type="file"
                accept="image/*"
                className="mt-1.5 file:mr-3 file:rounded-full file:border-0 file:bg-surface-alt file:px-3 file:py-1.5 file:text-xs file:font-medium"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div>
              <Label>PDF fayl <span className="text-rose-700">*</span></Label>
              <Input
                type="file"
                accept="application/pdf"
                className="mt-1.5 file:mr-3 file:rounded-full file:border-0 file:bg-surface-alt file:px-3 file:py-1.5 file:text-xs file:font-medium"
                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
              />
            </div>

            {error && <p className="text-sm text-rose-700">{error}</p>}
            {success && <p className="text-sm text-emerald-700">{success}</p>}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {submitting ? 'Yuklanmoqda...' : "Qo'shish"}
            </Button>
          </form>
        </section>

        <section>
          <h2 className="font-serif text-2xl tracking-tight mb-5">
            Mavjud asarlar ({notes?.length ?? 0})
          </h2>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-ink-subtle" />
            </div>
          ) : (
            <div className="space-y-2">
              {notes?.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center gap-4 rounded-2xl bg-surface ring-1 ring-ink/8 p-3"
                >
                  <div className="h-14 w-12 shrink-0 rounded-lg bg-surface-alt overflow-hidden">
                    {n.cover_url && (
                      <img src={n.cover_url} alt={n.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg leading-tight truncate">{n.title}</h3>
                    <p className="text-sm text-ink-muted truncate">
                      {n.composer ?? '—'} · {n.instrument} · {n.category}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'hidden sm:inline-flex items-center rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] font-medium ring-1 ring-inset',
                      difficultyTone(n.difficulty),
                    )}
                  >
                    {n.difficulty}
                  </span>
                  <span className="hidden sm:block text-sm font-medium tabular-nums">
                    {formatPriceUZS(n.price_uzs)}
                  </span>
                  <button
                    onClick={() => remove(n.id)}
                    className="rounded-full p-2 text-ink-subtle hover:text-rose-700 hover:bg-rose-50"
                    aria-label="O'chirish"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
