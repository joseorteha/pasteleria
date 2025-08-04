-- Script para probar inserción manual en la tabla usuarios
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar que la tabla existe y tiene la estructura correcta
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'usuarios'
ORDER BY ordinal_position;

-- 2. Probar inserción manual (solo para testing)
-- NOTA: Cambia el UUID por uno único cada vez que ejecutes
INSERT INTO usuarios (id, nombre, email, telefono, fecha_registro)
VALUES (
  gen_random_uuid(), 
  'Usuario de Prueba', 
  'test@example.com', 
  '2721234567', 
  NOW()
);

-- 3. Verificar que se insertó correctamente
SELECT * FROM usuarios ORDER BY fecha_registro DESC LIMIT 5;

-- 4. Limpiar datos de prueba (opcional)
-- DELETE FROM usuarios WHERE email = 'test@example.com'; 