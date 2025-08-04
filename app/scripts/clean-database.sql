-- Script para limpiar la base de datos
-- Mantiene solo la tabla productos y elimina todo lo demás

-- Deshabilitar RLS temporalmente para poder eliminar datos
ALTER TABLE IF EXISTS public.pedidos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.direcciones_usuario DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.favoritos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.comentarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mensajes_contacto DISABLE ROW LEVEL SECURITY;

-- Eliminar todos los datos de las tablas (excepto productos)
DELETE FROM public.pedidos;
DELETE FROM public.usuarios;
DELETE FROM public.direcciones_usuario;
DELETE FROM public.favoritos;
DELETE FROM public.comentarios;
DELETE FROM public.mensajes_contacto;

-- Eliminar las tablas (excepto productos)
DROP TABLE IF EXISTS public.pedidos CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;
DROP TABLE IF EXISTS public.direcciones_usuario CASCADE;
DROP TABLE IF EXISTS public.favoritos CASCADE;
DROP TABLE IF EXISTS public.comentarios CASCADE;
DROP TABLE IF EXISTS public.mensajes_contacto CASCADE;

-- Eliminar funciones y triggers relacionados
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS ensure_single_primary_address() CASCADE;

-- Verificar que solo queda la tabla productos
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Base de datos limpiada. Solo queda la tabla productos.';
END $$; 