-- Actualizar la tabla productos para incluir todos los campos necesarios
-- Primero eliminar la tabla existente y recrearla con la nueva estructura

DROP TABLE IF EXISTS public.productos CASCADE;

CREATE TABLE public.productos (
  id text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  nombre text NOT NULL,
  descripcion text NOT NULL,
  precio numeric NOT NULL,
  imagen_url text NOT NULL,
  categoria text NOT NULL,
  -- Nuevos campos para información detallada
  tiempo_preparacion text,
  porciones text,
  ingredientes text[],
  alergenos text[],
  conservacion text,
  origen text DEFAULT 'Nacional',
  activo boolean DEFAULT true,
  CONSTRAINT productos_pkey PRIMARY KEY (id)
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_productos_categoria ON public.productos(categoria);
CREATE INDEX idx_productos_activo ON public.productos(activo);

-- Insertar los productos reales con información completa
INSERT INTO public.productos (id, nombre, descripcion, precio, imagen_url, categoria, tiempo_preparacion, porciones, ingredientes, alergenos, conservacion, origen) VALUES
('1', 'Conchas Tradicionales', 'Pan dulce mexicano con cobertura en forma de concha, disponible en vainilla, chocolate y fresa. Un clásico de la panadería mexicana.', 18, 'https://imgs.search.brave.com/ge1vv8dtyqmsC1C0GU8OlR_iCr_Fz0XzSl8i6CHZUtY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQx/NDQzMzI1NC9lcy9m/b3RvL2NvbmNoYXMt/cGFuLWR1bGNlLW1l/eGljYW5vLXBhbmFk/ZXIlQzMlQURhLXRy/YWRpY2lvbmFsLWRl/LW0lQzMlQTl4aWNv/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz05WjlYUFZfbExH/dTRycUxDNWdiUExf/bkt5MDJqNDVzLVQ0/X1RBLVlHU1NRPQ', 'Pan Dulce', '2-3 horas', '6-8 piezas', ARRAY['Harina de trigo', 'Azúcar', 'Huevos', 'Mantequilla', 'Leche', 'Vainilla', 'Sal'], ARRAY['Gluten', 'Huevos', 'Lácteos'], 'Conservar en lugar fresco y seco hasta 3 días', 'Nacional'),

('2', 'Pastel Tres Leches', 'Pastel esponjoso bañado en mezcla de tres leches (evaporada, condensada y leche entera), coronado con crema batida.', 65, 'https://imgs.search.brave.com/pkIK7r0lpbKDXoPaI6CIPL1EEP0SIjO0l-xxGwxgY9w/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9kaXJl/Y3RvYWxndXN0by5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjUvMDIvY29tby1w/cmVwYXJhci1lbC1h/dXRlbnRpY28tcGFz/dGVsLXRyZXMtbGVj/aGVzLW1leGljYW5v/LTEwMjR4NTc2Lmpw/Zw', 'Pastel', '4-5 horas', '12 porciones', ARRAY['Harina de trigo', 'Huevos', 'Azúcar', 'Leche evaporada', 'Leche condensada', 'Crema batida', 'Vainilla'], ARRAY['Gluten', 'Huevos', 'Lácteos'], 'Refrigerar hasta 5 días', 'Nacional'),

('3', 'Churros Mexicanos', 'Palitos de masa frita espolvoreados con azúcar y canela, tradicionalmente servidos con chocolate para mojar.', 15, 'https://imgs.search.brave.com/lww0AOsJgxkG4ZalcDAsCJqbRtkGOAL4G1G-AuZrtoE/rs:fit:500:0:1:0/g:ce/aHR0cDovL2VuanVs/aWFuYS5jb20vdHVl/cmVzZWxjaGVmL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE1LzAx/L2NodXJyb3MtY2Fz/ZXJvcy1jb24tYXol/QzMlQkFjYXIteS1j/YW5lbGEuanBn', 'Frito', '45-60 minutos', '8-10 churros', ARRAY['Harina de trigo', 'Agua', 'Aceite vegetal', 'Azúcar', 'Canela', 'Sal'], ARRAY['Gluten'], 'Consumir el mismo día para mejor textura', 'Nacional'),

('4', 'Pan de Muerto', 'Pan tradicional del Día de los Muertos con aroma a flor de naranja, decorado con tiras tipo huesos y recubierto de azúcar.', 35, 'https://imgs.search.brave.com/lIuept_4Bh-2gIsMRnQyhlVEjkcbPn-U0h4N2L4mmVI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG43/LnJlY2V0YXNkZWVz/Y2FuZGFsby5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjEv/MTEvUGFuLWRlLW11/ZXJ0by11bi1kdWxj/ZS10cmFkaWNpb25h/bC1tZXhpY2Fuby5q/cGc', 'Pan Dulce', '3-4 horas', '1 pieza grande', ARRAY['Harina de trigo', 'Huevos', 'Mantequilla', 'Azúcar', 'Agua de azahar', 'Levadura', 'Sal'], ARRAY['Gluten', 'Huevos', 'Lácteos'], 'Conservar en lugar fresco hasta 5 días', 'Nacional'),

('5', 'Buñuelos Tradicionales', 'Tortillas fritas delgadas y crujientes espolvoreadas con azúcar y canela, tradicionalmente disfrutadas durante la Navidad con jarabe de piloncillo.', 22, 'https://imgs.search.brave.com/KzIrWvDnb1pZbZVYsBMLqfwo7u7h1N-F-Wcl5BAKJN4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/Zm90b3MtcHJlbWl1/bS9idW51ZWxvLW1l/eGljYW5vLWVzcG9s/dm9yZWFkby1henVj/YXItdGFtYmllbi1s/bGFtYWRvLXF1b3Ri/dW51ZWxvc3F1b3Rf/MzM4MzY3LTEyNzUu/anBn', 'Frito', '30-45 minutos', '6-8 unidades', ARRAY['Harina de trigo', 'Huevos', 'Aceite vegetal', 'Azúcar', 'Canela', 'Sal'], ARRAY['Gluten', 'Huevos'], 'Consumir el mismo día para mejor crujiente', 'Nacional'),

('6', 'Marranitos (Puerquitos)', 'Galletas en forma de cerdo hechas con piloncillo (azúcar de caña sin refinar), consideradas una de las mejores galletas del mundo por Taste Atlas.', 14, 'https://imgs.search.brave.com/WAGR2h1Bqqx_VzIuImJfF2QEBPSYXaQpPoTiVb7Gn6s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9lZGl0/b3JpYWx0ZWxldmlz/YS5icmlnaHRzcG90/Y2RuLmNvbS9kaW1z/NC9kZWZhdWx0LzAy/MWQ5MjQvMjE0NzQ4/MzY0Ny9zdHJpcC90/cnVlL2Nyb3AvODk2/eDY3MisxNDcrMC9y/ZXNpemUvMTQ0MHgx/MDgwIS9xdWFsaXR5/LzkwLz91cmw9aHR0/cHM6Ly9rMi1wcm9k/LWVkaXRvcmlhbC10/ZWxldmlzYS5zMy51/cy1lYXN0LTEuYW1h/em9uYXdzLmNvbS9i/cmlnaHRzcG90L2Y0/LzBlLzNlOTVkMTQz/NGQzZWIwY2VjNzlj/OGY0ZjVjNjgvcHVl/cnF1aXRvcy1kZS1w/aWxvbmNpbGxvLXJl/Y2V0YS1mYWNpbC15/LXJhcGlkYS5qcGVn', 'Galleta', '2-3 horas', '12-15 galletas', ARRAY['Harina de trigo', 'Piloncillo', 'Mantequilla', 'Huevos', 'Canela', 'Sal'], ARRAY['Gluten', 'Huevos', 'Lácteos'], 'Conservar en recipiente hermético hasta 2 semanas', 'Nacional'),

('7', 'Empanadas Dulces', 'Pasteles dulces rellenos de guayaba, calabaza o camote, fritos u horneados hasta dorar y crujir.', 28, 'https://imgs.search.brave.com/R9tkaNl6-ehwKljUGh8RDeXvzQuaszyaLmP9NptsFD4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9kaW5v/cmFuay5jb20vaW1n/L2Rpbm9icmFpbi8x/OTk0NTEvaW1hZ2Vu/MGRkNDdiZjYxOWM5/MTEzZGM3MDZhZDZm/Yjg4YjNmOTMuanBn', 'Pasteles', '1-2 horas', '8-10 empanadas', ARRAY['Harina de trigo', 'Mantequilla', 'Azúcar', 'Guayaba/Calabaza', 'Huevos', 'Canela'], ARRAY['Gluten', 'Huevos', 'Lácteos'], 'Conservar en refrigerador hasta 5 días', 'Nacional'),

('8', 'Pan de Elote', 'Pan dulce húmedo hecho con granos de maíz frescos, encarnando la herencia indígena del maíz de México. Perfecto con café.', 38, 'https://imgs.search.brave.com/pye1oRc-BVT-0-x5IF7n7jS4YlozxstJ0y8Q5eqSxM4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tdXli/dWVub2Jsb2cuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIz/LzAzL1Bhbi1kZS1F/bG90ZS1NZXhpY2Fu/by1NZXhpY2FuLVN3/ZWV0LUNvcm4tQ2Fr/ZS5qcGVn', 'Pan Dulce', '2-3 horas', '1 pieza grande', ARRAY['Maíz fresco', 'Harina de trigo', 'Huevos', 'Azúcar', 'Mantequilla', 'Leche', 'Vainilla'], ARRAY['Gluten', 'Huevos', 'Lácteos'], 'Conservar en lugar fresco hasta 3 días', 'Nacional'),

('9', 'Cocadas Tradicionales', 'Dulces a base de coco horneados en forma de nido, hechos con coco, azúcar y huevos. Un favorito de la época colonial.', 25, 'https://imgs.search.brave.com/dIU10l7rwf69YrcrM9Utger-48kXowW4MIqC6Ke5tNs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9lc3F1/aW5hbXguZXMvd3At/Y29udGVudC91cGxv/YWRzLzIwMjQvMDkv/eDMwaXV5Nzk2dmUu/anBn', 'Dulce', '1-2 horas', '12-15 cocadas', ARRAY['Coco rallado', 'Azúcar', 'Huevos', 'Vainilla', 'Canela'], ARRAY['Huevos'], 'Conservar en recipiente hermético hasta 1 semana', 'Nacional'),

('10', 'Chocoflan', 'Pastel "imposible" que combina capas de pastel de chocolate y flan que mágicamente cambian de posición durante el horneado.', 78, 'https://imgs.search.brave.com/jiywmDSiGvOABYMwlLyhhTRygwRFxfvbFPudsvaZIxs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/aG9sYWphbGFwZW5v/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMy8wNS9jaG9j/b2ZsYW4ta2F0ZS1y/YW1vcy0xMDI0eDY4/My5qcGc', 'Pastel', '3-4 horas', '12 porciones', ARRAY['Harina de trigo', 'Chocolate', 'Huevos', 'Leche condensada', 'Leche evaporada', 'Azúcar', 'Vainilla'], ARRAY['Gluten', 'Huevos', 'Lácteos'], 'Refrigerar hasta 7 días', 'Nacional'),

('11', 'Flan Mexicano', 'Postre cremoso de natillas con rica salsa de caramelo, una importación española que se convirtió en un básico mexicano.', 42, 'https://imgs.search.brave.com/hcc8YW1Q5dqCdK5pvBps3jDDdCd0DonDDUo7YGQ54ys/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Y29jaW5hcmVjZXRh/c2ZhY2lsZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI0/LzA3L2ZsYW4tbmFw/b2xpdGFuby1tZXhp/Y2Fuby5qcGc', 'Postre', '2-3 horas', '8 porciones', ARRAY['Huevos', 'Leche condensada', 'Leche evaporada', 'Azúcar', 'Vainilla', 'Caramelo'], ARRAY['Huevos', 'Lácteos'], 'Refrigerar hasta 5 días', 'Nacional'),

('12', 'Arroz con Leche', 'Pudín de arroz tradicional sazonado con canela y vainilla, evocando tradiciones familiares y confort.', 32, 'https://imgs.search.brave.com/uKwKyYVfudyoEFtcxZMTbH-FS7PnDjghsuoI4ObE-TQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/bWFyaWNydXphdmFs/b3MuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIwLzA5L2Fy/cm96LWNvbi1sZWNo/ZS1tZXhpY2Fuby5q/cGc', 'Postre', '1-2 horas', '6-8 porciones', ARRAY['Arroz', 'Leche', 'Azúcar', 'Canela', 'Vainilla', 'Pasas'], ARRAY['Lácteos'], 'Refrigerar hasta 3 días', 'Nacional'),

('13', 'Dulce de Zapote Negro con Naranja', 'Postre único de Veracruz hecho con pulpa de zapote negro, jugo de naranja, azúcar y un toque de ron. Oscuro, cremoso y exótico.', 52, 'https://imgs.search.brave.com/0jwFhCHhTIREojV41kr_mh766zmCKAMrlSMMT5ZbXb0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vd3d3LmN1/Ym9pbmZvcm1hdGl2/by50b3Avd3AtY29u/dGVudC91cGxvYWRz/LzIwMjAvMDQvRHVs/Y2UtZGUtWmFwb3Rl/LU5lZ3JvLWNvbi1O/YXJhbmphLmpwZz9y/ZXNpemU9NDcwLDMz/NyZzc2w9MQ', 'Postre', '2-3 horas', '8-10 porciones', ARRAY['Zapote negro', 'Jugo de naranja', 'Azúcar', 'Ron', 'Canela'], ARRAY[], 'Refrigerar hasta 5 días', 'Veracruz'),

('14', 'Glorias de Veracruz', 'Postre emblemático de Veracruz con hielo raspado, plátano machacado, jarabes, leche condensada, leche evaporada, vainilla y canela.', 35, 'https://imgs.search.brave.com/f6Hrxb8iZGgCHFqC4GOPXzW9-W-WJXuvoum790jbvLw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Z29iLm14L2Ntcy91/cGxvYWRzL2FydGlj/bGUvbWFpbl9pbWFn/ZS85NjQwNC9HTE9S/SUFTU0lUSU8uanBn', 'Raspado', '30-45 minutos', '1 porción', ARRAY['Hielo', 'Plátano', 'Leche condensada', 'Leche evaporada', 'Jarabes', 'Vainilla', 'Canela'], ARRAY['Lácteos'], 'Consumir inmediatamente', 'Veracruz'),

('15', 'Pan de Natas Veracruzano', 'Pan dulce hecho con nata (piel de leche), harina, azúcar y canela. Una especialidad veracruzana asequible, cremosa y crujiente.', 26, 'https://imgs.search.brave.com/pcfUVELORi2fPGytosIZnkTgoWtclAvI_eHNaJ9tuIk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9lZGl0/b3JpYWx0ZWxldmlz/YS5icmlnaHRzcG90/Y2RuLmNvbS9kaW1z/NC9kZWZhdWx0L2Y3/OGFlMTEvMjE0NzQ4/MzY0Ny9zdHJpcC90/cnVlL2Nyb3AvNTYw/eDU2MCsyMjArMC9y/ZXNpemUvMTAwMHgx/MDAwIS9xdWFsaXR5/LzkwLz91cmw9aHR0/cHM6Ly9rMi1wcm9k/LWVkaXRvcmlhbC10/ZWxldmlzYS5zMy51/cy1lYXN0LTEuYW1h/em9uYXdzLmNvbS9i/cmlnaHRzcG90L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE3LzA5/L3Bhbi1kZS1uYXRh/LmpwZw', 'Pan Dulce', '2-3 horas', '1 pieza grande', ARRAY['Nata', 'Harina de trigo', 'Azúcar', 'Canela', 'Huevos', 'Mantequilla'], ARRAY['Gluten', 'Huevos', 'Lácteos'], 'Conservar en lugar fresco hasta 3 días', 'Veracruz'),

('16', 'Torta de Elote Veracruzana', 'Pastel tradicional de Veracruz hecho con granos de maíz frescos, crema, azúcar y huevos, con un color amarillo distintivo.', 58, 'https://imgs.search.brave.com/drT665fSJFWkx6dytrVwFEItqi4_CkRhJNde2_NdCR0/rs:fit:500:0:1:0/g:ce/aHR0cDovL2xhY29j/aW5hZGV2ZXJvLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAy/MC8wNi9Ub3J0YS1k/ZS1lbG90ZS12ZXJh/Y3J1emFuYS0xLTY4/MHgxMDI0LmpwZw', 'Pastel', '2-3 horas', '12 porciones', ARRAY['Maíz fresco', 'Huevos', 'Crema', 'Azúcar', 'Harina de trigo', 'Vainilla'], ARRAY['Gluten', 'Huevos', 'Lácteos'], 'Refrigerar hasta 5 días', 'Veracruz'),

('17', 'Alfajores de Veracruz', 'Pastelería de origen español adaptada en Veracruz con maíz blanco local, piloncillo y canela. Textura crujiente con relleno de miel.', 24, 'https://imgs.search.brave.com/AqEZQMUDxOeXez9CdfWGR_MHPjADXwuJA4Qv2_6Z5io/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9sYWd1/YWRhLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNC8wMS9h/bGZham9yZXMtdmVy/YWNydXphbm9zLmpw/Zw', 'Galleta', '2-3 horas', '15-20 alfajores', ARRAY['Maíz blanco', 'Piloncillo', 'Miel', 'Canela', 'Mantequilla', 'Huevos'], ARRAY['Gluten', 'Huevos', 'Lácteos'], 'Conservar en recipiente hermético hasta 2 semanas', 'Veracruz'),

('18', 'Dulce de Leche de Tlacotalpan', 'Dulce icónico de Veracruz de Tlacotalpan, hecho con leche y azúcar cocinados lentamente hasta espesar, con variantes de coco o almendra.', 48, 'https://imgs.search.brave.com/6jVOdCE6mr0MCKIVghGbGR5cz-hPwlqjXV4udS5no1c/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/XzcxMTQ4NC1NTE00/ODc2MjA5MTI0M18w/MTIwMjItVi1kdWxj/ZS1tZXhpY2Fuby10/cmFkaWNpb25hbC1k/ZS1sZWNoZS53ZWJw', 'Dulce', '3-4 horas', '1 frasco', ARRAY['Leche', 'Azúcar', 'Coco/Almendras', 'Vainilla', 'Canela'], ARRAY['Lácteos', 'Frutos secos'], 'Conservar en refrigerador hasta 2 semanas', 'Veracruz');

-- Crear políticas RLS para productos
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública
CREATE POLICY "Productos públicos para lectura" ON public.productos
  FOR SELECT USING (activo = true);

-- Política para administradores (insert, update, delete)
CREATE POLICY "Administradores pueden gestionar productos" ON public.productos
  FOR ALL USING (true);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_productos_updated_at 
    BEFORE UPDATE ON public.productos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 