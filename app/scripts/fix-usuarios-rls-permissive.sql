-- Script para arreglar las políticas RLS de la tabla usuarios (versión permisiva)
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios datos" ON usuarios;
DROP POLICY IF EXISTS "Usuarios pueden insertar sus propios datos" ON usuarios;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios datos" ON usuarios;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propios datos" ON usuarios;
DROP POLICY IF EXISTS "Política de inserción permisiva" ON usuarios;
DROP POLICY IF EXISTS "Política de selección permisiva" ON usuarios;

-- 2. Crear políticas más permisivas para desarrollo
-- Política para INSERT - permitir inserción durante registro
CREATE POLICY "Política de inserción permisiva" ON usuarios
  FOR INSERT WITH CHECK (true);

-- Política para SELECT - permitir que usuarios vean sus propios datos
CREATE POLICY "Política de selección permisiva" ON usuarios
  FOR SELECT USING (auth.uid() = id OR auth.uid() IS NULL);

-- Política para UPDATE - permitir que usuarios actualicen sus propios datos
CREATE POLICY "Usuarios pueden actualizar sus propios datos" ON usuarios
  FOR UPDATE USING (auth.uid() = id);

-- Política para DELETE - permitir que usuarios eliminen sus propios datos
CREATE POLICY "Usuarios pueden eliminar sus propios datos" ON usuarios
  FOR DELETE USING (auth.uid() = id);

-- 3. Verificar que RLS esté habilitado
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- 4. Verificar las políticas creadas
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'usuarios'
ORDER BY policyname; 