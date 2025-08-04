-- Script para arreglar el trigger de updated_at
-- El problema es que el trigger está intentando actualizar un campo que no existe

-- 1. Eliminar el trigger problemático
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON public.usuarios;

-- 2. Verificar si la columna updated_at existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'updated_at'
    ) THEN
        -- Agregar la columna updated_at si no existe
        ALTER TABLE public.usuarios ADD COLUMN updated_at timestamp with time zone DEFAULT now();
        RAISE NOTICE 'Columna updated_at agregada a la tabla usuarios';
    ELSE
        RAISE NOTICE 'La columna updated_at ya existe en la tabla usuarios';
    END IF;
END $$;

-- 3. Recrear el trigger correctamente
CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON public.usuarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Verificar que el trigger se creó correctamente
DO $$
BEGIN
    RAISE NOTICE 'Trigger de updated_at arreglado exitosamente.';
END $$; 