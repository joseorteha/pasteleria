
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, MapPin, Sparkles } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden gradient-cream">
      {/* Background pattern sutil */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      {/* Contenido principal */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Badge de marca */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium"
          >
            <Sparkles className="h-4 w-4" />
            Artesanía Mexicana
          </motion.div>

          {/* Título principal */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-foreground tracking-tight"
          >
            Pastelería{' '}
            <span className="text-brand-primary">Mairim</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light"
          >
            Endulzando tus momentos especiales en Zongolica
          </motion.p>

          {/* Descripción */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed"
          >
            Descubre nuestros deliciosos pasteles artesanales, cupcakes únicos y postres tradicionales veracruzanos, 
            hechos con amor y los mejores ingredientes de la región.
          </motion.p>
          
          {/* CTA y ubicación */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4"
          >
            <Link href="/menu">
              <Button 
                size="lg" 
                className="bg-brand-primary hover:bg-brand-warm text-white px-8 py-3 rounded-modern font-medium shadow-soft hover:shadow-medium transition-all duration-200 hover-lift"
              >
                Ver Nuestro Menú
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-brand-primary rounded-full" />
              <span className="text-sm font-medium">Zongolica, Veracruz</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Elementos decorativos sutiles */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-brand-secondary/5 rounded-full blur-3xl" />
    </section>
  )
}
