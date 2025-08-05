'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

export default function TestAuthPage() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Obtener sesión actual
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)

        // Obtener usuario actual
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        console.log('Sesión actual:', session)
        console.log('Usuario actual:', user)
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Estado de Autenticación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Usuario:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {user ? JSON.stringify(user, null, 2) : 'No hay usuario'}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Sesión:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {session ? JSON.stringify(session, null, 2) : 'No hay sesión'}
              </pre>
            </div>

            <div className="flex space-x-4">
              <Button onClick={handleSignOut}>
                Cerrar Sesión
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Recargar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 