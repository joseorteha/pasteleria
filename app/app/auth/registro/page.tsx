'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Logo } from '@/components/logo'

export default function RegistroPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      console.log('Iniciando registro con:', formData.email)
      
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre,
            telefono: formData.telefono
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      console.log('Respuesta de signUp:', { authData, authError })

      if (authError) {
        console.error('Error en signUp:', authError)
        setError(authError.message)
        setLoading(false)
        return
      }

      if (!authData.user) {
        setError('Error al crear el usuario en Auth')
        setLoading(false)
        return
      }

      console.log('Usuario creado en Auth:', authData.user)

      // Crear perfil de usuario usando la API route (bypass RLS)
      const profileResponse = await fetch('/api/auth/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: authData.user.id,
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono
        })
      })

      const profileResult = await profileResponse.json()

      if (!profileResponse.ok) {
        console.error('Error creating profile:', profileResult)
        setError(`Error al crear perfil: ${profileResult.error}`)
        setLoading(false)
        return
      }

      console.log('Perfil creado exitosamente')

      setSuccess('¡Cuenta creada exitosamente! Revisa tu email para confirmar tu cuenta.')
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (error) {
      console.error('Error inesperado en registro:', error)
      setError('Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

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
        setSuccess('Redirigiendo a Google...')
        // La redirección se maneja automáticamente
      }
    } catch (error) {
      console.error('Error inesperado con Google:', error)
      setError('Error al registrar con Google')
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
            <h2 className="text-3xl font-bold text-brand-warm mb-2">Crear Cuenta</h2>
            <p className="text-muted-foreground">
              Únete a Pastelería Mairim para disfrutar de todos nuestros productos
            </p>
          </div>
        </div>

        <Card className="shadow-soft border-brand-accent bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-xl text-brand-warm">Regístrate gratis</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-brand-warm font-medium">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="pl-10 border-brand-accent focus:border-brand-primary focus:ring-brand-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-brand-warm font-medium">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="pl-10 border-brand-accent focus:border-brand-primary focus:ring-brand-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-brand-warm font-medium">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="272 123 4567"
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
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-brand-warm font-medium">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    className="pl-10 pr-10 border-brand-accent focus:border-brand-primary focus:ring-brand-primary/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-brand-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

                          <Button
                            type="submit"
                            className="w-full bg-brand-primary hover:bg-brand-warm text-white shadow-soft hover:shadow-medium transition-all duration-200"
                            disabled={loading}
                          >
                            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                          </Button>

                          {/* Separador */}
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t border-brand-accent" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-white px-2 text-muted-foreground">O regístrate con</span>
                            </div>
                          </div>

                          {/* Botón de Google con colores normales */}
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full border-brand-accent hover:bg-brand-accent text-brand-warm hover:text-brand-warm transition-all duration-200"
                            onClick={handleGoogleSignUp}
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
                            {loading ? 'Conectando...' : 'Registrarse con Google'}
                          </Button>

              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?{' '}
                  <Link 
                    href="/auth/login" 
                    className="text-brand-primary hover:text-brand-warm font-medium transition-colors"
                  >
                    Inicia sesión aquí
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