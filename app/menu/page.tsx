
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ShoppingCart, Star, Filter, Eye, Heart, HeartOff, Sparkles, Clock, Users } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Producto } from '@/lib/database.types'
import { useCartStore } from '@/lib/cart-store'
import { useFavoritesStore } from '@/lib/favorites-store'
import toast from 'react-hot-toast'
import ProductModal from '@/components/product-modal'

const categorias = ['Todas', 'Pan Dulce', 'Pastel', 'Frito', 'Galleta', 'Dulce', 'Postre', 'Raspado']

export default function MenuPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroCategoria, setFiltroCategoria] = useState('Todas')
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { toggleFavorite, isFavorite, favorites, loadFavorites, loading: favoritesLoading } = useFavoritesStore()

  useEffect(() => {
    fetchProductos()
    loadFavorites()
  }, [loadFavorites])

  const fetchProductos = async () => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('categoria', { ascending: true })
      
      if (error) throw error
      console.log('Productos cargados desde Supabase:', data)
      console.log('Primer producto:', data?.[0])
      setProductos(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('No se pudieron cargar los productos. Inténtalo de nuevo más tarde.')
    } finally {
      setLoading(false)
    }
  }



  const handleViewDetails = (producto: Producto) => {
    console.log('Abriendo modal para:', producto.nombre)
    setSelectedProduct(producto)
    setIsModalOpen(true)
    toast.success(`Viendo detalles de ${producto.nombre}`)
  }

  const handleToggleFavorite = async (producto: Producto) => {
    await toggleFavorite(producto.id)
    const isFav = isFavorite(producto.id)
    if (isFav) {
      toast.success(`${producto.nombre} agregado a favoritos`)
    } else {
      toast.success(`${producto.nombre} removido de favoritos`)
    }
  }

  const handleAddToCart = (producto: Producto) => {
    addItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen_url: producto.imagen_url
    })
    toast.success(`${producto.nombre} agregado al carrito`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    })
  }

  const productosFiltrados = productos.filter(producto => {
    const categoriaMatch = filtroCategoria === 'Todas' || producto.categoria === filtroCategoria
    const favoritosMatch = !showFavorites || isFavorite(producto.id)
    return categoriaMatch && favoritosMatch
  })

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-warm-primary">Nuestro Menú</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-brand-primary mr-3" />
            <h1 className="text-4xl font-bold text-brand-warm">
              Nuestro Menú Artesanal
            </h1>
            <Sparkles className="h-8 w-8 text-brand-primary ml-3" />
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed mb-8">
            Descubre nuestros deliciosos productos artesanales, elaborados con ingredientes frescos y técnicas tradicionales. 
            Desde pasteles tradicionales hasta especialidades veracruzanas, cada producto es una obra de arte culinaria.
          </p>
          
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-lg p-4 border border-brand-accent/20">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-brand-primary" />
                <span className="text-sm font-medium text-brand-warm">Productos Frescos</span>
              </div>
              <p className="text-2xl font-bold text-brand-primary mt-2">{productos.length}</p>
            </div>
            <div className="bg-gradient-to-r from-brand-secondary/10 to-brand-accent/10 rounded-lg p-4 border border-brand-accent/20">
              <div className="flex items-center justify-center space-x-2">
                <Heart className="h-5 w-5 text-brand-primary" />
                <span className="text-sm font-medium text-brand-warm">Favoritos</span>
              </div>
              <p className="text-2xl font-bold text-brand-primary mt-2">
                {favoritesLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
                ) : (
                  favorites.length
                )}
              </p>
            </div>
            <div className="bg-gradient-to-r from-brand-accent/10 to-brand-warm/10 rounded-lg p-4 border border-brand-accent/20">
              <div className="flex items-center justify-center space-x-2">
                <Users className="h-5 w-5 text-brand-primary" />
                <span className="text-sm font-medium text-brand-warm">Categorías</span>
              </div>
              <p className="text-2xl font-bold text-brand-primary mt-2">{categorias.length - 1}</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Badge variant="outline" className="text-brand-warm border-brand-accent">
              🎂 Productos Frescos
            </Badge>
            <Badge variant="outline" className="text-brand-warm border-brand-accent">
              🌾 Ingredientes Naturales
            </Badge>
            <Badge variant="outline" className="text-brand-warm border-brand-accent">
              🏆 Calidad Artesanal
            </Badge>
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-brand-cream to-brand-accent/20 rounded-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <Filter className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-brand-warm">Filtrar productos</span>
                <p className="text-xs text-muted-foreground">Encuentra tu producto favorito</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* Filtro de favoritos */}
              <Button
                variant={showFavorites ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavorites(!showFavorites)}
                className={`flex items-center space-x-2 ${
                  showFavorites 
                    ? 'bg-brand-primary text-white' 
                    : 'border-brand-accent text-brand-warm hover:bg-brand-accent'
                }`}
              >
                <Heart className={`h-4 w-4 ${showFavorites ? 'fill-current' : ''}`} />
                <span>Favoritos</span>
                {favorites.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {favorites.length}
                  </Badge>
                )}
              </Button>
              
              {/* Filtro de categoría */}
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-[200px] border-brand-accent bg-white/80">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Contador de productos */}
          <div className="mt-4 text-center">
            <span className="text-sm text-muted-foreground">
              Mostrando {productosFiltrados.length} de {productos.length} productos
              {showFavorites && favorites.length > 0 && ` (${favorites.length} favoritos)`}
            </span>
          </div>
        </motion.div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosFiltrados.map((producto, index) => (
            <motion.div
              key={producto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group hover-lift transition-smooth overflow-hidden h-full border-0 shadow-soft bg-card/50 backdrop-blur-sm relative">
                {/* Botón de favorito */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleFavorite(producto)}
                  className="absolute top-3 left-3 z-10 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 rounded-full shadow-soft transform hover:scale-110 active:scale-95"
                >
                  {isFavorite(producto.id) ? (
                    <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
                  ) : (
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                  )}
                </Button>
                
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                  <Badge className="absolute top-4 right-4 bg-brand-primary/90 text-white border-0 shadow-soft">
                    {producto.categoria}
                  </Badge>
                  
                  {/* Overlay de hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(producto)}
                        className="bg-white/95 border-white text-brand-warm hover:bg-white transition-all duration-200 transform hover:scale-105"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleAddToCart(producto)}
                        className="bg-brand-primary hover:bg-brand-warm text-white shadow-soft hover:shadow-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Agregar
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg text-foreground flex-1 mr-2 leading-tight">{producto.nombre}</h3>
                    <div className="flex items-center text-yellow-500 flex-shrink-0">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm ml-1 font-medium">4.8</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
                    {producto.descripcion}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-brand-primary">
                        ${producto.precio}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Precio por unidad
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewDetails(producto)}
                        className="border-brand-accent text-brand-warm hover:bg-brand-accent transition-all duration-200"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleAddToCart(producto)}
                        className="bg-brand-primary hover:bg-brand-warm text-white shadow-soft hover:shadow-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Agregar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {productosFiltrados.length === 0 && (
          <div className="text-center py-12">
            {showFavorites && favorites.length === 0 ? (
              <div className="space-y-4">
                <Heart className="h-16 w-16 text-gray-300 mx-auto" />
                <h3 className="text-xl font-semibold text-brand-warm">No tienes favoritos aún</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Agrega productos a tus favoritos haciendo clic en el ícono de corazón en las tarjetas de productos.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowFavorites(false)}
                  className="border-brand-accent text-brand-warm hover:bg-brand-accent"
                >
                  Ver todos los productos
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Filter className="h-16 w-16 text-gray-300 mx-auto" />
                <h3 className="text-xl font-semibold text-brand-warm">No se encontraron productos</h3>
                <p className="text-muted-foreground">
                  No hay productos que coincidan con los filtros seleccionados.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de detalles del producto */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
      />
    </div>
  )
}
