import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

type CartState = {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (id: string) => void
  clear: () => void
  total: () => number
  has: (id: string) => boolean
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        if (get().items.some((i) => i.id === item.id)) return
        set({ items: [...get().items, item] })
      },
      remove: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      clear: () => set({ items: [] }),
      total: () =>
        get().items.reduce((acc, i) => acc + i.price_uzs, 0),
      has: (id) => get().items.some((i) => i.id === id),
    }),
    {
      name: 'notashop-cart-v1',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
