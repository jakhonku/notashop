export type Difficulty = "Boshlang'ich" | "O'rta" | "Yuqori"

export type Note = {
  id: string
  title: string
  composer: string | null
  description: string | null
  category: string
  instrument: string
  difficulty: Difficulty
  price_uzs: number
  cover_url: string | null
  pdf_path: string
  preview_url: string | null
  created_at: string
}

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  role: 'user' | 'admin'
  created_at: string
}

export type Purchase = {
  id: string
  user_id: string
  note_id: string
  stripe_session_id: string | null
  amount_uzs: number | null
  created_at: string
  note?: Note
}

export type CartItem = {
  id: string
  title: string
  price_uzs: number
  cover_url: string | null
}

export type PendingOrder = {
  id: string
  user_id: string
  user_email: string | null
  user_name: string | null
  customer_phone: string
  note_ids: string[]
  total_uzs: number
  status: 'pending' | 'paid' | 'cancelled'
  admin_note: string | null
  created_at: string
  confirmed_at: string | null
}

export type CatalogFilters = {
  search: string
  category: string | null
  instrument: string | null
  difficulty: Difficulty | null
  minPrice: number | null
  maxPrice: number | null
}
