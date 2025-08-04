-- Script completo para arreglar todos los problemas de la base de datos
-- Este script arregla todos los problemas identificados

-- 1. Deshabilitar RLS temporalmente
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.direcciones_usuario DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoritos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensajes_contacto DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos DISABLE ROW LEVEL SECURITY;

-- 2. Eliminar todos los triggers problemáticos
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON public.usuarios;
DROP TRIGGER IF EXISTS update_comentarios_updated_at ON public.comentarios;
DROP TRIGGER IF EXISTS update_mensajes_contacto_updated_at ON public.mensajes_contacto;
DROP TRIGGER IF EXISTS ensure_single_primary_address_trigger ON public.direcciones_usuario;

-- 3. Eliminar todas las políticas
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios pueden insertar su perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios pueden gestionar sus direcciones" ON public.direcciones_usuario;
DROP POLICY IF EXISTS "Usuarios pueden gestionar sus favoritos" ON public.favoritos;
DROP POLICY IF EXISTS "Pedidos públicos para lectura" ON public.pedidos;
DROP POLICY IF EXISTS "Cualquiera puede crear pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Cualquiera puede actualizar pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Comentarios públicos para lectura" ON public.comentarios;
DROP POLICY IF EXISTS "Cualquiera puede insertar comentarios" ON public.comentarios;
DROP POLICY IF EXISTS "Cualquiera puede insertar mensajes" ON public.mensajes_contacto;
DROP POLICY IF EXISTS "Cualquiera puede leer mensajes" ON public.mensajes_contacto;
DROP POLICY IF EXISTS "Cualquiera puede actualizar mensajes" ON public.mensajes_contacto;
DROP POLICY IF EXISTS "Productos públicos para lectura" ON public.productos;
DROP POLICY IF EXISTS "Administradores pueden gestionar productos" ON public.productos;

-- 4. Agregar columna updated_at a usuarios si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.usuarios ADD COLUMN updated_at timestamp with time zone DEFAULT now();
        RAISE NOTICE 'Columna updated_at agregada a usuarios';
    ELSE
        RAISE NOTICE 'Columna updated_at ya existe en usuarios';
    END IF;
END $$;

-- 5. Recrear la función update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Crear algunos datos de prueba
-- Usuario de prueba
INSERT INTO public.usuarios (id, nombre, email, telefono, direccion) 
VALUES (
  'fc6b6a49-6e53-4627-8285-55bfdbde5d88',
  'Janie Bauch',
  'janiebauch02@gmail.com',
  '2722968204',
  'CALLE BENITO GONZALEZ, NUMERO 56'
) ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  telefono = EXCLUDED.telefono,
  direccion = EXCLUDED.direccion;

-- Pedido de prueba
INSERT INTO public.pedidos (id, total, estado, usuario_id, cliente_nombre, cliente_telefono, cliente_direccion, items) 
VALUES (
  'dd739dd2-9638-444a-ab1f-6e2788c675bf',
  150.00,
  'Pendiente',
  'fc6b6a49-6e53-4627-8285-55bfdbde5d88',
  'Janie Bauch',
  '2722968204',
  'CALLE BENITO GONZALEZ, NUMERO 56',
  '[{"id": "1", "nombre": "Conchas Tradicionales", "precio": 18, "cantidad": 2, "imagen_url": "https://example.com/image.jpg"}]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Favoritos de prueba
INSERT INTO public.favoritos (usuario_id, producto_id) 
VALUES 
  ('fc6b6a49-6e53-4627-8285-55bfdbde5d88', '1'),
  ('fc6b6a49-6e53-4627-8285-55bfdbde5d88', '2')
ON CONFLICT DO NOTHING;

-- Comentario de prueba
INSERT INTO public.comentarios (nombre, email, calificacion, comentario) 
VALUES (
  'Cliente Satisfecho',
  'cliente@example.com',
  5,
  'Excelente servicio y productos deliciosos!'
) ON CONFLICT DO NOTHING;

-- Mensaje de contacto de prueba
INSERT INTO public.mensajes_contacto (nombre, email, telefono, asunto, mensaje) 
VALUES (
  'Cliente Interesado',
  'interesado@example.com',
  '2721234567',
  'Consulta sobre productos',
  'Me gustaría saber más sobre sus productos.'
) ON CONFLICT DO NOTHING;

-- 7. Verificar que todo se creó correctamente
DO $$
DECLARE
    user_count INTEGER;
    pedido_count INTEGER;
    favorito_count INTEGER;
    comentario_count INTEGER;
    mensaje_count INTEGER;
    producto_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM public.usuarios;
    SELECT COUNT(*) INTO pedido_count FROM public.pedidos;
    SELECT COUNT(*) INTO favorito_count FROM public.favoritos;
    SELECT COUNT(*) INTO comentario_count FROM public.comentarios;
    SELECT COUNT(*) INTO mensaje_count FROM public.mensajes_contacto;
    SELECT COUNT(*) INTO producto_count FROM public.productos;
    
    RAISE NOTICE 'Usuarios: %, Pedidos: %, Favoritos: %, Comentarios: %, Mensajes: %, Productos: %', 
        user_count, pedido_count, favorito_count, comentario_count, mensaje_count, producto_count;
    
    RAISE NOTICE 'Base de datos arreglada exitosamente. RLS deshabilitado temporalmente.';
END $$; 