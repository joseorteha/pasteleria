-- Script para arreglar la estructura de la tabla pedidos
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar la estructura actual de la tabla pedidos
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'pedidos' 
ORDER BY ordinal_position;

-- 2. Agregar las columnas faltantes si no existen
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS cliente_nombre TEXT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS cliente_telefono TEXT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS cliente_direccion TEXT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS usuario_id UUID;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS items JSONB;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS id_pago_mp TEXT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Renombrar columnas existentes si es necesario
-- Verificar si existe 'estado_pedido' antes de renombrar
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pedidos' AND column_name = 'estado_pedido') THEN
        ALTER TABLE pedidos RENAME COLUMN estado_pedido TO estado;
    END IF;
END $$;

-- Verificar si existe 'productos_pedido' antes de renombrar
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pedidos' AND column_name = 'productos_pedido') THEN
        ALTER TABLE pedidos RENAME COLUMN productos_pedido TO items;
    END IF;
END $$;

-- Si existe 'datos_cliente', eliminar (ya tenemos columnas separadas)
ALTER TABLE pedidos DROP COLUMN IF EXISTS datos_cliente;

-- 4. Verificar la estructura final
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'pedidos' 
ORDER BY ordinal_position;

-- 5. Actualizar políticas RLS si es necesario
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios pedidos" ON pedidos;
CREATE POLICY "Usuarios pueden ver sus propios pedidos" ON pedidos
  FOR SELECT USING (auth.uid() = usuario_id OR usuario_id IS NULL);

DROP POLICY IF EXISTS "Usuarios pueden insertar sus propios pedidos" ON pedidos;
CREATE POLICY "Usuarios pueden insertar sus propios pedidos" ON pedidos
  FOR INSERT WITH CHECK (auth.uid() = usuario_id OR usuario_id IS NULL);

DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios pedidos" ON pedidos;
CREATE POLICY "Usuarios pueden actualizar sus propios pedidos" ON pedidos
  FOR UPDATE USING (auth.uid() = usuario_id OR usuario_id IS NULL);

DROP POLICY IF EXISTS "Usuarios no autenticados pueden crear pedidos" ON pedidos;
CREATE POLICY "Usuarios no autenticados pueden crear pedidos" ON pedidos
  FOR INSERT WITH CHECK (usuario_id IS NULL); 