-- Agregar columna usuario_id a la tabla pedidos (permitir NULL para pedidos sin usuario)
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS usuario_id UUID REFERENCES usuarios(id);

-- Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario_id ON pedidos(usuario_id);

-- Políticas RLS para pedidos (solo para usuarios autenticados)
CREATE POLICY "Usuarios pueden ver sus propios pedidos" ON pedidos
  FOR SELECT USING (auth.uid() = usuario_id OR usuario_id IS NULL);

CREATE POLICY "Usuarios pueden insertar sus propios pedidos" ON pedidos
  FOR INSERT WITH CHECK (auth.uid() = usuario_id OR usuario_id IS NULL);

CREATE POLICY "Usuarios pueden actualizar sus propios pedidos" ON pedidos
  FOR UPDATE USING (auth.uid() = usuario_id OR usuario_id IS NULL);

-- Permitir que usuarios no autenticados también puedan crear pedidos
CREATE POLICY "Usuarios no autenticados pueden crear pedidos" ON pedidos
  FOR INSERT WITH CHECK (usuario_id IS NULL); 