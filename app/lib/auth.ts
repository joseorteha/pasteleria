
'use client'

import { supabase } from './supabase'

export const signIn = async (email: string, password: string) => {
  // Verificar credenciales locales para admin
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@pasteleriamairim.com'
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
  
  if (email === adminEmail && password === adminPassword) {
    // Simular usuario admin y guardar en localStorage
    const user = {
      id: 'admin',
      email: adminEmail,
      role: 'admin'
    }
    
    // Guardar sesión en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin-session', JSON.stringify(user))
    }
    
    return { data: { user }, error: null }
  }
  
  // Si no es admin, intentar con Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  // Limpiar sesión local
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin-session')
  }
  
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  // Verificar sesión local primero
  if (typeof window !== 'undefined') {
    const localSession = localStorage.getItem('admin-session')
    if (localSession) {
      const user = JSON.parse(localSession)
      return { user, error: null }
    }
  }
  
  // Si no hay sesión local, verificar Supabase
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const isAdminUser = (email: string | undefined) => {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@pasteleriamairim.com'
  return email === adminEmail || email === 'joseortegahac@gmail.com'
}
