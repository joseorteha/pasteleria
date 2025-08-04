-- Crear tabla de mensajes de contacto
CREATE TABLE IF NOT EXISTS mensajes_contacto (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  asunto TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  estado TEXT DEFAULT 'Nuevo' CHECK (estado IN ('Nuevo', 'Leído', 'Respondido', 'Archivado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_mensajes_contacto_created_at ON mensajes_contacto(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mensajes_contacto_estado ON mensajes_contacto(estado);

-- Habilitar RLS (Row Level Security)
ALTER TABLE mensajes_contacto ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Permitir inserción pública de mensajes
CREATE POLICY "Permitir inserción pública de mensajes" ON mensajes_contacto
  FOR INSERT WITH CHECK (true);

-- Solo administradores pueden leer/actualizar/eliminar
CREATE POLICY "Solo admins pueden leer mensajes" ON mensajes_contacto
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admins pueden actualizar mensajes" ON mensajes_contacto
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admins pueden eliminar mensajes" ON mensajes_contacto
  FOR DELETE USING (auth.role() = 'authenticated');

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_mensajes_contacto_updated_at 
  BEFORE UPDATE ON mensajes_contacto 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 