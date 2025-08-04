-- Script corregido para verificar usuarios en auth.users
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar usuarios en auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC;

-- 2. Verificar usuarios en nuestra tabla usuarios
SELECT 
  id,
  nombre,
  email,
  fecha_registro
FROM usuarios
ORDER BY fecha_registro DESC;

-- 3. Comparar usuarios entre ambas tablas (CORREGIDO)
SELECT 
  u.id as usuarios_id,
  u.nombre,
  u.email as usuarios_email,
  a.email as auth_email,
  a.email_confirmed_at,
  CASE 
    WHEN a.id IS NULL THEN '❌ No existe en auth.users'
    WHEN a.email_confirmed_at IS NULL THEN '⚠️ No confirmado'
    ELSE '✅ Confirmado'
  END as estado
FROM usuarios u
LEFT JOIN auth.users a ON u.email = a.email  -- Cambiado de u.id = a.id a u.email = a.email
ORDER BY u.fecha_registro DESC;

-- 4. Verificar específicamente el usuario que acabas de crear
SELECT 
  'auth.users' as tabla,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'joseortegahac@gmail.com'

UNION ALL

SELECT 
  'usuarios' as tabla,
  id,
  email,
  fecha_registro as email_confirmed_at,
  fecha_registro as created_at
FROM usuarios 
WHERE email = 'joseortegahac@gmail.com'; 