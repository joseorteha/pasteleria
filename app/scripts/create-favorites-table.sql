-- Crear tabla de favoritos
CREATE TABLE IF NOT EXISTS favoritos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  producto_id TEXT REFERENCES productos(id) ON DELETE CASCADE,
  fecha_agregado TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, producto_id)
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_favoritos_usuario_id ON favoritos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_producto_id ON favoritos(producto_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_fecha ON favoritos(fecha_agregado DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Usuarios autenticados pueden ver sus propios favoritos
CREATE POLICY "Usuarios pueden ver sus favoritos" ON favoritos
  FOR SELECT USING (auth.uid() = usuario_id);

-- Usuarios autenticados pueden agregar sus propios favoritos
CREATE POLICY "Usuarios pueden agregar favoritos" ON favoritos
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Usuarios autenticados pueden eliminar sus propios favoritos
CREATE POLICY "Usuarios pueden eliminar favoritos" ON favoritos
  FOR DELETE USING (auth.uid() = usuario_id);

-- Función para obtener favoritos de un usuario
CREATE OR REPLACE FUNCTION get_user_favorites(user_uuid UUID)
RETURNS TABLE(producto_id TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT f.producto_id
  FROM favoritos f
  WHERE f.usuario_id = user_uuid
  ORDER BY f.fecha_agregado DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 