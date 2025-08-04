'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Logo } from '@/components/logo'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Intentando iniciar sesión con:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log('Respuesta de auth:', { data, error })

      if (error) {
        console.error('Error de autenticación:', error)
        setError(`Error: ${error.message}`)
      } else if (data?.user) {
        console.log('Usuario autenticado:', data.user)
        // Redirigir al usuario a su perfil o al inicio
        router.push('/perfil')
      } else {
        setError('No se pudo autenticar al usuario')
      }
    } catch (error) {
      console.error('Error inesperado:', error)
      setError('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('Error con Google:', error)
        setError(`Error con Google: ${error.message}`)
      } else {
        console.log('Redirección a Google iniciada')
        // La redirección se maneja automáticamente
      }
    } catch (error) {
      console.error('Error inesperado con Google:', error)
      setError('Error al iniciar sesión con Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header con logo grande */}
        <div className="text-center space-y-6">
          <Link href="/" className="inline-flex items-center text-brand-warm hover:text-brand-primary transition-colors mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
          
          {/* Logo grande */}
          <div className="flex justify-center mb-6">
            <Logo size="lg" className="scale-150" />
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-brand-warm mb-2">Iniciar Sesión</h2>
            <p className="text-muted-foreground">
              Accede a tu cuenta para ver tus pedidos y favoritos
            </p>
          </div>
        </div>

        <Card className="shadow-soft border-brand-accent bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-xl text-brand-warm">Bienvenido de vuelta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-brand-warm font-medium">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="pl-10 border-brand-accent focus:border-brand-primary focus:ring-brand-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-brand-warm font-medium">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    className="pl-10 pr-10 border-brand-accent focus:border-brand-primary focus:ring-brand-primary/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-brand-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-warm text-white shadow-soft hover:shadow-medium transition-all duration-200"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>

              {/* Separador */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-brand-accent" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">O continúa con</span>
                </div>
              </div>

              {/* Botón de Google con colores normales */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-brand-accent hover:bg-brand-accent text-brand-warm hover:text-brand-warm transition-all duration-200"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {loading ? 'Conectando...' : 'Continuar con Google'}
              </Button>

              <div className="text-center space-y-4">
                <Link 
                  href="/auth/recuperar" 
                  className="text-sm text-brand-primary hover:text-brand-warm transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
                
                <div className="text-sm text-muted-foreground">
                  ¿No tienes cuenta?{' '}
                  <Link 
                    href="/auth/registro" 
                    className="text-brand-primary hover:text-brand-warm font-medium transition-colors"
                  >
                    Regístrate aquí
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 