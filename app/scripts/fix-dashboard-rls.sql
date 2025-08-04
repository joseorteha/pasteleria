-- Script para arreglar las políticas RLS del dashboard
-- Ejecutar en Supabase SQL Editor

-- 1. Políticas permisivas para pedidos (para que el admin pueda ver todos)
DROP POLICY IF EXISTS "Admin puede ver todos los pedidos" ON pedidos;
CREATE POLICY "Admin puede ver todos los pedidos" ON pedidos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin puede actualizar pedidos" ON pedidos;
CREATE POLICY "Admin puede actualizar pedidos" ON pedidos
  FOR UPDATE USING (true);

-- 2. Políticas permisivas para productos (para que el admin pueda ver todos)
DROP POLICY IF EXISTS "Admin puede ver todos los productos" ON productos;
CREATE POLICY "Admin puede ver todos los productos" ON productos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin puede actualizar productos" ON productos;
CREATE POLICY "Admin puede actualizar productos" ON productos
  FOR UPDATE USING (true);

-- 3. Políticas permisivas para usuarios (para que el admin pueda ver todos)
DROP POLICY IF EXISTS "Admin puede ver todos los usuarios" ON usuarios;
CREATE POLICY "Admin puede ver todos los usuarios" ON usuarios
  FOR SELECT USING (true);

-- 4. Verificar que las políticas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('pedidos', 'productos', 'usuarios')
ORDER BY tablename, policyname; 