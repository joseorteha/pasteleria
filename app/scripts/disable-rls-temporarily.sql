-- Script para deshabilitar RLS temporalmente
-- Esto permitirá que todo funcione mientras arreglamos las variables de entorno

-- Deshabilitar RLS en todas las tablas
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.direcciones_usuario DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoritos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensajes_contacto DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes
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

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'RLS deshabilitado temporalmente en todas las tablas.';
    RAISE NOTICE 'Todas las políticas han sido eliminadas.';
    RAISE NOTICE 'Esto permitirá que la aplicación funcione mientras arreglamos las variables de entorno.';
END $$; 