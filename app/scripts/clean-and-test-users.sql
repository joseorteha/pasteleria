-- Script para limpiar usuarios existentes y probar registro correcto
-- Ejecutar en Supabase SQL Editor

-- 1. Limpiar usuarios existentes (solo para testing)
DELETE FROM usuarios WHERE email IN ('joseortegahac@gmail.com', 'test@example.com');

-- 2. Verificar que se limpiaron
SELECT * FROM usuarios;

-- 3. Verificar usuarios en auth.users (deberían estar vacíos también)
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- 4. Crear un usuario de prueba manualmente en auth.users (solo para testing)
-- NOTA: Esto es solo para testing, normalmente se crea automáticamente
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"nombre": "Usuario de Prueba", "telefono": "2721234567"}'
);

-- 5. Verificar que se creó en auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'test@example.com'; 