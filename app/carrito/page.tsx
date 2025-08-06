
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingBag, Trash2, Package, MapPin, Clock, Minus, Plus, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'
import { supabase } from '@/lib/supabase'
import { createPaymentPreference, formatCartItemsForMP } from '@/lib/mercadopago'
import toast from 'react-hot-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User } from '@supabase/supabase-js'

export default function CarritoPage() {
  const router = useRouter()
  const { items, getTotal, clearCart, updateQuantity, removeItem } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [clienteData, setClienteData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    notas: ''
  })
  const [error, setError] = useState('')

  // Verificar autenticación y cargar datos del perfil
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          // Usuario no autenticado, redirigir al login
          toast.error('Debes iniciar sesión para continuar')
          router.push('/auth/login')
          return
        }

        setUser(user)

        // Cargar datos del perfil del usuario
        const { data: profile, error: profileError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile && !profileError) {
          setClienteData({
            nombre: profile.nombre || '',
            telefono: profile.telefono || '',
            direccion: '', // Los usuarios no tienen dirección por defecto
            notas: ''
          })
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        toast.error('Error al verificar autenticación')
        router.push('/auth/login')
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleSubmitPedido = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Verificar si hay usuario autenticado
      const { data: { user } } = await supabase.auth.getUser()
      
      // Generar ID único para el pedido
      const pedidoId = crypto.randomUUID()
      
      // Crear preferencia de pago a través de la API
      const mpItems = formatCartItemsForMP(items)
      console.log('Items del carrito:', items)
      console.log('Items formateados para MP:', mpItems)

      const response = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: mpItems,
          payer: {
            name: clienteData.nombre,
            email: 'comprador.aleatorio123@gmail.com',
            phone: {
              number: clienteData.telefono
            }
          },
          back_urls: {
            success: `${window.location.origin}/confirmacion/${pedidoId}`,
            failure: `${window.location.origin}/carrito`,
            pending: `${window.location.origin}/confirmacion/${pedidoId}`
          },
          external_reference: pedidoId
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear preferencia de pago')
      }

      // Insertar pedido en Supabase
      const pedidoData = {
        id: pedidoId,
        usuario_id: user?.id || null, // Asociar con usuario si está autenticado
        cliente_nombre: clienteData.nombre,
        cliente_telefono: clienteData.telefono,
        cliente_direccion: clienteData.direccion,
        total: getTotal(),
        estado: 'Pendiente',
        items: items,
        id_pago_mp: result.preferenceId,
        fecha_creacion: new Date().toISOString()
      }

      console.log('Datos del pedido a insertar:', pedidoData)

      const { error: pedidoError } = await supabase
        .from('pedidos')
        .insert([pedidoData])

      if (pedidoError) {
        console.error('Error creating order:', pedidoError)
        throw new Error('Error al crear el pedido')
      }

      // Limpiar carrito
      clearCart()

      // Redirigir a MercadoPago
      console.log('Resultado de MercadoPago:', result)
      
      const redirectUrl = result.sandbox_init_point || result.init_point || result.sandboxInitPoint || result.initPoint
      
      if (!redirectUrl) {
        console.error('No se recibió URL de redirección de MercadoPago')
        throw new Error('Error: No se recibió URL de pago de MercadoPago')
      }
      
      console.log('Redirigiendo a:', redirectUrl)
      window.location.href = redirectUrl

    } catch (error) {
      console.error('Error creating order:', error)
      setError('Error al procesar el pedido. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Mostrar loading mientras verifica autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Verificar si el usuario está autenticado
  if (!user) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AlertCircle className="h-24 w-24 text-red-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Acceso Requerido
            </h1>
            <p className="text-muted-foreground mb-8">
              Debes iniciar sesión para continuar con tu compra
            </p>
            <div className="space-x-4">
              <Link href="/auth/login">
                <Button size="lg" className="bg-brand-primary hover:bg-brand-primary/90">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/menu">
                <Button variant="outline" size="lg">
                  Ver Menú
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-brand-primary mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-muted-foreground mb-8">
              Descubre nuestros deliciosos productos y comienza a agregar tus favoritos
            </p>
            <Link href="/menu">
              <Button size="lg" className="bg-brand-primary hover:bg-brand-warm shadow-soft hover:shadow-medium">
                Ver Menú
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-warm-primary mb-8 text-center">
            Tu Carrito
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items del carrito */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Productos ({items.length})</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpiar carrito
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      {/* Assuming item.imagen_url is available */}
                      <img 
                        src={item.imagen_url || '/placeholder.jpg'} // Fallback to placeholder
                        alt={item.nombre}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.nombre}</h3>
                      <p className="text-warm-primary font-bold">${item.precio}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.cantidad}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${item.precio * item.cantidad}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Formulario y resumen */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Resumen del pedido */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${getTotal()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-brand-primary">${getTotal()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Formulario de datos del cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Datos de Entrega</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mensaje informativo */}
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Los datos de tu perfil han sido cargados automáticamente. <strong>Recuerda agregar tu dirección de entrega.</strong> Puedes editar todos los datos si es necesario.
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmitPedido} className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre completo *</Label>
                    <Input
                      id="nombre"
                      value={clienteData.nombre}
                      onChange={(e) => setClienteData({ ...clienteData, nombre: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      value={clienteData.telefono}
                      onChange={(e) => setClienteData({ ...clienteData, telefono: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="direccion">Dirección completa *</Label>
                    <Textarea
                      id="direccion"
                      value={clienteData.direccion}
                      onChange={(e) => setClienteData({ ...clienteData, direccion: e.target.value })}
                      required
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notas">Notas especiales (opcional)</Label>
                    <Textarea
                      id="notas"
                      value={clienteData.notas}
                      onChange={(e) => setClienteData({ ...clienteData, notas: e.target.value })}
                      className="mt-1"
                      rows={2}
                      placeholder="Instrucciones especiales, alergias, etc."
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-brand-primary hover:bg-brand-warm shadow-soft hover:shadow-medium"
                    disabled={loading}
                  >
                    {loading ? 'Procesando...' : 'Realizar Pedido'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
