
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Phone, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

export default function ContactCTA() {
  return (
    <section className="py-16 bg-warm-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-warm-primary mb-4">
            ¿Listo para Endulzar tu Día?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visítanos en nuestro local o haz tu pedido. Estamos aquí para hacer tus momentos especiales aún más dulces.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="text-center h-full">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-warm-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-warm-primary" />
                </div>
                <h3 className="font-semibold mb-2">Ubicación</h3>
                <p className="text-muted-foreground text-sm">
                  Calle Principal S/N<br />
                  Col. Centro, Zongolica, Veracruz
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
            <Card className="text-center h-full">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-warm-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-warm-primary" />
                </div>
                <h3 className="font-semibold mb-2">Teléfono</h3>
                <p className="text-muted-foreground text-sm">
                  272 227-2726
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Disponible en horario de atención
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
            <Card className="text-center h-full">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-warm-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-warm-primary" />
                </div>
                <h3 className="font-semibold mb-2">Horarios</h3>
                <p className="text-muted-foreground text-sm">
                  Lunes a Domingo<br />
                  8:00 AM - 9:00 PM
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/contacto">
            <Button size="lg" className="bg-warm-primary hover:bg-warm-primary/90 text-white">
              Contactanos Ahora
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
