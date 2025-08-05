
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Phone, Clock, Facebook, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { Logo } from '@/components/logo'
import { supabase } from '@/lib/supabase'

export default function ContactoPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validar campos requeridos
      if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
        toast.error('Por favor completa todos los campos requeridos')
        return
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Por favor ingresa un email válido')
        return
      }

      // Guardar mensaje en Supabase
      const { error } = await supabase
        .from('mensajes_contacto')
        .insert([{
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono || null,
          asunto: formData.asunto,
          mensaje: formData.mensaje
        }])

      if (error) {
        console.error('Error guardando mensaje:', error)
        toast.error('Error al enviar el mensaje. Inténtalo de nuevo.')
      } else {
        toast.success('¡Mensaje enviado correctamente! Te contactaremos pronto.')
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          asunto: '',
          mensaje: ''
        })
      }
    } catch (error) {
      console.error('Error inesperado:', error)
      toast.error('Error al enviar el mensaje. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
          <div className="flex justify-center mb-6">
            <Logo size="lg" className="scale-125" />
          </div>
          <h1 className="text-4xl font-bold text-brand-warm mb-4">
            Contáctanos
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Contáctanos para pedidos especiales, preguntas o cualquier información que necesites.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-brand-warm mb-6">
                Información de Contacto
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-brand-warm">Dirección</h3>
                    <p className="text-muted-foreground">
                      Calle Principal S/N<br />
                      Col. Centro, Zongolica, Veracruz<br />
                      México
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-brand-warm">Teléfono</h3>
                    <p className="text-muted-foreground">272 227-2726</p>
                    <p className="text-sm text-muted-foreground">
                      Disponible en horario de atención
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-brand-warm">Horarios de Atención</h3>
                    <p className="text-muted-foreground">
                      Lunes a Domingo<br />
                      8:00 AM - 9:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Facebook className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-brand-warm">Redes Sociales</h3>
                    <a 
                      href="https://www.facebook.com/profile.php?id=100057518706324" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:text-brand-warm transition-colors"
                    >
                      Síguenos en Facebook desde 2019
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa placeholder */}
            <Card className="shadow-soft border-brand-accent">
              <CardContent className="p-0">
                <div className="w-full h-64 bg-brand-accent/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-brand-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Encuéntranos en el centro de Zongolica
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Formulario de contacto */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-soft border-brand-accent bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-brand-warm">
                  <Mail className="h-5 w-5 mr-2 text-brand-primary" />
                  Envíanos un Mensaje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre" className="text-brand-warm">Nombre completo *</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        className="mt-1 border-brand-accent focus:border-brand-primary focus:ring-brand-primary/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefono" className="text-brand-warm">Teléfono</Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="mt-1 border-brand-accent focus:border-brand-primary focus:ring-brand-primary/20"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-brand-warm">Correo electrónico *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1 border-brand-accent focus:border-brand-primary focus:ring-brand-primary/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="asunto" className="text-brand-warm">Asunto *</Label>
                    <Input
                      id="asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleInputChange}
                      required
                      className="mt-1 border-brand-accent focus:border-brand-primary focus:ring-brand-primary/20"
                      placeholder="¿En qué podemos ayudarte?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mensaje" className="text-brand-warm">Mensaje *</Label>
                    <Textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      required
                      className="mt-1 border-brand-accent focus:border-brand-primary focus:ring-brand-primary/20"
                      rows={4}
                      placeholder="Escribe tu mensaje aquí..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-brand-primary hover:bg-brand-warm text-white shadow-soft hover:shadow-medium transition-all duration-200"
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : 'Enviar Mensaje'}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-brand-accent/20 rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    <strong>¿Prefieres llamarnos directamente?</strong><br />
                    Llámanos al <span className="text-brand-primary font-semibold">272 227-2726</span> durante nuestro horario de atención.
                  </p>
                </div>
                
                <div className="mt-4 p-4 bg-brand-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    <strong>¿Quieres compartir tu experiencia?</strong><br />
                    <a href="/#comentarios" className="text-brand-primary hover:text-brand-warm font-medium transition-colors">
                      Deja un comentario en nuestra página principal
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
