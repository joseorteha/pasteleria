-- Script para probar la creación de usuarios
-- Ejecutar en Supabase SQL Editor después de arreglar las políticas RLS

-- 1. Verificar que las políticas estén correctas
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'usuarios'
ORDER BY policyname;

-- 2. Verificar que RLS esté habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'usuarios';

-- 3. Probar inserción manual (solo para testing)
-- NOTA: Esto solo funciona si tienes un usuario autenticado
-- INSERT INTO usuarios (id, nombre, email, telefono, fecha_registro)
-- VALUES (
--   'test-user-id', 
--   'Usuario de Prueba', 
--   'test@example.com', 
--   '2721234567', 
--   NOW()
-- );

-- 4. Verificar estructura de la tabla
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'usuarios'
ORDER BY ordinal_position; 