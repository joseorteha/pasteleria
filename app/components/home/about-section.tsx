
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Award, Clock, Heart, Users } from 'lucide-react'

export default function AboutSection() {
  const features = [
    {
      icon: Heart,
      title: 'Hecho con Amor',
      description: 'Cada producto es elaborado con cariño y los mejores ingredientes'
    },
    {
      icon: Award,
      title: 'Calidad Premium',
      description: 'Más de 10 años perfeccionando nuestras recetas tradicionales'
    },
    {
      icon: Clock,
      title: 'Horneado Diario',
      description: 'Productos frescos todos los días desde las 8:00 AM'
    },
    {
      icon: Users,
      title: 'Para Toda la Familia',
      description: 'Endulzamos momentos especiales desde 2013'
    }
  ]

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenido de texto */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-warm-primary">
              Tradición y Sabor en el Corazón de Zongolica
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              En Pastelería Mairim, combinamos las recetas tradicionales mexicanas con técnicas modernas de repostería. 
              Ubicados en el hermoso pueblo de Zongolica, Veracruz, hemos estado endulzando los momentos más especiales 
              de nuestras familias desde 2013.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nuestro compromiso es ofrecer productos frescos y deliciosos que capturen el auténtico sabor de la repostería veracruzana, 
              desde nuestros famosos pasteles tres leches hasta las tradicionales conchas que tanto nos caracterizan.
            </p>
          </motion.div>

          {/* Features grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-warm-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-6 w-6 text-warm-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
