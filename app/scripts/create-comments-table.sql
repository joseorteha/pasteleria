-- Crear tabla de comentarios
CREATE TABLE IF NOT EXISTS comentarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
  comentario TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_comentarios_created_at ON comentarios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comentarios_calificacion ON comentarios(calificacion);

-- Habilitar RLS (Row Level Security)
ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Permitir lectura pública de comentarios
CREATE POLICY "Permitir lectura pública de comentarios" ON comentarios
  FOR SELECT USING (true);

-- Permitir inserción pública de comentarios
CREATE POLICY "Permitir inserción pública de comentarios" ON comentarios
  FOR INSERT WITH CHECK (true);

-- Solo administradores pueden actualizar/eliminar
CREATE POLICY "Solo admins pueden actualizar comentarios" ON comentarios
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admins pueden eliminar comentarios" ON comentarios
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
CREATE TRIGGER update_comentarios_updated_at 
  BEFORE UPDATE ON comentarios 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 