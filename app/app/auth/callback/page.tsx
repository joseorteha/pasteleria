'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error en callback:', error)
          setError(error.message)
          setStatus('error')
          return
        }

        if (data.session) {
          console.log('Sesión establecida:', data.session)
          
          // Verificar si el usuario tiene un perfil
          const { data: profileData, error: profileError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', data.session.user.id)
            .single()

          if (profileError && profileError.code === 'PGRST116') {
            // Usuario no tiene perfil, crear uno
            const { error: createError } = await supabase
              .from('usuarios')
              .insert([
                {
                  id: data.session.user.id,
                  nombre: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || 'Usuario',
                  email: data.session.user.email,
                  telefono: data.session.user.user_metadata?.phone || '',
                  fecha_registro: new Date().toISOString()
                }
              ])

            if (createError) {
              console.error('Error creando perfil:', createError)
              setError('Error al crear perfil de usuario')
              setStatus('error')
              return
            }
          }

          setStatus('success')
          setTimeout(() => {
            router.push('/perfil')
          }, 2000)
        } else {
          setError('No se pudo establecer la sesión')
          setStatus('error')
        }
      } catch (error) {
        console.error('Error inesperado en callback:', error)
        setError('Error inesperado durante la autenticación')
        setStatus('error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              {status === 'loading' && 'Procesando autenticación...'}
              {status === 'success' && '¡Autenticación exitosa!'}
              {status === 'error' && 'Error de autenticación'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === 'loading' && (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto" />
                <p className="text-gray-600">Estableciendo tu sesión...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <p className="text-gray-600">¡Bienvenido! Redirigiendo a tu perfil...</p>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <XCircle className="h-12 w-12 text-red-500 mx-auto" />
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={() => router.push('/auth/login')}>
                  Volver al login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 