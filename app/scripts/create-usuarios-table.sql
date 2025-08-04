-- Crear tabla de usuarios (sin foreign key constraint problemática)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS
CREATE POLICY "Política de inserción permisiva" ON usuarios
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Política de selección permisiva" ON usuarios
  FOR SELECT USING (auth.uid() = id OR auth.uid() IS NULL);

CREATE POLICY "Política de actualización" ON usuarios
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Política de eliminación" ON usuarios
  FOR DELETE USING (auth.uid() = id);

-- Crear función para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION update_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar fecha_actualizacion automáticamente
CREATE TRIGGER trigger_update_fecha_actualizacion
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_fecha_actualizacion(); 