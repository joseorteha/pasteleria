-- Script para renombrar las columnas de la tabla pedidos
-- Ejecutar en Supabase SQL Editor

-- 1. Renombrar estado_pedido a estado
ALTER TABLE pedidos RENAME COLUMN estado_pedido TO estado;

-- 2. Renombrar productos_pedido a items (si no existe ya)
-- Primero verificar si ya existe la columna items
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pedidos' AND column_name = 'items') THEN
        ALTER TABLE pedidos RENAME COLUMN productos_pedido TO items;
    ELSE
        -- Si ya existe items, eliminar productos_pedido
        ALTER TABLE pedidos DROP COLUMN productos_pedido;
    END IF;
END $$;

-- 3. Eliminar datos_cliente ya que tenemos columnas separadas
ALTER TABLE pedidos DROP COLUMN datos_cliente;

-- 4. Verificar la estructura final
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'pedidos' 
ORDER BY ordinal_position; 