-- Script simple para arreglar la tabla pedidos
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar la estructura actual
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'pedidos' 
ORDER BY ordinal_position;

-- 2. Agregar solo las columnas faltantes
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS cliente_nombre TEXT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS cliente_telefono TEXT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS cliente_direccion TEXT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS usuario_id UUID;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS items JSONB;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS id_pago_mp TEXT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Verificar la estructura final
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'pedidos' 
ORDER BY ordinal_position; 