import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  nombre: string
  precio: number
  imagen: string
  cantidad: number
  tipo: 'producto' | 'pastel_completo' | 'pastel_personalizado'
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
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
      
      addItem: (newItem: CartItem) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === newItem.id)
          
          if (existingItem) {
            // Si el item ya existe, aumentar cantidad
            return {
              items: state.items.map(item =>
                item.id === newItem.id
                  ? { ...item, cantidad: item.cantidad + newItem.cantidad }
                  : item
              )
            }
          } else {
            // Si es un item nuevo, agregarlo
            return {
              items: [...state.items, newItem]
            }
          }
        })
      },
      
      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }))
      },
      
      updateQuantity: (id: string, cantidad: number) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, cantidad } : item
          )
        }))
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + (item.precio * item.cantidad), 0)
      },
      
      getItemCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.cantidad, 0)
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
) 