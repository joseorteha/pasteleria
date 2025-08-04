
'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User as UserType } from '@supabase/supabase-js'
import { Logo } from './logo'

export default function Navbar() {
  const { items } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Obtener usuario actual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    
    getUser()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const totalItems = items.reduce((total, item) => total + item.cantidad, 0)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-brand-accent bg-brand-cream/95 backdrop-blur-sm shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Logo size="md" className="group-hover:scale-105 transition-transform duration-200" />
            <span className="text-xl font-bold text-brand-warm group-hover:text-brand-primary transition-colors">
              Pastelería Mairim
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-brand-warm hover:text-brand-primary transition-colors font-medium relative group"
            >
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/menu" 
              className="text-brand-warm hover:text-brand-primary transition-colors font-medium relative group"
            >
              Menú
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/contacto" 
              className="text-brand-warm hover:text-brand-primary transition-colors font-medium relative group"
            >
              Contacto
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <Link href="/carrito" className="relative">
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                <ShoppingCart className="h-5 w-5" />
                {mounted && totalItems > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs font-medium"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-3">
                    <Link href="/perfil">
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-gray-100">
                        <User className="h-4 w-4" />
                        <span>Mi Perfil</span>
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Salir</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                        Iniciar Sesión
                      </Button>
                    </Link>
                                <Link href="/auth/registro">
              <Button size="sm" className="bg-brand-primary hover:bg-brand-warm shadow-soft hover:shadow-medium transition-all duration-200">
                Registrarse
              </Button>
            </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link href="/carrito" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {mounted && totalItems > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-brand-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                href="/menu" 
                className="text-gray-700 hover:text-brand-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Menú
              </Link>
              <Link 
                href="/contacto" 
                className="text-gray-700 hover:text-brand-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>
              
              <div className="pt-4 border-t border-gray-200">
                {!loading && (
                  <>
                    {user ? (
                      <div className="flex flex-col space-y-3">
                        <Link href="/perfil">
                          <Button variant="ghost" className="w-full justify-start">
                            <User className="h-4 w-4 mr-2" />
                            Mi Perfil
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          onClick={handleSignOut}
                          className="w-full justify-start"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Salir
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-3">
                        <Link href="/auth/login">
                          <Button variant="ghost" className="w-full justify-start">
                            Iniciar Sesión
                          </Button>
                        </Link>
                        <Link href="/auth/registro">
                          <Button className="w-full justify-start bg-brand-primary hover:bg-brand-primary/90">
                            Registrarse
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
