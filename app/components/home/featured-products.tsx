
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Producto } from '@/lib/database.types'
import { useCartStore } from '@/lib/cart-store'
import toast from 'react-hot-toast'

export default function FeaturedProducts() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .limit(6)
      
      if (error) throw error
      setProductos(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      // Productos de ejemplo si falla la conexión
      setProductos([
        {
          id: '1',
          nombre: 'Pastel Tres Leches',
          descripcion: 'Delicioso pastel empapado en tres tipos de leche',
          precio: 45,
          imagen_url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=2070&auto=format&fit=crop',
          categoria: 'Pasteles',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          nombre: 'Conchas Tradicionales',
          descripcion: 'Pan dulce mexicano con cobertura crujiente',
          precio: 18,
          imagen_url: 'https://imgs.search.brave.com/-MAPQLbf_24CsFpGPsbz65750Z-fWc3HvFUzacm44mM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9yZWRz/dGFyeWVhc3QuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIw/LzA5L0NvbmNoYXMt/NzJkcGktOHgxMC0x/LTc2OHg5NjAuanBn',
          categoria: 'Panes',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          nombre: 'Cupcakes de Vainilla',
          descripcion: 'Suaves cupcakes con betún de crema de vainilla',
          precio: 25,
          imagen_url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=2080&auto=format&fit=crop',
          categoria: 'Cupcakes',
          created_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (producto: Producto) => {
    addItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen_url: producto.imagen_url
    })
    toast.success(`${producto.nombre} agregado al carrito`)
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-brand-accent/20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">Productos Destacados</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-muted rounded-modern animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-brand-accent/20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Productos Destacados
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestras especialidades más populares, hechas con ingredientes frescos y mucho amor
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((producto, index) => (
            <motion.div
              key={producto.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group hover-lift transition-smooth overflow-hidden border-0 shadow-soft bg-card/50 backdrop-blur-sm">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <Badge className="absolute top-4 right-4 bg-brand-primary/90 text-white border-0">
                    {producto.categoria}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg text-foreground">{producto.nombre}</h3>
                    <div className="flex items-center text-brand-primary">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm ml-1 font-medium">4.8</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                    {producto.descripcion}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-brand-primary">
                      ${producto.precio}
                    </span>
                    <Button 
                      size="sm" 
                      onClick={() => handleAddToCart(producto)}
                      className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-modern-sm transition-smooth"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/menu">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-modern transition-smooth"
            >
              Ver Todo el Menú
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
