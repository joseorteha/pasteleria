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
import { 
  Cake, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { User as UserType } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface TamanoPastel {
  id: number
  nombre: string
  descripcion: string
  precio_base: number
  porciones_min: number
  porciones_max: number
}

interface SaborPastel {
  id: number
  nombre: string
  descripcion: string
  precio_adicional: number
  categoria: string
}

interface RellenoPastel {
  id: number
  nombre: string
  descripcion: string
  precio_adicional: number
  categoria: string
}

interface DecoracionPastel {
  id: number
  nombre: string
  descripcion: string
  precio_adicional: number
  categoria: string
}

export default function PastelesPersonalizadosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState<UserType | null>(null)
  
  // Catálogos
  const [tamanos, setTamanos] = useState<TamanoPastel[]>([])
  const [sabores, setSabores] = useState<SaborPastel[]>([])
  const [rellenos, setRellenos] = useState<RellenoPastel[]>([])
  const [decoraciones, setDecoraciones] = useState<DecoracionPastel[]>([])
  
  // Selección del usuario
  const [seleccion, setSeleccion] = useState({
    tamano_id: 0,
    sabor_id: 0,
    relleno_id: 0,
    decoracion_id: 0
  })
  
  // Datos del cliente
  const [clienteData, setClienteData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    fecha_entrega: '',
    hora_entrega: '',
    notas: ''
  })
  
  const [error, setError] = useState('')

  // Verificar autenticación y cargar catálogos
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          toast.error('Debes iniciar sesión para personalizar pasteles')
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
          setClienteData(prev => ({
            ...prev,
            nombre: profile.nombre || '',
            telefono: profile.telefono || '',
            email: profile.email || ''
          }))
        }

        // Cargar catálogos
        await loadCatalogos()
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

  const loadCatalogos = async () => {
    try {
      // Cargar tamaños
      const { data: tamanosData } = await supabase
        .from('tamanos_pastel')
        .select('*')
        .eq('activo', true)
        .order('precio_base')

      if (tamanosData) {
        setTamanos(tamanosData)
        if (tamanosData.length > 0) {
          setSeleccion(prev => ({ ...prev, tamano_id: tamanosData[0].id }))
        }
      }

      // Cargar sabores
      const { data: saboresData } = await supabase
        .from('sabores_pastel')
        .select('*')
        .eq('activo', true)
        .order('categoria')

      if (saboresData) {
        setSabores(saboresData)
        if (saboresData.length > 0) {
          setSeleccion(prev => ({ ...prev, sabor_id: saboresData[0].id }))
        }
      }

      // Cargar rellenos
      const { data: rellenosData } = await supabase
        .from('rellenos_pastel')
        .select('*')
        .eq('activo', true)
        .order('categoria')

      if (rellenosData) {
        setRellenos(rellenosData)
        if (rellenosData.length > 0) {
          setSeleccion(prev => ({ ...prev, relleno_id: rellenosData[0].id }))
        }
      }

      // Cargar decoraciones
      const { data: decoracionesData } = await supabase
        .from('decoraciones_pastel')
        .select('*')
        .eq('activo', true)
        .order('categoria')

      if (decoracionesData) {
        setDecoraciones(decoracionesData)
        if (decoracionesData.length > 0) {
          setSeleccion(prev => ({ ...prev, decoracion_id: decoracionesData[0].id }))
        }
      }
    } catch (error) {
      console.error('Error loading catalogos:', error)
      toast.error('Error al cargar catálogos')
    }
  }

  // Calcular precio total
  const calcularPrecioTotal = () => {
    const tamano = tamanos.find(t => t.id === seleccion.tamano_id)
    const sabor = sabores.find(s => s.id === seleccion.sabor_id)
    const relleno = rellenos.find(r => r.id === seleccion.relleno_id)
    const decoracion = decoraciones.find(d => d.id === seleccion.decoracion_id)

    if (!tamano || !sabor || !relleno || !decoracion) return 0

    return tamano.precio_base + 
           (sabor.precio_adicional || 0) + 
           (relleno.precio_adicional || 0) + 
           (decoracion.precio_adicional || 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validaciones
      if (!seleccion.tamano_id || !seleccion.sabor_id || !seleccion.relleno_id || !seleccion.decoracion_id) {
        throw new Error('Por favor selecciona todas las opciones del pastel')
      }

      if (!clienteData.nombre || !clienteData.telefono || !clienteData.fecha_entrega) {
        throw new Error('Por favor completa todos los campos obligatorios')
      }

      // Crear pastel personalizado
      const pastelData = {
        usuario_id: user?.id,
        nombre_cliente: clienteData.nombre,
        telefono: clienteData.telefono,
        email: clienteData.email,
        fecha_entrega: clienteData.fecha_entrega,
        hora_entrega: clienteData.hora_entrega || null,
        notas: clienteData.notas,
        tamano_id: seleccion.tamano_id,
        sabor_id: seleccion.sabor_id,
        relleno_id: seleccion.relleno_id,
        decoracion_id: seleccion.decoracion_id,
        precio_base: tamanos.find(t => t.id === seleccion.tamano_id)?.precio_base || 0,
        precio_adicional: 0,
        precio_total: calcularPrecioTotal()
      }

      // Remover campos que pueden causar conflicto
      const { precio_base, precio_adicional, ...insertData } = pastelData

      console.log('Datos del pastel a insertar:', pastelData)

      // Primero verificar si el usuario está autenticado
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      console.log('Usuario actual:', currentUser?.id)

      const { data, error: insertError } = await supabase
        .from('pasteles_personalizados')
        .insert([insertData])
        .select()

      if (insertError) {
        console.error('Error creating pastel:', insertError)
        console.error('Error details:', {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        })
        throw new Error(`Error al crear el pedido del pastel: ${insertError.message}`)
      }

      toast.success('¡Pastel personalizado creado exitosamente!')
      router.push('/perfil')

    } catch (error) {
      console.error('Error creating pastel:', error)
      setError(error instanceof Error ? error.message : 'Error al procesar el pedido')
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
          <p className="text-gray-600">Cargando personalizador...</p>
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
              Debes iniciar sesión para personalizar tu pastel
            </p>
            <Button size="lg" onClick={() => router.push('/auth/login')}>
              Iniciar Sesión
            </Button>
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
          <div className="text-center mb-8">
            <Cake className="h-16 w-16 text-brand-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Personaliza tu Pastel
            </h1>
            <p className="text-gray-600">
              Crea el pastel perfecto para tu ocasión especial
            </p>
          </div>
        </motion.div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuración del pastel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Tamaño */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Cake className="h-5 w-5" />
                    <span>Tamaño del Pastel</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tamanos.map((tamano) => (
                    <div
                      key={tamano.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        seleccion.tamano_id === tamano.id
                          ? 'border-brand-primary bg-brand-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSeleccion(prev => ({ ...prev, tamano_id: tamano.id }))}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{tamano.nombre}</h3>
                          <p className="text-sm text-gray-600">{tamano.descripcion}</p>
                          <p className="text-xs text-gray-500">
                            {tamano.porciones_min}-{tamano.porciones_max} porciones
                          </p>
                        </div>
                        <Badge variant="secondary">${tamano.precio_base}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Sabor */}
              <Card>
                <CardHeader>
                  <CardTitle>Sabor del Pastel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sabores.map((sabor) => (
                    <div
                      key={sabor.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        seleccion.sabor_id === sabor.id
                          ? 'border-brand-primary bg-brand-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSeleccion(prev => ({ ...prev, sabor_id: sabor.id }))}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{sabor.nombre}</h3>
                          <p className="text-sm text-gray-600">{sabor.descripcion}</p>
                        </div>
                        {sabor.precio_adicional > 0 && (
                          <Badge variant="outline">+${sabor.precio_adicional}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Relleno */}
              <Card>
                <CardHeader>
                  <CardTitle>Relleno</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {rellenos.map((relleno) => (
                    <div
                      key={relleno.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        seleccion.relleno_id === relleno.id
                          ? 'border-brand-primary bg-brand-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSeleccion(prev => ({ ...prev, relleno_id: relleno.id }))}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{relleno.nombre}</h3>
                          <p className="text-sm text-gray-600">{relleno.descripcion}</p>
                        </div>
                        {relleno.precio_adicional > 0 && (
                          <Badge variant="outline">+${relleno.precio_adicional}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Decoración */}
              <Card>
                <CardHeader>
                  <CardTitle>Decoración</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {decoraciones.map((decoracion) => (
                    <div
                      key={decoracion.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        seleccion.decoracion_id === decoracion.id
                          ? 'border-brand-primary bg-brand-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSeleccion(prev => ({ ...prev, decoracion_id: decoracion.id }))}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{decoracion.nombre}</h3>
                          <p className="text-sm text-gray-600">{decoracion.descripcion}</p>
                        </div>
                        {decoracion.precio_adicional > 0 && (
                          <Badge variant="outline">+${decoracion.precio_adicional}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Datos del cliente y resumen */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Resumen del pastel */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de tu Pastel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tamaño:</span>
                      <span className="font-medium">
                        {tamanos.find(t => t.id === seleccion.tamano_id)?.nombre}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sabor:</span>
                      <span className="font-medium">
                        {sabores.find(s => s.id === seleccion.sabor_id)?.nombre}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Relleno:</span>
                      <span className="font-medium">
                        {rellenos.find(r => r.id === seleccion.relleno_id)?.nombre}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Decoración:</span>
                      <span className="font-medium">
                        {decoraciones.find(d => d.id === seleccion.decoracion_id)?.nombre}
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-brand-primary">${calcularPrecioTotal()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Datos del cliente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Datos de Entrega</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre completo *</Label>
                    <Input
                      id="nombre"
                      value={clienteData.nombre}
                      onChange={(e) => setClienteData(prev => ({ ...prev, nombre: e.target.value }))}
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
                      onChange={(e) => setClienteData(prev => ({ ...prev, telefono: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clienteData.email}
                      onChange={(e) => setClienteData(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fecha_entrega">Fecha de entrega *</Label>
                      <Input
                        id="fecha_entrega"
                        type="date"
                        value={clienteData.fecha_entrega}
                        onChange={(e) => setClienteData(prev => ({ ...prev, fecha_entrega: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hora_entrega">Hora de entrega</Label>
                      <Input
                        id="hora_entrega"
                        type="time"
                        value={clienteData.hora_entrega}
                        onChange={(e) => setClienteData(prev => ({ ...prev, hora_entrega: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notas">Notas especiales</Label>
                    <Textarea
                      id="notas"
                      value={clienteData.notas}
                      onChange={(e) => setClienteData(prev => ({ ...prev, notas: e.target.value }))}
                      className="mt-1"
                      rows={3}
                      placeholder="Instrucciones especiales, alergias, detalles específicos..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                className="w-full bg-brand-primary hover:bg-brand-warm shadow-soft hover:shadow-medium"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Crear Pastel Personalizado'}
              </Button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  )
} 