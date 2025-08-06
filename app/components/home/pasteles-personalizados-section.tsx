'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cake, Sparkles, Users, Clock } from 'lucide-react'
import Link from 'next/link'

export default function PastelesPersonalizadosSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-brand-cream to-brand-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Cake className="h-16 w-16 text-brand-primary mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pasteles Personalizados
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Crea el pastel perfecto para tu ocasión especial. Elige el tamaño, sabor, relleno y decoración que más te guste.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="text-center h-full hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cake className="h-6 w-6 text-brand-primary" />
                </div>
                <CardTitle className="text-lg">Tamaños</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Desde 1/4 hasta pasteles extra grandes para eventos especiales
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="text-center h-full hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-brand-primary" />
                </div>
                <CardTitle className="text-lg">Sabores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Chocolate, vainilla, frutas y sabores especiales como Red Velvet
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="text-center h-full hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-brand-primary" />
                </div>
                <CardTitle className="text-lg">Rellenos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Crema pastelera, chocolate, frutas y rellenos especiales
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="text-center h-full hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-brand-primary" />
                </div>
                <CardTitle className="text-lg">Decoraciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Flores de fondant, figuras personalizadas y decoraciones especiales
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-soft max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona?
            </h3>
            <div className="space-y-4 text-left mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  1
                </div>
                <p className="text-gray-600">
                  Selecciona el tamaño de tu pastel según el número de personas
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  2
                </div>
                <p className="text-gray-600">
                  Elige tu sabor favorito y el relleno que más te guste
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  3
                </div>
                <p className="text-gray-600">
                  Personaliza la decoración y agrega notas especiales
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  4
                </div>
                <p className="text-gray-600">
                  Programa la fecha de entrega y ¡listo! Tu pastel personalizado estará en camino
                </p>
              </div>
            </div>
            <Link href="/pasteles-personalizados">
              <Button size="lg" className="bg-brand-primary hover:bg-brand-warm shadow-soft hover:shadow-medium">
                <Cake className="h-5 w-5 mr-2" />
                Crear Mi Pastel Personalizado
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 