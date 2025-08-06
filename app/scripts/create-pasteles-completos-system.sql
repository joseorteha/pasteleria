-- =====================================================
-- SISTEMA DE PASTELES COMPLETOS
-- =====================================================

-- Tabla de categorías de pasteles
CREATE TABLE IF NOT EXISTS public.categorias_pasteles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de pasteles completos
CREATE TABLE IF NOT EXISTS public.pasteles_completos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  categoria_id INT REFERENCES public.categorias_pasteles(id),
  imagen_url TEXT,
  ingredientes TEXT[],
  destacado BOOLEAN DEFAULT false,
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insertar categorías iniciales
INSERT INTO public.categorias_pasteles (nombre, descripcion) VALUES
('Chocolate', 'Pasteles elaborados con chocolate premium'),
('Tres Leches', 'Tradicionales pasteles tres leches'),
('Vainilla', 'Clásicos pasteles de vainilla'),
('Frutas', 'Pasteles con frutas frescas'),
('Red Velvet', 'Elegantes pasteles red velvet'),
('Café', 'Pasteles con sabor a café'),
('Cítricos', 'Pasteles refrescantes de limón'),
('Chocolate Blanco', 'Deliciosos pasteles de chocolate blanco')
ON CONFLICT DO NOTHING;

-- Insertar pasteles completos iniciales
INSERT INTO public.pasteles_completos (nombre, descripcion, precio, categoria_id, imagen_url, ingredientes, destacado) VALUES
(
  'Pastel de Chocolate Clásico',
  'Delicioso pastel de chocolate con cobertura suave y decoraciones elegantes de chocolate. Perfecto para cualquier celebración.',
  450,
  (SELECT id FROM categorias_pasteles WHERE nombre = 'Chocolate'),
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop',
  ARRAY['Chocolate premium', 'Crema de mantequilla', 'Decoraciones de chocolate'],
  true
),
(
  'Pastel Tres Leches Decorado',
  'Tradicional pastel tres leches con crema batida y frutas frescas. Decorado con flores comestibles y frutos rojos.',
  520,
  (SELECT id FROM categorias_pasteles WHERE nombre = 'Tres Leches'),
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=500&fit=crop',
  ARRAY['Leche evaporada', 'Leche condensada', 'Crema batida', 'Frutas frescas'],
  true
),
(
  'Pastel de Vainilla con Flores',
  'Elegante pastel de vainilla con cobertura suave y decoraciones florales comestibles. Ideal para bodas y eventos especiales.',
  480,
  (SELECT id FROM categorias_pasteles WHERE nombre = 'Vainilla'),
  'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=500&h=500&fit=crop',
  ARRAY['Vainilla natural', 'Crema de mantequilla', 'Flores comestibles'],
  false
),
(
  'Pastel de Frutas Frescas',
  'Refrescante pastel con crema chantilly y una variedad de frutas frescas de temporada. Decorado con frutos rojos y kiwi.',
  550,
  (SELECT id FROM categorias_pasteles WHERE nombre = 'Frutas'),
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=500&fit=crop',
  ARRAY['Crema chantilly', 'Fresas', 'Kiwi', 'Uvas', 'Duraznos'],
  false
),
(
  'Pastel Red Velvet',
  'Clásico pastel red velvet con su característico color rojo y cobertura de queso crema. Decorado con rosas de crema.',
  580,
  (SELECT id FROM categorias_pasteles WHERE nombre = 'Red Velvet'),
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop',
  ARRAY['Cacao', 'Colorante rojo', 'Queso crema', 'Decoraciones de crema'],
  true
),
(
  'Pastel de Café y Caramelo',
  'Delicioso pastel de café con relleno de caramelo y cobertura de chocolate. Decorado con granos de café y caramelo líquido.',
  520,
  (SELECT id FROM categorias_pasteles WHERE nombre = 'Café'),
  'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=500&h=500&fit=crop',
  ARRAY['Café espresso', 'Caramelo', 'Chocolate', 'Granos de café'],
  false
),
(
  'Pastel de Limón con Merengue',
  'Refrescante pastel de limón con merengue italiano y decoraciones cítricas. Perfecto para días calurosos.',
  480,
  (SELECT id FROM categorias_pasteles WHERE nombre = 'Cítricos'),
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop',
  ARRAY['Limón fresco', 'Merengue italiano', 'Ralladura de limón'],
  false
),
(
  'Pastel de Chocolate Blanco y Frambuesas',
  'Elegante pastel de chocolate blanco con frambuesas frescas y decoraciones de chocolate blanco. Ideal para eventos románticos.',
  600,
  (SELECT id FROM categorias_pasteles WHERE nombre = 'Chocolate Blanco'),
  'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=500&h=500&fit=crop',
  ARRAY['Chocolate blanco', 'Frambuesas frescas', 'Crema de mantequilla'],
  true
)
ON CONFLICT DO NOTHING;

-- Habilitar RLS
ALTER TABLE public.categorias_pasteles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pasteles_completos ENABLE ROW LEVEL SECURITY;

-- Políticas para categorías (lectura pública)
CREATE POLICY "Categorías públicas para lectura" ON public.categorias_pasteles 
FOR SELECT USING (true);

-- Políticas para pasteles completos (lectura pública)
CREATE POLICY "Pasteles completos públicos para lectura" ON public.pasteles_completos 
FOR SELECT USING (true);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_pasteles_completos_updated_at 
    BEFORE UPDATE ON public.pasteles_completos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_pasteles_completos_categoria ON public.pasteles_completos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_pasteles_completos_destacado ON public.pasteles_completos(destacado);
CREATE INDEX IF NOT EXISTS idx_pasteles_completos_disponible ON public.pasteles_completos(disponible); 