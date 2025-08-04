-- Script para confirmar manualmente el email del usuario
-- Ejecutar en Supabase SQL Editor

-- 1. Confirmar el email del usuario manualmente
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'joseortegahac@gmail.com';

-- 2. Verificar que se confirmó
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'joseortegahac@gmail.com';

-- 3. También puedes confirmar otros usuarios si los hay
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- 4. Verificar todos los usuarios confirmados
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
ORDER BY created_at DESC; 