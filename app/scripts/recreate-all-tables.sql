-- Script para recrear todas las tablas desde cero
-- Ejecutar después de clean-database.sql

-- 1. Tabla usuarios
CREATE TABLE public.usuarios (
  id uuid NOT NULL,
  nombre character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  telefono character varying,
  direccion text,
  fecha_registro timestamp with time zone DEFAULT now(),
  fecha_actualizacion timestamp with time zone DEFAULT now(),
  activo boolean DEFAULT true,
  CONSTRAINT usuarios_pkey PRIMARY KEY (id)
);

-- 2. Tabla direcciones_usuario
CREATE TABLE public.direcciones_usuario (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid,
  nombre character varying NOT NULL,
  direccion text NOT NULL,
  ciudad character varying DEFAULT 'Orizaba'::character varying,
  estado character varying DEFAULT 'Veracruz'::character varying,
  codigo_postal character varying,
  es_principal boolean DEFAULT false,
  fecha_creacion timestamp with time zone DEFAULT now(),
  CONSTRAINT direcciones_usuario_pkey PRIMARY KEY (id),
  CONSTRAINT direcciones_usuario_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id)
);

-- 3. Tabla favoritos
CREATE TABLE public.favoritos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid,
  producto_id text,
  fecha_agregado timestamp with time zone DEFAULT now(),
  CONSTRAINT favoritos_pkey PRIMARY KEY (id),
  CONSTRAINT favoritos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id),
  CONSTRAINT favoritos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id)
);

-- 4. Tabla pedidos
CREATE TABLE public.pedidos (
  id text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  total numeric NOT NULL,
  estado text DEFAULT 'Pendiente'::text,
  id_pago_mp text,
  usuario_id uuid,
  cliente_nombre text,
  cliente_telefono text,
  cliente_direccion text,
  items jsonb,
  fecha_creacion timestamp with time zone DEFAULT now(),
  CONSTRAINT pedidos_pkey PRIMARY KEY (id),
  CONSTRAINT pedidos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id)
);

-- 5. Tabla comentarios
CREATE TABLE public.comentarios (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL,
  calificacion integer NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
  comentario text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT comentarios_pkey PRIMARY KEY (id)
);

-- 6. Tabla mensajes_contacto
CREATE TABLE public.mensajes_contacto (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text,
  asunto text NOT NULL,
  mensaje text NOT NULL,
  estado text DEFAULT 'Nuevo'::text CHECK (estado = ANY (ARRAY['Nuevo'::text, 'Leído'::text, 'Respondido'::text, 'Archivado'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT mensajes_contacto_pkey PRIMARY KEY (id)
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_usuarios_email ON public.usuarios(email);
CREATE INDEX idx_usuarios_activo ON public.usuarios(activo);
CREATE INDEX idx_direcciones_usuario_id ON public.direcciones_usuario(usuario_id);
CREATE INDEX idx_favoritos_usuario_id ON public.favoritos(usuario_id);
CREATE INDEX idx_favoritos_producto_id ON public.favoritos(producto_id);
CREATE INDEX idx_pedidos_usuario_id ON public.pedidos(usuario_id);
CREATE INDEX idx_pedidos_estado ON public.pedidos(estado);
CREATE INDEX idx_comentarios_calificacion ON public.comentarios(calificacion);
CREATE INDEX idx_mensajes_contacto_estado ON public.mensajes_contacto(estado);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direcciones_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensajes_contacto ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para usuarios
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden insertar su perfil" ON public.usuarios
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.usuarios
  FOR UPDATE USING (auth.uid() = id);

-- Políticas RLS para direcciones_usuario
CREATE POLICY "Usuarios pueden gestionar sus direcciones" ON public.direcciones_usuario
  FOR ALL USING (auth.uid() = usuario_id);

-- Políticas RLS para favoritos
CREATE POLICY "Usuarios pueden gestionar sus favoritos" ON public.favoritos
  FOR ALL USING (auth.uid() = usuario_id);

-- Políticas RLS para pedidos
CREATE POLICY "Usuarios pueden ver sus pedidos" ON public.pedidos
  FOR SELECT USING (auth.uid() = usuario_id OR usuario_id IS NULL);

CREATE POLICY "Usuarios pueden crear pedidos" ON public.pedidos
  FOR INSERT WITH CHECK (auth.uid() = usuario_id OR usuario_id IS NULL);

-- Políticas RLS para comentarios
CREATE POLICY "Comentarios públicos para lectura" ON public.comentarios
  FOR SELECT USING (true);

CREATE POLICY "Cualquiera puede insertar comentarios" ON public.comentarios
  FOR INSERT WITH CHECK (true);

-- Políticas RLS para mensajes_contacto
CREATE POLICY "Cualquiera puede insertar mensajes" ON public.mensajes_contacto
  FOR INSERT WITH CHECK (true);

-- Función para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para asegurar una sola dirección principal
CREATE OR REPLACE FUNCTION ensure_single_primary_address()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.es_principal = true THEN
        UPDATE public.direcciones_usuario 
        SET es_principal = false 
        WHERE usuario_id = NEW.usuario_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON public.usuarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comentarios_updated_at 
    BEFORE UPDATE ON public.comentarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mensajes_contacto_updated_at 
    BEFORE UPDATE ON public.mensajes_contacto 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER ensure_single_primary_address_trigger
    BEFORE INSERT OR UPDATE ON public.direcciones_usuario
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_primary_address();

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Todas las tablas recreadas exitosamente con RLS y triggers.';
END $$; 