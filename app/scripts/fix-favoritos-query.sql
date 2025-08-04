-- Script para arreglar la consulta de favoritos
-- El problema es que la relación entre favoritos y productos no está funcionando

-- 1. Verificar que la tabla favoritos existe y tiene la estructura correcta
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'favoritos') THEN
        RAISE NOTICE 'La tabla favoritos no existe. Creándola...';
        
        CREATE TABLE public.favoritos (
          id uuid NOT NULL DEFAULT gen_random_uuid(),
          usuario_id uuid,
          producto_id text,
          fecha_agregado timestamp with time zone DEFAULT now(),
          CONSTRAINT favoritos_pkey PRIMARY KEY (id),
          CONSTRAINT favoritos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id),
          CONSTRAINT favoritos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id)
        );
        
        RAISE NOTICE 'Tabla favoritos creada exitosamente.';
    ELSE
        RAISE NOTICE 'La tabla favoritos ya existe.';
    END IF;
END $$;

-- 2. Crear algunos favoritos de prueba
INSERT INTO public.favoritos (usuario_id, producto_id) 
VALUES 
  ('fc6b6a49-6e53-4627-8285-55bfdbde5d88', '1'),
  ('fc6b6a49-6e53-4627-8285-55bfdbde5d88', '2')
ON CONFLICT DO NOTHING;

-- 3. Verificar que los favoritos se crearon
DO $$
DECLARE
    favorito_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO favorito_count FROM public.favoritos;
    RAISE NOTICE 'Favoritos en BD: %', favorito_count;
END $$; 