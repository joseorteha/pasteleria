import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface PastelCompleto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  categoria_id: number
  imagen_url: string
  ingredientes: string[]
  destacado: boolean
  disponible: boolean
  created_at: string
  updated_at: string
  categoria: {
    id: number
    nombre: string
    descripcion: string
  }
}

export interface CategoriaPastel {
  id: number
  nombre: string
  descripcion: string
  activo: boolean
  created_at: string
}

export function usePastelesCompletos() {
  const [pasteles, setPasteles] = useState<PastelCompleto[]>([])
  const [categorias, setCategorias] = useState<CategoriaPastel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar pasteles completos
  const cargarPasteles = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: pastelesData, error: pastelesError } = await supabase
        .from('pasteles_completos')
        .select(`
          *,
          categoria:categorias_pasteles(id, nombre, descripcion)
        `)
        .eq('disponible', true)
        .order('destacado', { ascending: false })
        .order('nombre', { ascending: true })

      if (pastelesError) {
        console.error('Error cargando pasteles:', pastelesError)
        setError('Error al cargar los pasteles')
        return
      }

      setPasteles(pastelesData || [])
    } catch (err) {
      console.error('Error inesperado:', err)
      setError('Error inesperado al cargar los pasteles')
    } finally {
      setLoading(false)
    }
  }

  // Cargar categorías
  const cargarCategorias = async () => {
    try {
      const { data: categoriasData, error: categoriasError } = await supabase
        .from('categorias_pasteles')
        .select('*')
        .eq('activo', true)
        .order('nombre', { ascending: true })

      if (categoriasError) {
        console.error('Error cargando categorías:', categoriasError)
        return
      }

      setCategorias(categoriasData || [])
    } catch (err) {
      console.error('Error cargando categorías:', err)
    }
  }

  // Cargar pasteles por categoría
  const cargarPastelesPorCategoria = async (categoriaId: number) => {
    try {
      setLoading(true)
      setError(null)

      const { data: pastelesData, error: pastelesError } = await supabase
        .from('pasteles_completos')
        .select(`
          *,
          categoria:categorias_pasteles(id, nombre, descripcion)
        `)
        .eq('disponible', true)
        .eq('categoria_id', categoriaId)
        .order('destacado', { ascending: false })
        .order('nombre', { ascending: true })

      if (pastelesError) {
        console.error('Error cargando pasteles por categoría:', pastelesError)
        setError('Error al cargar los pasteles')
        return
      }

      setPasteles(pastelesData || [])
    } catch (err) {
      console.error('Error inesperado:', err)
      setError('Error inesperado al cargar los pasteles')
    } finally {
      setLoading(false)
    }
  }

  // Buscar pasteles
  const buscarPasteles = async (termino: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data: pastelesData, error: pastelesError } = await supabase
        .from('pasteles_completos')
        .select(`
          *,
          categoria:categorias_pasteles(id, nombre, descripcion)
        `)
        .eq('disponible', true)
        .or(`nombre.ilike.%${termino}%,descripcion.ilike.%${termino}%`)
        .order('destacado', { ascending: false })
        .order('nombre', { ascending: true })

      if (pastelesError) {
        console.error('Error buscando pasteles:', pastelesError)
        setError('Error al buscar los pasteles')
        return
      }

      setPasteles(pastelesData || [])
    } catch (err) {
      console.error('Error inesperado:', err)
      setError('Error inesperado al buscar los pasteles')
    } finally {
      setLoading(false)
    }
  }

  // Cargar pasteles destacados
  const cargarPastelesDestacados = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: pastelesData, error: pastelesError } = await supabase
        .from('pasteles_completos')
        .select(`
          *,
          categoria:categorias_pasteles(id, nombre, descripcion)
        `)
        .eq('disponible', true)
        .eq('destacado', true)
        .order('nombre', { ascending: true })

      if (pastelesError) {
        console.error('Error cargando pasteles destacados:', pastelesError)
        setError('Error al cargar los pasteles destacados')
        return
      }

      setPasteles(pastelesData || [])
    } catch (err) {
      console.error('Error inesperado:', err)
      setError('Error inesperado al cargar los pasteles destacados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarPasteles()
    cargarCategorias()
  }, [])

  return {
    pasteles,
    categorias,
    loading,
    error,
    cargarPasteles,
    cargarPastelesPorCategoria,
    buscarPasteles,
    cargarPastelesDestacados,
    cargarCategorias
  }
} 