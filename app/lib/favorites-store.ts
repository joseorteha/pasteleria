import { create } from 'zustand'
import { supabase } from './supabase'

interface FavoritesStore {
  favorites: string[]
  loading: boolean
  loadFavorites: () => Promise<void>
  addFavorite: (productId: string) => Promise<void>
  removeFavorite: (productId: string) => Promise<void>
  toggleFavorite: (productId: string) => Promise<void>
  isFavorite: (productId: string) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],
  loading: false,
  
  loadFavorites: async () => {
    try {
      set({ loading: true })
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        set({ favorites: [], loading: false })
        return
      }

      const { data, error } = await supabase
        .from('favoritos')
        .select('producto_id')
        .eq('usuario_id', user.id)
        .order('fecha_agregado', { ascending: false })

      if (error) {
        console.error('Error cargando favoritos:', error)
        set({ favorites: [], loading: false })
        return
      }

      const favorites = data?.map(item => item.producto_id) || []
      set({ favorites, loading: false })
    } catch (error) {
      console.error('Error cargando favoritos:', error)
      set({ favorites: [], loading: false })
    }
  },
  
  addFavorite: async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error('Usuario no autenticado')
        return
      }

      const { error } = await supabase
        .from('favoritos')
        .insert([{
          usuario_id: user.id,
          producto_id: productId
        }])

      if (error) {
        console.error('Error agregando favorito:', error)
        return
      }

      const { favorites } = get()
      if (!favorites.includes(productId)) {
        set({ favorites: [...favorites, productId] })
      }
    } catch (error) {
      console.error('Error agregando favorito:', error)
    }
  },
  
  removeFavorite: async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error('Usuario no autenticado')
        return
      }

      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('usuario_id', user.id)
        .eq('producto_id', productId)

      if (error) {
        console.error('Error removiendo favorito:', error)
        return
      }

      const { favorites } = get()
      set({ favorites: favorites.filter(id => id !== productId) })
    } catch (error) {
      console.error('Error removiendo favorito:', error)
    }
  },
  
  toggleFavorite: async (productId: string) => {
    const { favorites, addFavorite, removeFavorite } = get()
    if (favorites.includes(productId)) {
      await removeFavorite(productId)
    } else {
      await addFavorite(productId)
    }
  },
  
  isFavorite: (productId: string) => {
    const { favorites } = get()
    return favorites.includes(productId)
  },
  
  clearFavorites: () => {
    set({ favorites: [] })
  }
})) 