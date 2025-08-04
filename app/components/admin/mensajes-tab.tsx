'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Trash2, 
  Eye,
  Calendar,
  User,
  CheckCircle,
  Clock
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface MensajeContacto {
  id: string
  nombre: string
  email: string
  telefono: string | null
  asunto: string
  mensaje: string
  estado: string
  created_at: string
}

interface MensajesTabProps {
  onRefresh: () => void
}

export default function MensajesTab({ onRefresh }: MensajesTabProps) {
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMensaje, setSelectedMensaje] = useState<MensajeContacto | null>(null)

  useEffect(() => {
    loadMensajes()
  }, [])

  const loadMensajes = async () => {
    try {
      const { data, error } = await supabase
        .from('mensajes_contacto')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error cargando mensajes:', error)
        toast.error('Error al cargar mensajes')
      } else {
        setMensajes(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar mensajes')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMensaje = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('mensajes_contacto')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error eliminando mensaje:', error)
        toast.error('Error al eliminar mensaje')
      } else {
        toast.success('Mensaje eliminado correctamente')
        loadMensajes()
        onRefresh()
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al eliminar mensaje')
    }
  }

  const handleUpdateEstado = async (id: string, nuevoEstado: string) => {
    try {
      const { error } = await supabase
        .from('mensajes_contacto')
        .update({ estado: nuevoEstado })
        .eq('id', id)

      if (error) {
        console.error('Error actualizando estado:', error)
        toast.error('Error al actualizar estado')
      } else {
        toast.success('Estado actualizado correctamente')
        loadMensajes()
        onRefresh()
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar estado')
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Nuevo': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Leído': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Respondido': return 'bg-green-100 text-green-800 border-green-200'
      case 'Archivado': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Nuevo': return <Clock className="h-4 w-4" />
      case 'Leído': return <Eye className="h-4 w-4" />
      case 'Respondido': return <CheckCircle className="h-4 w-4" />
      case 'Archivado': return <MessageSquare className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando mensajes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-warm">Gestión de Mensajes</h2>
          <p className="text-muted-foreground">
            Administra los mensajes de contacto de los clientes
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {mensajes.length} mensajes
        </Badge>
      </div>

      {/* Mensajes */}
      <div className="grid gap-4">
        {mensajes.length === 0 ? (
          <Card className="shadow-soft border-brand-accent">
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <p className="text-muted-foreground">No hay mensajes aún</p>
            </CardContent>
          </Card>
        ) : (
          mensajes.map((mensaje) => (
            <Card key={mensaje.id} className="shadow-soft border-brand-accent">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div>
                        <h3 className="font-semibold text-brand-warm">{mensaje.nombre}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{mensaje.email}</span>
                          </div>
                          {mensaje.telefono && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{mensaje.telefono}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getEstadoColor(mensaje.estado)} flex items-center space-x-1`}
                      >
                        {getEstadoIcon(mensaje.estado)}
                        <span>{mensaje.estado}</span>
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="font-medium text-brand-warm mb-1">{mensaje.asunto}</h4>
                      <p className="text-muted-foreground text-sm line-clamp-2">{mensaje.mensaje}</p>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(mensaje.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMensaje(mensaje)}
                      className="border-brand-accent text-brand-warm hover:bg-brand-accent"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMensaje(mensaje.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de detalle */}
      {selectedMensaje && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-brand-warm">Detalle del Mensaje</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMensaje(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-warm">Nombre</label>
                  <p className="text-muted-foreground">{selectedMensaje.nombre}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-brand-warm">Email</label>
                  <p className="text-muted-foreground">{selectedMensaje.email}</p>
                </div>
              </div>
              
              {selectedMensaje.telefono && (
                <div>
                  <label className="text-sm font-medium text-brand-warm">Teléfono</label>
                  <p className="text-muted-foreground">{selectedMensaje.telefono}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-brand-warm">Asunto</label>
                <p className="text-muted-foreground">{selectedMensaje.asunto}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-brand-warm">Mensaje</label>
                <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{selectedMensaje.mensaje}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-brand-warm">Estado</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge 
                    variant="outline" 
                    className={`${getEstadoColor(selectedMensaje.estado)} flex items-center space-x-1`}
                  >
                    {getEstadoIcon(selectedMensaje.estado)}
                    <span>{selectedMensaje.estado}</span>
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-brand-warm">Fecha</label>
                <p className="text-muted-foreground">
                  {new Date(selectedMensaje.created_at).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateEstado(selectedMensaje.id, 'Leído')}
                  disabled={selectedMensaje.estado === 'Leído'}
                  className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Marcar como Leído
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateEstado(selectedMensaje.id, 'Respondido')}
                  disabled={selectedMensaje.estado === 'Respondido'}
                  className="border-green-200 text-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Marcar como Respondido
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateEstado(selectedMensaje.id, 'Archivado')}
                  disabled={selectedMensaje.estado === 'Archivado'}
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Archivar
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedMensaje(null)}
                  className="border-brand-accent text-brand-warm"
                >
                  Cerrar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleDeleteMensaje(selectedMensaje.id)
                    setSelectedMensaje(null)
                  }}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 