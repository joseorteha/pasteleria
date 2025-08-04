-- Script de verificación del sistema
-- Ejecutar en Supabase SQL Editor para verificar que todo esté correcto

-- 1. Verificar que las tablas existan
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('usuarios', 'direcciones_usuario', 'favoritos', 'pedidos', 'productos') 
    THEN '✅ EXISTE' 
    ELSE '❌ FALTANTE' 
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('usuarios', 'direcciones_usuario', 'favoritos', 'pedidos', 'productos')
ORDER BY table_name;

-- 2. Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('usuarios', 'direcciones_usuario', 'favoritos', 'pedidos', 'productos')
ORDER BY tablename, policyname;

-- 3. Verificar que RLS esté habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('usuarios', 'direcciones_usuario', 'favoritos', 'pedidos', 'productos')
ORDER BY tablename;

-- 4. Verificar funciones y triggers
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('update_fecha_actualizacion', 'ensure_single_primary_address')
ORDER BY routine_name;

-- 5. Verificar triggers
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND event_object_table IN ('usuarios', 'direcciones_usuario')
ORDER BY event_object_table, trigger_name;

-- 6. Verificar índices
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('usuarios', 'direcciones_usuario', 'favoritos', 'pedidos', 'productos')
ORDER BY tablename, indexname; 