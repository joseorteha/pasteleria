-- Script para crear el sistema de pasteles personalizados
-- Este sistema permite a los clientes personalizar sus pasteles

-- 1. Tabla de tamaños de pasteles
CREATE TABLE IF NOT EXISTS public.tamanos_pastel (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  descripcion TEXT,
  precio_base DECIMAL(10,2) NOT NULL,
  porciones_min INT NOT NULL,
  porciones_max INT NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Tabla de sabores de pastel
CREATE TABLE IF NOT EXISTS public.sabores_pastel (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio_adicional DECIMAL(10,2) DEFAULT 0,
  categoria VARCHAR(50) NOT NULL, -- 'chocolate', 'vainilla', 'frutas', 'especiales'
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Tabla de rellenos
CREATE TABLE IF NOT EXISTS public.rellenos_pastel (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio_adicional DECIMAL(10,2) DEFAULT 0,
  categoria VARCHAR(50) NOT NULL, -- 'crema', 'frutas', 'chocolate', 'especiales'
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Tabla de decoraciones
CREATE TABLE IF NOT EXISTS public.decoraciones_pastel (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio_adicional DECIMAL(10,2) DEFAULT 0,
  categoria VARCHAR(50) NOT NULL, -- 'flores', 'figuras', 'texto', 'especiales'
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Tabla de pasteles personalizados
CREATE TABLE IF NOT EXISTS public.pasteles_personalizados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES public.usuarios(id),
  nombre_cliente VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  fecha_entrega DATE NOT NULL,
  hora_entrega TIME,
  notas TEXT,
  
  -- Configuración del pastel
  tamano_id INT REFERENCES public.tamanos_pastel(id),
  sabor_id INT REFERENCES public.sabores_pastel(id),
  relleno_id INT REFERENCES public.rellenos_pastel(id),
  decoracion_id INT REFERENCES public.decoraciones_pastel(id),
  
  -- Precios
  precio_base DECIMAL(10,2) NOT NULL,
  precio_adicional DECIMAL(10,2) DEFAULT 0,
  precio_total DECIMAL(10,2) NOT NULL,
  
  -- Estado
  estado VARCHAR(50) DEFAULT 'Pendiente', -- 'Pendiente', 'En preparación', 'Listo', 'Entregado'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Insertar datos de ejemplo

-- Tamaños de pasteles
INSERT INTO public.tamanos_pastel (nombre, descripcion, precio_base, porciones_min, porciones_max) VALUES
('1/4 de Pastel', 'Ideal para 2-4 personas', 150.00, 2, 4),
('1/2 de Pastel', 'Perfecto para 4-6 personas', 280.00, 4, 6),
('Pastel Completo', 'Para 8-12 personas', 450.00, 8, 12),
('Pastel Grande', 'Para 15-20 personas', 650.00, 15, 20),
('Pastel Extra Grande', 'Para eventos especiales', 850.00, 25, 30);

-- Sabores de pastel
INSERT INTO public.sabores_pastel (nombre, descripcion, precio_adicional, categoria) VALUES
('Chocolate Clásico', 'Chocolate oscuro rico y cremoso', 0.00, 'chocolate'),
('Chocolate Blanco', 'Chocolate blanco suave y dulce', 20.00, 'chocolate'),
('Vainilla', 'Sabor clásico de vainilla', 0.00, 'vainilla'),
('Fresa', 'Sabor natural de fresa', 25.00, 'frutas'),
('Limón', 'Sabor refrescante de limón', 20.00, 'frutas'),
('Café', 'Sabor intenso de café', 30.00, 'especiales'),
('Red Velvet', 'Pastel rojo con sabor único', 40.00, 'especiales'),
('Tres Leches', 'Tradicional tres leches', 35.00, 'especiales');

-- Rellenos
INSERT INTO public.rellenos_pastel (nombre, descripcion, precio_adicional, categoria) VALUES
('Crema Pastelera', 'Crema tradicional', 0.00, 'crema'),
('Chocolate', 'Relleno de chocolate', 25.00, 'chocolate'),
('Fresa', 'Relleno de fresa natural', 30.00, 'frutas'),
('Durazno', 'Relleno de durazno', 25.00, 'frutas'),
('Cajeta', 'Relleno de cajeta', 35.00, 'especiales'),
('Nuez', 'Relleno de nuez', 40.00, 'especiales'),
('Sin Relleno', 'Pastel sin relleno', 0.00, 'crema');

-- Decoraciones
INSERT INTO public.decoraciones_pastel (nombre, descripcion, precio_adicional, categoria) VALUES
('Flores de Fondant', 'Flores decorativas de fondant', 50.00, 'flores'),
('Figuras de Fondant', 'Figuras personalizadas', 80.00, 'figuras'),
('Texto Personalizado', 'Texto en el pastel', 30.00, 'texto'),
('Frutas Frescas', 'Decoración con frutas', 40.00, 'especiales'),
('Chocolate Decorativo', 'Diseños en chocolate', 45.00, 'especiales'),
('Sin Decoración', 'Pastel simple', 0.00, 'especiales');

-- 7. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_pasteles_personalizados_usuario_id ON public.pasteles_personalizados(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pasteles_personalizados_estado ON public.pasteles_personalizados(estado);
CREATE INDEX IF NOT EXISTS idx_pasteles_personalizados_fecha_entrega ON public.pasteles_personalizados(fecha_entrega);

-- 8. Habilitar RLS
ALTER TABLE public.tamanos_pastel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sabores_pastel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rellenos_pastel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decoraciones_pastel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pasteles_personalizados ENABLE ROW LEVEL SECURITY;

-- 9. Políticas RLS
-- Políticas para catálogos (lectura pública)
CREATE POLICY "Catálogos públicos para lectura" ON public.tamanos_pastel FOR SELECT USING (true);
CREATE POLICY "Catálogos públicos para lectura" ON public.sabores_pastel FOR SELECT USING (true);
CREATE POLICY "Catálogos públicos para lectura" ON public.rellenos_pastel FOR SELECT USING (true);
CREATE POLICY "Catálogos públicos para lectura" ON public.decoraciones_pastel FOR SELECT USING (true);

-- Políticas para pasteles personalizados
CREATE POLICY "Usuarios pueden crear pasteles personalizados" ON public.pasteles_personalizados FOR INSERT WITH CHECK (auth.uid() = usuario_id OR auth.uid() IS NULL);
CREATE POLICY "Usuarios pueden ver sus pasteles personalizados" ON public.pasteles_personalizados FOR SELECT USING (auth.uid() = usuario_id OR auth.uid() IS NULL);
CREATE POLICY "Usuarios pueden actualizar sus pasteles personalizados" ON public.pasteles_personalizados FOR UPDATE USING (auth.uid() = usuario_id);

-- 10. Función para calcular precio total
CREATE OR REPLACE FUNCTION calcular_precio_pastel(
  p_tamano_id INT,
  p_sabor_id INT,
  p_relleno_id INT,
  p_decoracion_id INT
) RETURNS DECIMAL AS $$
DECLARE
  precio_base DECIMAL;
  precio_sabor DECIMAL;
  precio_relleno DECIMAL;
  precio_decoracion DECIMAL;
BEGIN
  -- Obtener precio base del tamaño
  SELECT precio_base INTO precio_base FROM public.tamanos_pastel WHERE id = p_tamano_id;
  
  -- Obtener precio adicional del sabor
  SELECT COALESCE(precio_adicional, 0) INTO precio_sabor FROM public.sabores_pastel WHERE id = p_sabor_id;
  
  -- Obtener precio adicional del relleno
  SELECT COALESCE(precio_adicional, 0) INTO precio_relleno FROM public.rellenos_pastel WHERE id = p_relleno_id;
  
  -- Obtener precio adicional de la decoración
  SELECT COALESCE(precio_adicional, 0) INTO precio_decoracion FROM public.decoraciones_pastel WHERE id = p_decoracion_id;
  
  RETURN precio_base + precio_sabor + precio_relleno + precio_decoracion;
END;
$$ LANGUAGE plpgsql;

-- 11. Trigger para actualizar precio automáticamente
CREATE OR REPLACE FUNCTION actualizar_precio_pastel() RETURNS TRIGGER AS $$
BEGIN
  NEW.precio_total = calcular_precio_pastel(NEW.tamano_id, NEW.sabor_id, NEW.relleno_id, NEW.decoracion_id);
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_precio_pastel
  BEFORE INSERT OR UPDATE ON public.pasteles_personalizados
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_precio_pastel();

-- 12. Verificar que todo se creó correctamente
DO $$
DECLARE
  tamano_count INTEGER;
  sabor_count INTEGER;
  relleno_count INTEGER;
  decoracion_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO tamano_count FROM public.tamanos_pastel;
  SELECT COUNT(*) INTO sabor_count FROM public.sabores_pastel;
  SELECT COUNT(*) INTO relleno_count FROM public.rellenos_pastel;
  SELECT COUNT(*) INTO decoracion_count FROM public.decoraciones_pastel;
  
  RAISE NOTICE 'Sistema de pasteles creado exitosamente:';
  RAISE NOTICE 'Tamaños: %, Sabores: %, Rellenos: %, Decoraciones: %', 
    tamano_count, sabor_count, relleno_count, decoracion_count;
END $$; 