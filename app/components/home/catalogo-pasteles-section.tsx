'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cake, Star, ShoppingCart, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Pastel {
  id: number
  nombre: string
  descripcion: string
  precio: number
  categoria: string
  tamaño: string
  ingredientes: string[]
  imagen_url: string
  destacado: boolean
  disponible: boolean
}

interface CatalogoPastelesSectionProps {
  pasteles: Pastel[]
}

export default function CatalogoPastelesSection({ pasteles }: CatalogoPastelesSectionProps) {
  const [hoveredPastel, setHoveredPastel] = useState<number | null>(null)

  const pastelesDestacados = pasteles.filter(pastel => pastel.destacado)

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Cake className="h-8 w-8 text-brand-primary mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              Nuestros Pasteles
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre nuestra colección de pasteles artesanales, elaborados con ingredientes frescos 
            y decorados con el mayor cuidado. Perfectos para cualquier celebración especial.
          </p>
        </motion.div>

        {/* Grid de pasteles destacados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {pastelesDestacados.map((pastel, index) => (
            <motion.div
              key={pastel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredPastel(pastel.id)}
              onMouseLeave={() => setHoveredPastel(null)}
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

                  {/* Overlay con botones */}
                  {hoveredPastel === pastel.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    >
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button size="sm">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Ordenar
                        </Button>
                      </div>
                    </motion.div>
                  )}
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
                        {pastel.categoria}
                      </Badge>
                      <p className="font-bold text-brand-primary">
                        ${pastel.precio}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {pastel.tamaño}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿No encuentras lo que buscas?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Tenemos muchos más pasteles disponibles. Explora nuestro catálogo completo 
              o personaliza tu pastel perfecto según tus preferencias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/catalogo-pasteles">
                <Button size="lg" className="bg-brand-primary hover:bg-brand-warm">
                  <Cake className="h-5 w-5 mr-2" />
                  Ver Catálogo Completo
                </Button>
              </Link>
              <Link href="/pasteles-personalizados">
                <Button size="lg" variant="outline">
                  <Star className="h-5 w-5 mr-2" />
                  Personalizar Pastel
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 