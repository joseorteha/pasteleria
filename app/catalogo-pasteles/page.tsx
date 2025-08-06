'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Cake, Star, ShoppingCart, Eye, Search, Filter, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePastelesCompletos, PastelCompleto } from '@/hooks/use-pasteles-completos'
import { useCartStore } from '@/store/cart-store'
import toast from 'react-hot-toast'

export default function CatalogoPastelesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todos')
  const [selectedPastel, setSelectedPastel] = useState<PastelCompleto | null>(null)
  const { pasteles, categorias, loading, error, cargarPasteles, cargarPastelesPorCategoria, buscarPasteles } = usePastelesCompletos()
  const { addItem } = useCartStore()

  // Filtrar pasteles
  const filteredPasteles = pasteles.filter(pastel => {
    const matchesSearch = pastel.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pastel.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = selectedCategoria === 'todos' || 
                            pastel.categoria.nombre.toLowerCase().includes(selectedCategoria.toLowerCase())
    
    return matchesSearch && matchesCategoria
  })

  const handleAddToCart = (pastel: PastelCompleto) => {
    addItem({
      id: `pastel-${pastel.id}`,
      nombre: pastel.nombre,
      precio: pastel.precio,
      imagen: pastel.imagen_url,
      cantidad: 1,
      tipo: 'pastel_completo'
    })
    toast.success(`${pastel.nombre} agregado al carrito`)
  }

  // Efecto para buscar cuando cambia el término
  useEffect(() => {
    if (searchTerm.trim()) {
      buscarPasteles(searchTerm)
    } else {
      cargarPasteles()
    }
  }, [searchTerm])

  // Efecto para filtrar por categoría
  useEffect(() => {
    if (selectedCategoria !== 'todos') {
      const categoria = categorias.find(cat => cat.nombre.toLowerCase().includes(selectedCategoria.toLowerCase()))
      if (categoria) {
        cargarPastelesPorCategoria(categoria.id)
      }
    } else {
      cargarPasteles()
    }
  }, [selectedCategoria])

  // Preparar categorías para el select
  const categoriasSelect = [
    { id: "todos", nombre: "Todos", descripcion: "Todos los pasteles" },
    ...categorias.map(cat => ({
      id: cat.nombre.toLowerCase(),
      nombre: cat.nombre,
      descripcion: cat.descripcion
    }))
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Cake className="h-10 w-10 text-brand-primary mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">
                Catálogo de Pasteles
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Descubre nuestra colección completa de pasteles artesanales. 
              Cada pastel está elaborado con ingredientes frescos y decorado con el mayor cuidado.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 shadow-soft mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar pasteles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasSelect.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            <span className="ml-2 text-gray-600">Cargando pasteles...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={cargarPasteles}>
              Intentar de nuevo
            </Button>
          </div>
        )}

        {/* Grid de pasteles */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPasteles.map((pastel, index) => (
              <motion.div
                key={pastel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 border-0 bg-white">
                  <div className="relative">
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={pastel.imagen_url}
                        alt={pastel.nombre}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    
                    {/* Badge destacado */}
                    {pastel.destacado && (
                      <Badge className="absolute top-3 left-3 bg-brand-primary text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Destacado
                      </Badge>
                    )}

                    {/* Botones de acción */}
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedPastel(pastel)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleAddToCart(pastel)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {pastel.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {pastel.descripcion}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {pastel.categoria.nombre}
                        </Badge>
                        <p className="font-bold text-brand-primary">
                          ${pastel.precio}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Pastel Completo
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Mensaje si no hay resultados */}
        {!loading && !error && filteredPasteles.length === 0 && (
          <div className="text-center py-12">
            <Cake className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron pasteles
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar los filtros o busca con otros términos.
            </p>
            <Button onClick={() => {
              setSearchTerm('')
              setSelectedCategoria('todos')
            }}>
              Limpiar filtros
            </Button>
          </div>
        )}

        {/* CTA personalización */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Quieres algo más especial?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Si no encuentras exactamente lo que buscas, podemos crear un pastel personalizado 
              según tus preferencias y necesidades específicas.
            </p>
            <Link href="/pasteles-personalizados">
              <Button size="lg" className="bg-brand-primary hover:bg-brand-warm">
                <Star className="h-5 w-5 mr-2" />
                Personalizar mi Pastel
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de detalles del pastel */}
      {selectedPastel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="relative">
              <Image
                src={selectedPastel.imagen_url}
                alt={selectedPastel.nombre}
                width={600}
                height={400}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setSelectedPastel(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedPastel.nombre}
                </h2>
                <p className="text-2xl font-bold text-brand-primary">
                  ${selectedPastel.precio}
                </p>
              </div>
              
              <p className="text-gray-600 mb-4">
                {selectedPastel.descripcion}
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Ingredientes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPastel.ingredientes.map((ingrediente, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {ingrediente}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tamaño:</p>
                    <p className="font-medium">Pastel Completo</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Categoría:</p>
                    <p className="font-medium">{selectedPastel.categoria.nombre}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button 
                  className="flex-1"
                  onClick={() => handleAddToCart(selectedPastel)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Agregar al Carrito
                </Button>
                <Link href="/pasteles-personalizados">
                  <Button variant="outline">
                    <Star className="h-4 w-4 mr-2" />
                    Personalizar
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 