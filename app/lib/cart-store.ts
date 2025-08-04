
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from './database.types'

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'cantidad'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, cantidad: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id)
        if (existingItem) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
            )
          }))
        } else {
          set((state) => ({
            items: [...state.items, { ...item, cantidad: 1 }]
          }))
        }
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id)
        }))
      },
      updateQuantity: (id, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, cantidad } : i
          )
        }))
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.precio * item.cantidad), 0)
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.cantidad, 0)
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)
