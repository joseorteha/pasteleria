'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  Star, 
  Trash2, 
  Eye,
  Calendar,
  Mail
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Comentario {
  id: string
  nombre: string
  email: string
  calificacion: number
  comentario: string
  created_at: string
}

interface ComentariosTabProps {
  onRefresh: () => void
}

export default function ComentariosTab({ onRefresh }: ComentariosTabProps) {
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedComment, setSelectedComment] = useState<Comentario | null>(null)

  useEffect(() => {
    loadComentarios()
  }, [])

  const loadComentarios = async () => {
    try {
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error cargando comentarios:', error)
        toast.error('Error al cargar comentarios')
      } else {
        setComentarios(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar comentarios')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('comentarios')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error eliminando comentario:', error)
        toast.error('Error al eliminar comentario')
      } else {
        toast.success('Comentario eliminado correctamente')
        loadComentarios()
        onRefresh()
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al eliminar comentario')
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600'
    if (rating >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRatingText = (rating: number) => {
    if (rating >= 4) return 'Excelente'
    if (rating >= 3) return 'Bueno'
    return 'Necesita mejorar'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando comentarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-warm">Gestión de Comentarios</h2>
          <p className="text-muted-foreground">
            Administra los comentarios y calificaciones de los clientes
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {comentarios.length} comentarios
        </Badge>
      </div>

      {/* Comentarios */}
      <div className="grid gap-4">
        {comentarios.length === 0 ? (
          <Card className="shadow-soft border-brand-accent">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <p className="text-muted-foreground">No hay comentarios aún</p>
            </CardContent>
          </Card>
        ) : (
          comentarios.map((comentario) => (
            <Card key={comentario.id} className="shadow-soft border-brand-accent">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div>
                        <h3 className="font-semibold text-brand-warm">{comentario.nombre}</h3>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{comentario.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= comentario.calificacion
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill={star <= comentario.calificacion ? 'currentColor' : 'none'}
                          />
                        ))}
                        <span className={`text-sm font-medium ml-2 ${getRatingColor(comentario.calificacion)}`}>
                          {comentario.calificacion}/5
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <Badge 
                        variant="outline" 
                        className={`${getRatingColor(comentario.calificacion)} border-current`}
                      >
                        {getRatingText(comentario.calificacion)}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-3">{comentario.comentario}</p>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(comentario.created_at).toLocaleDateString('es-MX', {
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
                      onClick={() => setSelectedComment(comentario)}
                      className="border-brand-accent text-brand-warm hover:bg-brand-accent"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteComment(comentario.id)}
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
      {selectedComment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-brand-warm">Detalle del Comentario</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedComment(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-brand-warm">Nombre</label>
                <p className="text-muted-foreground">{selectedComment.nombre}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-brand-warm">Email</label>
                <p className="text-muted-foreground">{selectedComment.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-brand-warm">Calificación</label>
                <div className="flex items-center space-x-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= selectedComment.calificacion
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill={star <= selectedComment.calificacion ? 'currentColor' : 'none'}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {selectedComment.calificacion}/5
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-brand-warm">Comentario</label>
                <p className="text-muted-foreground mt-1">{selectedComment.comentario}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-brand-warm">Fecha</label>
                <p className="text-muted-foreground">
                  {new Date(selectedComment.created_at).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setSelectedComment(null)}
                className="border-brand-accent text-brand-warm"
              >
                Cerrar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleDeleteComment(selectedComment.id)
                  setSelectedComment(null)
                }}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 