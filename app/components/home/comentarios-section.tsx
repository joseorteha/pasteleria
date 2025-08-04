'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Star, Send, MessageCircle, Mail, Calendar } from 'lucide-react'
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

export default function ComentariosSection() {
  const [commentData, setCommentData] = useState({
    nombre: '',
    email: '',
    calificacion: 5,
    comentario: ''
  })
  const [comments, setComments] = useState<Comentario[]>([])
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentLoading, setCommentLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  // Cargar comentarios existentes
  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) {
        console.error('Error cargando comentarios:', error)
      } else {
        setComments(data || [])
      }
    } catch (error) {
      console.error('Error cargando comentarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCommentData(prev => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (rating: number) => {
    setCommentData(prev => ({ ...prev, calificacion: rating }))
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCommentLoading(true)

    try {
      const { error } = await supabase
        .from('comentarios')
        .insert([{
          nombre: commentData.nombre,
          email: commentData.email,
          calificacion: commentData.calificacion,
          comentario: commentData.comentario
        }])

      if (error) {
        toast.error('Error al enviar el comentario')
        console.error('Error:', error)
      } else {
        toast.success('¡Comentario enviado correctamente!')
        setCommentData({
          nombre: '',
          email: '',
          calificacion: 5,
          comentario: ''
        })
        setShowCommentForm(false)
        loadComments() // Recargar comentarios
      }
    } catch (error) {
      toast.error('Error al enviar el comentario')
      console.error('Error:', error)
    } finally {
      setCommentLoading(false)
    }
  }

  return (
    <section id="comentarios" className="py-16 bg-gradient-to-br from-brand-cream to-brand-accent/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-brand-warm mb-4">
            Comentarios y Recomendaciones
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comparte tu experiencia con nosotros. Tus comentarios nos ayudan a mejorar y servir mejor a nuestra comunidad.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de comentarios */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="shadow-soft border-brand-accent bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-brand-warm">
                  <MessageCircle className="h-5 w-5 mr-2 text-brand-primary" />
                  Deja tu Comentario
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showCommentForm ? (
                  <Button 
                    onClick={() => setShowCommentForm(true)}
                    className="w-full bg-brand-primary hover:bg-brand-warm text-white shadow-soft hover:shadow-medium transition-all duration-200"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Escribir Comentario
                  </Button>
                ) : (
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="comment-nombre" className="text-brand-warm">Nombre *</Label>
                      <Input
                        id="comment-nombre"
                        name="nombre"
                        value={commentData.nombre}
                        onChange={handleCommentChange}
                        required
                        className="mt-1 border-brand-accent focus:border-brand-primary focus:ring-brand-primary/20"
                      />
                    </div>

                    <div>
                      <Label htmlFor="comment-email" className="text-brand-warm">Email *</Label>
                      <Input
                        id="comment-email"
                        name="email"
                        type="email"
                        value={commentData.email}
                        onChange={handleCommentChange}
                        required
                        className="mt-1 border-brand-accent focus:border-brand-primary focus:ring-brand-primary/20"
                      />
                    </div>

                    <div>
                      <Label className="text-brand-warm">Calificación *</Label>
                      <div className="flex space-x-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            className={`p-1 transition-colors ${
                              star <= commentData.calificacion
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            <Star className="h-6 w-6" fill={star <= commentData.calificacion ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {commentData.calificacion} de 5 estrellas
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="comment-texto" className="text-brand-warm">Comentario *</Label>
                      <Textarea
                        id="comment-texto"
                        name="comentario"
                        value={commentData.comentario}
                        onChange={handleCommentChange}
                        required
                        className="mt-1 border-brand-accent focus:border-brand-primary focus:ring-brand-primary/20"
                        rows={3}
                        placeholder="Comparte tu experiencia..."
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-brand-primary hover:bg-brand-warm text-white shadow-soft hover:shadow-medium transition-all duration-200"
                        disabled={commentLoading}
                      >
                        {commentLoading ? 'Enviando...' : 'Enviar Comentario'}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setShowCommentForm(false)}
                        className="border-brand-accent text-brand-warm hover:bg-brand-accent"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Lista de comentarios */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando comentarios...</p>
                  </div>
                </div>
              ) : comments.length === 0 ? (
                <Card className="shadow-soft border-brand-accent">
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-brand-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Sé el primero en dejar un comentario
                    </p>
                  </CardContent>
                </Card>
              ) : (
                comments.map((comment) => (
                  <Card key={comment.id} className="shadow-soft border-brand-accent">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div>
                              <h4 className="font-semibold text-brand-warm">{comment.nombre}</h4>
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{comment.email}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= comment.calificacion
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                  fill={star <= comment.calificacion ? 'currentColor' : 'none'}
                                />
                              ))}
                              <span className="text-sm text-muted-foreground ml-2">
                                {comment.calificacion}/5
                              </span>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-3">{comment.comentario}</p>

                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(comment.created_at).toLocaleDateString('es-MX', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 