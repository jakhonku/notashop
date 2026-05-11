# NotaShop — Notalar bozori

Sifatli musiqa notalarini sotuvchi to'liq tayyor zamonaviy do'kon. Apple uslubidagi minimalistik dizayn, xavfsiz to'lov va PDF formatda yuklab olish imkoniyati bilan.

## Texnologiyalar

- **React 18 + Vite + TypeScript (strict)**
- **Tailwind CSS** + maxsus Apple uslubidagi komponentlar
- **Supabase** — autentifikatsiya, Postgres, Storage
- **Stripe Checkout** (test rejimida) + Supabase Edge Function webhook
- **React Router v6**, **TanStack Query**, **Zustand**, **React Hook Form + Zod**

## Tezkor boshlash

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. .env faylini yaratish
cp .env.example .env
# .env ichida VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY va VITE_STRIPE_PUBLISHABLE_KEY ni to'ldiring

# 3. Dasturni ishga tushirish
npm run dev
```

Dastur `http://localhost:5173` manzilida ochiladi.

## Supabase sozlash

### 1. Loyiha yaratish

[https://supabase.com](https://supabase.com) saytida yangi loyiha yarating. Loyiha sozlamalaridan quyidagilarni oling va `.env` ga joylashtiring:

- `VITE_SUPABASE_URL` — Project URL
- `VITE_SUPABASE_ANON_KEY` — `anon` `public` kaliti

### 2. Migratsiyalarni qo'llash

Supabase CLI orqali (tavsiya etiladi):

```bash
# CLI ni o'rnating: https://supabase.com/docs/guides/cli
supabase login
supabase link --project-ref <loyiha-ref-kodi>
supabase db push
```

Yoki Supabase Dashboard'dagi **SQL Editor**'ga `supabase/migrations/001_init.sql` faylining mazmunini joylashtirib, **Run** tugmasini bosing.

### 3. Dastlabki ma'lumotlar bilan to'ldirish (ixtiyoriy)

Demo notalar qo'shish uchun **SQL Editor**'da `supabase/seed.sql` faylini ishga tushiring.

### 4. Storage buketlari

Migratsiya `covers` (ommaviy) va `pdfs` (yopiq) buketlarini avtomatik yaratadi. Agar siz qo'lda yaratayotgan bo'lsangiz:

- `covers` — **Public**
- `pdfs` — **Private** (faqat signed URL orqali)

### 5. Admin foydalanuvchini yaratish

Birinchi foydalanuvchi sifatida ro'yxatdan o'ting, so'ng SQL Editor'da rolni o'zgartiring:

```sql
update profiles
set role = 'admin'
where email = 'siz@example.com';
```

Endi `/admin` sahifasi sizga ochiq bo'ladi va u yerdan yangi notalar qo'shishingiz mumkin.

## Stripe sozlash

### 1. Test kalitlarini olish

[https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys) saytidan:

- **Publishable key** ni `.env` dagi `VITE_STRIPE_PUBLISHABLE_KEY` ga joylashtiring
- **Secret key** ni quyidagi Edge Function sozlamasiga qo'shing

### 2. Edge Function'larni deploy qilish

```bash
# Maxfiy kalitlarni sozlash
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
supabase secrets set SITE_URL=http://localhost:5173

# Funksiyalarni deploy qilish
supabase functions deploy create-checkout --no-verify-jwt
supabase functions deploy stripe-webhook --no-verify-jwt
```

> **Eslatma:** `--no-verify-jwt` faqat webhook va checkout endpoint'lari uchun zarur, chunki Stripe so'rovlari JWT bilan kelmaydi.

### 3. Stripe webhook'ni ulash

[https://dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks):

1. **Add endpoint** tugmasini bosing.
2. **Endpoint URL**: `https://<loyiha-ref-kodi>.functions.supabase.co/stripe-webhook`
3. **Listen to**: `checkout.session.completed`
4. Yaratilgandan keyin **Signing secret** ni nusxalang va Supabase ga qo'shing:

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

So'ngra webhook funksiyasini qayta deploy qiling:

```bash
supabase functions deploy stripe-webhook --no-verify-jwt
```

### 4. Test to'lovlari

Stripe test rejimida quyidagi karta raqamlaridan foydalanishingiz mumkin:

- Muvaffaqiyatli: `4242 4242 4242 4242`
- Rad etilgan: `4000 0000 0000 0002`

CVC va amal qilish muddati uchun istalgan kelajakdagi sana va uch xonali kod kifoya.

## Loyiha tuzilmasi

```
src/
  components/           # UI va umumiy komponentlar
    ui/                 # shadcn primitivlari (Button, Card, Input ...)
    Navbar.tsx
    Footer.tsx
    Hero.tsx
    NoteCard.tsx
    CategoryGrid.tsx
    ProtectedRoute.tsx
  lib/
    supabase.ts         # Supabase client
    queries.ts          # TanStack Query hook'lari
    utils.ts            # cn(), formatPriceUZS(), tonal'lar
  pages/                # Marshrutlar
    Home.tsx
    Catalog.tsx
    NoteDetail.tsx
    Cart.tsx
    Account.tsx
    Admin.tsx
    Login.tsx
    Register.tsx
    Success.tsx
    Cancel.tsx
    NotFound.tsx
  store/
    cartStore.ts        # Zustand + localStorage persist
  types/
    index.ts            # Note, Profile, Purchase, CartItem
supabase/
  migrations/001_init.sql
  seed.sql
  functions/
    create-checkout/index.ts
    stripe-webhook/index.ts
```

## Skriptlar

- `npm run dev` — ishlab chiqish serveri
- `npm run build` — `tsc` + `vite build`
- `npm run preview` — qurilgan versiyani lokal sinab ko'rish

## Foydalanish

1. **Bosh sahifa (`/`)** — Hero, tanlangan asarlar va kategoriyalar
2. **Katalog (`/catalog`)** — qidiruv, filtrlar (kategoriya, cholg'u, daraja, narx)
3. **Nota sahifasi (`/note/:id`)** — to'liq tavsif, oldindan ko'rish, sotib olish
4. **Savatcha (`/cart`)** — Stripe orqali to'lovga o'tish
5. **Profil (`/account`)** — sotib olingan notalarni yuklab olish (1 soatlik signed URL)
6. **Admin (`/admin`)** — yangi nota qo'shish (faqat `role='admin'`)

## Litsenziya

Loyiha demonstratsion maqsadda yaratilgan. Ishlatishdan oldin xavfsizlik, narx va litsenziya talablarini ko'rib chiqing.
