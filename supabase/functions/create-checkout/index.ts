// @ts-nocheck
// Supabase Edge Function — Stripe Checkout session yaratish
// Endpoint: POST { noteIds: string[], userId: string, successUrl?: string, cancelUrl?: string }
// Mahsulot: Stripe Checkout sessiya URL'ini qaytaradi.

import Stripe from 'https://esm.sh/stripe@14.21.0?target=denonext'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false } },
)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const noteIds: string[] = body?.noteIds ?? []
    const userId: string = body?.userId
    const successUrl: string = body?.successUrl ?? `${Deno.env.get('SITE_URL') ?? ''}/success`
    const cancelUrl: string = body?.cancelUrl ?? `${Deno.env.get('SITE_URL') ?? ''}/cancel`

    if (!userId || !noteIds || noteIds.length === 0) {
      return new Response(JSON.stringify({ error: 'noteIds va userId majburiy' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: notes, error } = await supabaseAdmin
      .from('notes')
      .select('id, title, price_uzs, cover_url')
      .in('id', noteIds)
    if (error) throw error
    if (!notes || notes.length === 0) {
      return new Response(JSON.stringify({ error: 'Notalar topilmadi' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const line_items = notes.map((n) => ({
      quantity: 1,
      price_data: {
        currency: 'uzs',
        unit_amount: n.price_uzs,
        product_data: {
          name: n.title,
          images: n.cover_url ? [n.cover_url] : undefined,
        },
      },
    }))

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
        note_ids: noteIds.join(','),
      },
    })

    return new Response(JSON.stringify({ url: session.url, id: session.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Noma\'lum xatolik'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
