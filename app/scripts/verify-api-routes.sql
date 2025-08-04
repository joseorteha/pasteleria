-- Script para verificar que las rutas de API funcionen correctamente
-- Este script crea algunos datos de prueba para verificar las APIs

-- 1. Crear un usuario de prueba
INSERT INTO public.usuarios (id, nombre, email, telefono, direccion) 
VALUES (
  'test-user-id-123',
  'Usuario de Prueba',
  'test@example.com',
  '2721234567',
  'Dirección de prueba'
) ON CONFLICT (id) DO NOTHING;

-- 2. Crear un pedido de prueba
INSERT INTO public.pedidos (id, total, estado, usuario_id, cliente_nombre, cliente_telefono, cliente_direccion, items) 
VALUES (
  'test-pedido-123',
  150.00,
  'Pendiente',
  'test-user-id-123',
  'Usuario de Prueba',
  '2721234567',
  'Dirección de prueba',
  '[{"id": "1", "nombre": "Conchas Tradicionales", "precio": 18, "cantidad": 2, "imagen_url": "https://example.com/image.jpg"}]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 3. Crear un favorito de prueba
INSERT INTO public.favoritos (usuario_id, producto_id) 
VALUES (
  'test-user-id-123',
  '1'
) ON CONFLICT DO NOTHING;

-- 4. Crear un comentario de prueba
INSERT INTO public.comentarios (nombre, email, calificacion, comentario) 
VALUES (
  'Cliente Satisfecho',
  'cliente@example.com',
  5,
  'Excelente servicio y productos deliciosos!'
);

-- 5. Crear un mensaje de contacto de prueba
INSERT INTO public.mensajes_contacto (nombre, email, telefono, asunto, mensaje) 
VALUES (
  'Cliente Interesado',
  'interesado@example.com',
  '2721234567',
  'Consulta sobre productos',
  'Me gustaría saber más sobre sus productos.'
);

-- 6. Verificar que los datos se crearon correctamente
DO $$
DECLARE
  user_count INTEGER;
  pedido_count INTEGER;
  favorito_count INTEGER;
  comentario_count INTEGER;
  mensaje_count INTEGER;
BEGIN
  -- Contar usuarios
  SELECT COUNT(*) INTO user_count FROM public.usuarios;
  RAISE NOTICE 'Usuarios en BD: %', user_count;
  
  -- Contar pedidos
  SELECT COUNT(*) INTO pedido_count FROM public.pedidos;
  RAISE NOTICE 'Pedidos en BD: %', pedido_count;
  
  -- Contar favoritos
  SELECT COUNT(*) INTO favorito_count FROM public.favoritos;
  RAISE NOTICE 'Favoritos en BD: %', favorito_count;
  
  -- Contar comentarios
  SELECT COUNT(*) INTO comentario_count FROM public.comentarios;
  RAISE NOTICE 'Comentarios en BD: %', comentario_count;
  
  -- Contar mensajes
  SELECT COUNT(*) INTO mensaje_count FROM public.mensajes_contacto;
  RAISE NOTICE 'Mensajes en BD: %', mensaje_count;
  
  RAISE NOTICE 'Datos de prueba creados exitosamente.';
END $$; 