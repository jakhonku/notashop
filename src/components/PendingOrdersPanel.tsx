import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Check, Loader2, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePendingOrders } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { formatPriceUZS, cn } from '@/lib/utils'
import type { PendingOrder } from '@/types'

function statusTone(s: PendingOrder['status']) {
  switch (s) {
    case 'pending':
      return 'bg-amber-50 text-amber-800 ring-amber-200/60'
    case 'paid':
      return 'bg-emerald-50 text-emerald-800 ring-emerald-200/60'
    case 'cancelled':
      return 'bg-rose-50 text-rose-800 ring-rose-200/60'
  }
}

const statusLabel: Record<PendingOrder['status'], string> = {
  pending: 'Kutilmoqda',
  paid: 'Tasdiqlangan',
  cancelled: 'Bekor qilingan',
}

export function PendingOrdersPanel() {
  const { data: orders, isLoading } = usePendingOrders()
  const qc = useQueryClient()
  const [actingId, setActingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const confirm = async (id: string) => {
    setError(null)
    if (!window.confirm("Pul kelganini tekshirdingizmi? Tasdiqlash mijozga PDF kirishi beradi.")) {
      return
    }
    setActingId(id)
    const { error: e } = await supabase.rpc('confirm_pending_order', { order_id: id })
    if (e) {
      setError(e.message)
    } else {
      await qc.invalidateQueries({ queryKey: ['pending-orders'] })
    }
    setActingId(null)
  }

  const cancel = async (id: string) => {
    if (!window.confirm("Buyurtmani bekor qilish?")) return
    setActingId(id)
    const { error: e } = await supabase
      .from('pending_orders')
      .update({ status: 'cancelled' })
      .eq('id', id)
    if (e) {
      setError(e.message)
    } else {
      await qc.invalidateQueries({ queryKey: ['pending-orders'] })
    }
    setActingId(null)
  }

  const pending = (orders ?? []).filter((o) => o.status === 'pending')
  const past = (orders ?? []).filter((o) => o.status !== 'pending')

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-ink-subtle" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl bg-rose-50 text-rose-800 ring-1 ring-rose-200/60 p-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-xl tracking-tight">
            Kutilayotgan buyurtmalar
            {pending.length > 0 && (
              <span className="ml-2 text-sm text-gold-deep tabular-nums">({pending.length})</span>
            )}
          </h3>
        </div>
        {pending.length === 0 ? (
          <p className="text-sm text-ink-subtle italic-serif">Hozircha kutilayotgan buyurtma yo'q.</p>
        ) : (
          <div className="space-y-2">
            {pending.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                acting={actingId === o.id}
                onConfirm={() => confirm(o.id)}
                onCancel={() => cancel(o.id)}
              />
            ))}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div>
          <h3 className="font-serif text-xl tracking-tight mb-3">Tarix</h3>
          <div className="space-y-2">
            {past.slice(0, 10).map((o) => (
              <div
                key={o.id}
                className="rounded-2xl bg-surface ring-1 ring-ink/8 p-4 flex items-center justify-between gap-3 text-sm"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{o.user_name ?? o.user_email ?? '—'}</span>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ring-1 ring-inset',
                        statusTone(o.status),
                      )}
                    >
                      {statusLabel[o.status]}
                    </span>
                  </div>
                  <div className="text-xs text-ink-subtle mt-1">
                    {new Date(o.created_at).toLocaleString('uz-UZ')} · {o.note_ids.length} ta nota
                  </div>
                </div>
                <div className="text-right tabular-nums shrink-0">
                  {formatPriceUZS(o.total_uzs)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function OrderCard({
  order,
  acting,
  onConfirm,
  onCancel,
}: {
  order: PendingOrder
  acting: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="rounded-2xl bg-surface ring-1 ring-ink/8 shadow-soft p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-serif text-lg leading-tight truncate">
              {order.user_name ?? order.user_email ?? "Noma'lum mijoz"}
            </span>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ring-1 ring-inset',
                statusTone(order.status),
              )}
            >
              {statusLabel[order.status]}
            </span>
          </div>
          {order.user_email && order.user_name && (
            <div className="text-xs text-ink-subtle mt-0.5">{order.user_email}</div>
          )}
          <a
            href={`tel:${order.customer_phone}`}
            className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
          >
            <Phone className="h-3.5 w-3.5" />
            <span className="tabular-nums">{order.customer_phone}</span>
          </a>
          <div className="mt-2 text-xs text-ink-subtle">
            {order.note_ids.length} ta nota · {new Date(order.created_at).toLocaleString('uz-UZ')}
          </div>
        </div>
        <div className="text-right">
          <div className="font-serif text-2xl tabular-nums">{formatPriceUZS(order.total_uzs)}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          onClick={onConfirm}
          disabled={acting}
          variant="accent"
          size="sm"
        >
          {acting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Tasdiqlash
        </Button>
        <Button onClick={onCancel} disabled={acting} variant="ghost" size="sm">
          <X className="h-4 w-4" />
          Bekor qilish
        </Button>
      </div>
    </div>
  )
}
