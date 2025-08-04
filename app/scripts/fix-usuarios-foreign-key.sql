-- Script para arreglar la foreign key constraint de la tabla usuarios
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar la foreign key constraint actual
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'usuarios';

-- 2. Eliminar la foreign key constraint problemática
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_id_fkey;

-- 3. Verificar que se eliminó correctamente
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'usuarios';

-- 4. Probar inserción manual nuevamente
INSERT INTO usuarios (id, nombre, email, telefono, fecha_registro)
VALUES (
  gen_random_uuid(), 
  'Usuario de Prueba', 
  'test@example.com', 
  '2721234567', 
  NOW()
);

-- 5. Verificar que se insertó correctamente
SELECT * FROM usuarios ORDER BY fecha_registro DESC LIMIT 5; 