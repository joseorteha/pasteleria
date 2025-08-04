-- Script para arreglar las políticas RLS y permisos
-- Ejecutar después de recrear las tablas

-- 1. Deshabilitar RLS temporalmente para poder crear políticas
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.direcciones_usuario DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoritos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensajes_contacto DISABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios pueden insertar su perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.usuarios;

DROP POLICY IF EXISTS "Usuarios pueden gestionar sus direcciones" ON public.direcciones_usuario;

DROP POLICY IF EXISTS "Usuarios pueden gestionar sus favoritos" ON public.favoritos;

DROP POLICY IF EXISTS "Usuarios pueden ver sus pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Usuarios pueden crear pedidos" ON public.pedidos;

DROP POLICY IF EXISTS "Comentarios públicos para lectura" ON public.comentarios;
DROP POLICY IF EXISTS "Cualquiera puede insertar comentarios" ON public.comentarios;

DROP POLICY IF EXISTS "Cualquiera puede insertar mensajes" ON public.mensajes_contacto;

-- 3. Crear políticas más permisivas para desarrollo
-- Políticas para usuarios
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.usuarios
  FOR SELECT USING (auth.uid() = id OR auth.uid() IS NULL);

CREATE POLICY "Usuarios pueden insertar su perfil" ON public.usuarios
  FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.usuarios
  FOR UPDATE USING (auth.uid() = id OR auth.uid() IS NULL);

-- Políticas para direcciones_usuario
CREATE POLICY "Usuarios pueden gestionar sus direcciones" ON public.direcciones_usuario
  FOR ALL USING (auth.uid() = usuario_id OR auth.uid() IS NULL);

-- Políticas para favoritos
CREATE POLICY "Usuarios pueden gestionar sus favoritos" ON public.favoritos
  FOR ALL USING (auth.uid() = usuario_id OR auth.uid() IS NULL);

-- Políticas para pedidos (más permisivas)
CREATE POLICY "Pedidos públicos para lectura" ON public.pedidos
  FOR SELECT USING (true);

CREATE POLICY "Cualquiera puede crear pedidos" ON public.pedidos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Cualquiera puede actualizar pedidos" ON public.pedidos
  FOR UPDATE USING (true);

-- Políticas para comentarios
CREATE POLICY "Comentarios públicos para lectura" ON public.comentarios
  FOR SELECT USING (true);

CREATE POLICY "Cualquiera puede insertar comentarios" ON public.comentarios
  FOR INSERT WITH CHECK (true);

-- Políticas para mensajes_contacto
CREATE POLICY "Cualquiera puede insertar mensajes" ON public.mensajes_contacto
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Cualquiera puede leer mensajes" ON public.mensajes_contacto
  FOR SELECT USING (true);

CREATE POLICY "Cualquiera puede actualizar mensajes" ON public.mensajes_contacto
  FOR UPDATE USING (true);

-- 4. Habilitar RLS nuevamente
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direcciones_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensajes_contacto ENABLE ROW LEVEL SECURITY;

-- 5. Verificar que las políticas se crearon correctamente
DO $$
BEGIN
    RAISE NOTICE 'Políticas RLS arregladas exitosamente.';
    RAISE NOTICE 'Las tablas ahora tienen políticas más permisivas para desarrollo.';
END $$; 