// @ts-nocheck
// Supabase Edge Function — Stripe webhook
// Stripe konsoliga URL: https://<project-ref>.functions.supabase.co/stripe-webhook
// Event: checkout.session.completed -> purchases jadvaliga yozadi.

import Stripe from 'https://esm.sh/stripe@14.21.0?target=denonext'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false } },
)

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'invalid'
    return new Response(`Webhook Error: ${msg}`, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const noteIds = (session.metadata?.note_ids ?? '').split(',').filter(Boolean)

      if (userId && noteIds.length > 0) {
        const { data: notes } = await supabaseAdmin
          .from('notes')
          .select('id, price_uzs')
          .in('id', noteIds)

        const rows = (notes ?? []).map((n) => ({
          user_id: userId,
          note_id: n.id,
          stripe_session_id: session.id,
          amount_uzs: n.price_uzs,
        }))

        if (rows.length > 0) {
          const { error } = await supabaseAdmin
            .from('purchases')
            .upsert(rows, { onConflict: 'user_id,note_id', ignoreDuplicates: true })
          if (error) throw error
        }
      }
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'webhook handler error'
    return new Response(`Webhook handler error: ${msg}`, { status: 500 })
  }
})
