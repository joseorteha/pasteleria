'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, CheckCircle, Clock, Cake, User, Phone, Mail, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface PastelPersonalizado {
  id: string
  usuario_id: string
  nombre_cliente: string
  telefono: string
  email: string
  fecha_entrega: string
  hora_entrega: string
  notas: string
  tamano_id: number
  sabor_id: number
  relleno_id: number
  decoracion_id: number
  precio_base: number
  precio_adicional: number
  precio_total: number
  estado: string
  created_at: string
  tamano: {
    nombre: string
  }
  sabor: {
    nombre: string
  }
  relleno: {
    nombre: string
  }
  decoracion: {
    nombre: string
  }
}

interface PastelesPersonalizadosTabProps {
  onRefresh: () => void
}

export default function PastelesPersonalizadosTab({ onRefresh }: PastelesPersonalizadosTabProps) {
  const [pasteles, setPasteles] = useState<PastelPersonalizado[]>([])
  const [selectedPastel, setSelectedPastel] = useState<PastelPersonalizado | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [filterEstado, setFilterEstado] = useState<string>('todos')

  useEffect(() => {
    fetchPasteles()
  }, [])

  const fetchPasteles = async () => {
    try {
      const { data, error } = await supabase
        .from('pasteles_personalizados')
        .select(`
          *,
          tamano:tamanos_pastel(nombre),
          sabor:sabores_pastel(nombre),
          relleno:rellenos_pastel(nombre),
          decoracion:decoraciones_pastel(nombre)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching pasteles:', error)
        toast.error('Error al cargar pasteles personalizados')
        return
      }

      setPasteles(data || [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar pasteles personalizados')
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'En preparación':
        return 'bg-blue-100 text-blue-800'
      case 'Listo':
        return 'bg-green-100 text-green-800'
      case 'Entregado':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return <Clock className="h-4 w-4" />
      case 'En preparación':
        return <Cake className="h-4 w-4" />
      case 'Listo':
        return <CheckCircle className="h-4 w-4" />
      case 'Entregado':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const updateEstadoPastel = async (pastelId: string, nuevoEstado: string) => {
    setLoading(pastelId)
    try {
      console.log('Actualizando estado del pastel:', pastelId, 'a:', nuevoEstado)
      
      const { data, error } = await supabase
        .from('pasteles_personalizados')
        .update({ estado: nuevoEstado })
        .eq('id', pastelId)
        .select()

      console.log('Respuesta de actualización:', { data, error })

      if (error) {
        console.error('Error al actualizar estado:', error)
        throw error
      }

      toast.success('Estado del pastel actualizado')
      fetchPasteles()
      onRefresh()
    } catch (error) {
      console.error('Error completo al actualizar estado:', error)
      toast.error('Error al actualizar el estado')
    } finally {
      setLoading(null)
    }
  }

  const filteredPasteles = pasteles.filter(pastel => {
    if (filterEstado === 'todos') return true
    return pastel.estado === filterEstado
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lista de pasteles */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pasteles Personalizados</CardTitle>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="Pendiente">Pendientes</SelectItem>
                  <SelectItem value="En preparación">En preparación</SelectItem>
                  <SelectItem value="Listo">Listos</SelectItem>
                  <SelectItem value="Entregado">Entregados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPasteles.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay pasteles personalizados registrados
                </p>
              ) : (
                filteredPasteles.map((pastel) => (
                  <div
                    key={pastel.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedPastel(pastel)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Cake className="h-5 w-5 text-brand-primary" />
                        <div>
                          <h3 className="font-medium">{pastel.nombre_cliente}</h3>
                          <p className="text-sm text-gray-600">
                            {pastel.tamano?.nombre} - {pastel.sabor?.nombre}
                          </p>
                          <p className="text-xs text-gray-500">
                            Entrega: {new Date(pastel.fecha_entrega).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-bold text-brand-primary">${pastel.precio_total}</p>
                        <Badge className={getEstadoColor(pastel.estado)}>
                          {getEstadoIcon(pastel.estado)}
                          <span className="ml-1">{pastel.estado}</span>
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedPastel(pastel)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalles del pastel */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Pastel</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPastel ? (
              <div className="space-y-4">
                {/* Información del cliente */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Información del Cliente
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nombre:</strong> {selectedPastel.nombre_cliente}</p>
                    <p><strong>Teléfono:</strong> {selectedPastel.telefono}</p>
                    <p><strong>Email:</strong> {selectedPastel.email}</p>
                  </div>
                </div>

                {/* Detalles del pastel */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Cake className="h-4 w-4 mr-2" />
                    Especificaciones del Pastel
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Tamaño:</strong> {selectedPastel.tamano?.nombre}</p>
                    <p><strong>Sabor:</strong> {selectedPastel.sabor?.nombre}</p>
                    <p><strong>Relleno:</strong> {selectedPastel.relleno?.nombre}</p>
                    <p><strong>Decoración:</strong> {selectedPastel.decoracion?.nombre}</p>
                  </div>
                </div>

                {/* Entrega */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Información de Entrega
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Fecha:</strong> {new Date(selectedPastel.fecha_entrega).toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> {selectedPastel.hora_entrega || 'No especificada'}</p>
                  </div>
                </div>

                {/* Precio */}
                <div>
                  <h3 className="font-semibold mb-2">Precio</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Precio base:</strong> ${selectedPastel.precio_base}</p>
                    <p><strong>Precio adicional:</strong> ${selectedPastel.precio_adicional}</p>
                    <p className="text-lg font-bold text-brand-primary">
                      <strong>Total:</strong> ${selectedPastel.precio_total}
                    </p>
                  </div>
                </div>

                {/* Notas */}
                {selectedPastel.notas && (
                  <div>
                    <h3 className="font-semibold mb-2">Notas Especiales</h3>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">
                      {selectedPastel.notas}
                    </p>
                  </div>
                )}

                {/* Estado actual */}
                <div>
                  <h3 className="font-semibold mb-2">Estado Actual</h3>
                  <Badge className={getEstadoColor(selectedPastel.estado)}>
                    {getEstadoIcon(selectedPastel.estado)}
                    <span className="ml-1">{selectedPastel.estado}</span>
                  </Badge>
                </div>

                {/* Cambiar estado */}
                <div>
                  <h3 className="font-semibold mb-2">Cambiar Estado</h3>
                  <div className="space-y-2">
                    <Select
                      onValueChange={(value) => updateEstadoPastel(selectedPastel.id, value)}
                      disabled={loading === selectedPastel.id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar nuevo estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="En preparación">En preparación</SelectItem>
                        <SelectItem value="Listo">Listo</SelectItem>
                        <SelectItem value="Entregado">Entregado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Fecha de creación */}
                <div className="text-xs text-gray-500 pt-2 border-t">
                  Creado: {new Date(selectedPastel.created_at).toLocaleDateString()}
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Selecciona un pastel para ver los detalles
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 