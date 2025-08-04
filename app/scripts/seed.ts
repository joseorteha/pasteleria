
import { supabase } from '../lib/supabase'

const productos = [
  {
    nombre: 'Conchas Tradicionales',
    descripcion: 'Pan dulce mexicano icónico con cobertura de azúcar en forma de concha marina, disponible en sabores vainilla, chocolate y fresa.',
    precio: 18,
    imagen_url: 'https://imgs.search.brave.com/ge1vv8dtyqmsC1C0GU8OlR_iCr_Fz0XzSl8i6CHZUtY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQx/NDQzMzI1NC9lcy9m/b3RvL2NvbmNoYXMt/cGFuLWR1bGNlLW1l/eGljYW5vLXBhbmFk/ZXIlQzMlQURhLXRy/YWRpY2lvbmFsLWRl/LW0lQzMlQTl4aWNv/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz05WjlYUFZfbExH/dTRycUxDNWdiUExf/bkt5MDJqNDVzLVQ0/X1RBLVlHU1NRPQ',
    categoria: 'Panes'
  },
  {
    nombre: 'Pastel Tres Leches Clásico',
    descripcion: 'Esponjoso pastel empapado en una mezcla de tres tipos de leche (evaporada, condensada y entera), cubierto con crema batida.',
    precio: 65,
    imagen_url: 'https://imgs.search.brave.com/pkIK7r0lpbKDXoPaI6CIPL1EEP0SIjO0l-xxGwxgY9w/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9kaXJl/Y3RvYWxndXN0by5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjUvMDIvY29tby1w/cmVwYXJhci1lbC1h/dXRlbnRpY28tcGFz/dGVsLXRyZXMtbGVj/aGVzLW1leGljYW5v/LTEwMjR4NTc2Lmpw/Zw',
    categoria: 'Pasteles'
  },
  {
    nombre: 'Churros con Canela',
    descripcion: 'Deliciosos bastones de masa frita espolvoreados con azúcar y canela, servidos con salsa de chocolate para acompañar.',
    precio: 15,
    imagen_url: 'https://imgs.search.brave.com/lww0AOsJgxkG4ZalcDAsCJqbRtkGOAL4G1G-AuZrtoE/rs:fit:500:0:1:0/g:ce/aHR0cDovL2VuanVs/aWFuYS5jb20vdHVl/cmVzZWxjaGVmL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE1LzAx/L2NodXJyb3MtY2Fz/ZXJvcy1jb24tYXol/QzMlQkFjYXIteS1j/YW5lbGEuanBn',
    categoria: 'Postres'
  },
  {
    nombre: 'Pan de Muerto',
    descripcion: 'Pan tradicional del Día de Muertos con aroma de azahar, decorado con tiras en forma de huesos y cobertura de azúcar.',
    precio: 35,
    imagen_url: 'https://imgs.search.brave.com/lIuept_4Bh-2gIsMRnQyhlVEjkcbPn-U0h4N2L4mmVI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG43/LnJlY2V0YXNkZWVz/Y2FuZGFsby5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjEv/MTEvUGFuLWRlLW11/ZXJ0by11bi1kdWxj/ZS10cmFkaWNpb25h/bC1tZXhpY2Fuby5q/cGc',
    categoria: 'Panes'
  },
  {
    nombre: 'Buñuelos Tradicionales',
    descripción: 'Tortillas finas y crujientes fritas espolvoreadas con azúcar y canela, tradicionalmente disfrutadas en Navidad con jarabe de piloncillo.',
    precio: 22,
    imagen_url: 'https://imgs.search.brave.com/KzIrWvDnb1pZbZVYsBMLqfwo7u7h1N-F-Wcl5BAKJN4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/Zm90b3MtcHJlbWl1/bS9idW51ZWxvLW1l/eGljYW5vLWVzcG9s/dm9yZWFkby1henVj/YXItdGFtYmllbi1s/bGFtYWRvLXF1b3Ri/dW51ZWxvc3F1b3Rf/MzM4MzY3LTEyNzUu/anBn',
    categoria: 'Postres'
  },
  {
    nombre: 'Marranitos (Puerquitos)',
    descripción: 'Galletas con forma de cerdito hechas con piloncillo (azúcar de caña sin refinar), consideradas entre las mejores galletas del mundo por Taste Atlas.',
    precio: 14,
    imagen_url: 'https://imgs.search.brave.com/WAGR2h1Bqqx_VzIuImJfF2QEBPSYXaQpPoTiVb7Gn6s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9lZGl0/b3JpYWx0ZWxldmlz/YS5icmlnaHRzcG90/Y2RuLmNvbS9kaW1z/NC9kZWZhdWx0LzAy/MWQ5MjQvMjE0NzQ4/MzY0Ny9zdHJpcC90/cnVlL2Nyb3AvODk2/eDY3MisxNDcrMC9y/ZXNpemUvMTQ0MHgx/MDgwIS9xdWFsaXR5/LzkwLz91cmw9aHR0/cHM6Ly9rMi1wcm9k/LWVkaXRvcmlhbC10/ZWxldmlzYS5zMy51/cy1lYXN0LTEuYW1h/em9uYXdzLmNvbS9i/cmlnaHRzcG90L2Y0/LzBlLzNlOTVkMTQz/NGQzZWIwY2VjNzlj/OGY0ZjVjNjgvcHVl/cnF1aXRvcy1kZS1w/aWxvbmNpbGxvLXJl/Y2V0YS1mYWNpbC15/LXJhcGlkYS5qcGVn',
    categoria: 'Galletas'
  },
  {
    nombre: 'Empanadas Dulces',
    descripción: 'Hojaldre dulce relleno de guayaba, calabaza o camote, fritas o horneadas hasta dorar.',
    precio: 28,
    imagen_url: 'https://imgs.search.brave.com/R9tkaNl6-ehwKljUGh8RDeXvzQuaszyaLmP9NptsFD4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9kaW5v/cmFuay5jb20vaW1n/L2Rpbm9icmFpbi8x/OTk0NTEvaW1hZ2Vu/MGRkNDdiZjYxOWM5/MTEzZGM3MDZhZDZm/Yjg4YjNmOTMuanBn',
    categoria: 'Pasteles'
  },
  {
    nombre: 'Pan de Elote',
    descripción: 'Pan dulce húmedo de maíz hecho con granos de elote fresco, que representa la herencia indígena mexicana del maíz. Perfecto con café.',
    precio: 38,
    imagen_url: 'https://imgs.search.brave.com/pye1oRc-BVT-0-x5IF7n7jS4YlozxstJ0y8Q5eqSxM4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tdXli/dWVub2Jsb2cuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIz/LzAzL1Bhbi1kZS1F/bG90ZS1NZXhpY2Fu/by1NZXhpY2FuLVN3/ZWV0LUNvcm4tQ2Fr/ZS5qcGVn',
    categoria: 'Panes'
  },
  {
    nombre: 'Cocadas',
    descripción: 'Dulces a base de coco horneados en forma de nido, hechos con coco, azúcar y huevos. Un favorito de la época colonial.',
    precio: 25,
    imagen_url: 'https://imgs.search.brave.com/dIU10l7rwf69YrcrM9Utger-48kXowW4MIqC6Ke5tNs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9lc3F1/aW5hbXguZXMvd3At/Y29udGVudC91cGxv/YWRzLzIwMjQvMDkv/eDMwaXV5Nzk2dmUu/anBn',
    categoria: 'Postres'
  },
  {
    nombre: 'Chocoflan',
    descripción: 'Pastel "imposible" que combina capas de pastel de chocolate y flan que mágicamente intercambian posiciones durante el horneado.',
    precio: 78,
    imagen_url: 'https://imgs.search.brave.com/jiywmDSiGvOABYMwlLyhhTRygwRFxfvbFPudsvaZIxs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/aG9sYWphbGFwZW5v/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMy8wNS9jaG9j/b2ZsYW4ta2F0ZS1y/YW1vcy0xMDI0eDY4/My5qcGc',
    categoria: 'Pasteles'
  },
  {
    nombre: 'Flan Mexicano',
    descripción: 'Postre cremoso de natilla con rica salsa de caramelo, una importación española que se convirtió en un básico mexicano.',
    precio: 42,
    imagen_url: 'https://imgs.search.brave.com/hcc8YW1Q5dqCdK5pvBps3jDDdCd0DonDDUo7YGQ54ys/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Y29jaW5hcmVjZXRh/c2ZhY2lsZXMuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI0/LzA3L2ZsYW4tbmFw/b2xpdGFuby1tZXhp/Y2Fuby5qcGc',
    categoria: 'Postres'
  },
  {
    nombre: 'Arroz con Leche',
    descripción: 'Pudín de arroz tradicional sazonado con canela y vainilla, que evoca tradiciones familiares y comodidad.',
    precio: 32,
    imagen_url: 'https://imgs.search.brave.com/uKwKyYVfudyoEFtcxZMTbH-FS7PnDjghsuoI4ObE-TQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/bWFyaWNydXphdmFs/b3MuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIwLzA5L2Fy/cm96LWNvbi1sZWNo/ZS1tZXhpY2Fuby5q/cGc',
    categoria: 'Postres'
  },
  // Especialidades Veracruzanas
  {
    nombre: 'Dulce de Zapote Negro Veracruzano',
    descripción: 'Postre único veracruzano hecho con pulpa de zapote negro, jugo de naranja, azúcar y un toque de ron. Oscuro, cremoso y exótico.',
    precio: 52,
    imagen_url: 'https://imgs.search.brave.com/0jwFhCHhTIREojV41kr_mh766zmCKAMrlSMMT5ZbXb0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vd3d3LmN1/Ym9pbmZvcm1hdGl2/by50b3Avd3AtY29u/dGVudC91cGxvYWRz/LzIwMjAvMDQvRHVs/Y2UtZGUtWmFwb3Rl/LU5lZ3JvLWNvbi1O/YXJhbmphLmpwZz9y/ZXNpemU9NDcwLDMz/NyZzc2w9MQ',
    categoria: 'Postres'
  },
  {
    nombre: 'Glorias de Veracruz',
    descripción: 'Icónico raspado veracruzano con plátano machacado, jarabes, leche condensada, leche evaporada, vainilla y canela.',
    precio: 35,
    imagen_url: 'https://imgs.search.brave.com/f6Hrxb8iZGgCHFqC4GOPXzW9-W-WJXuvoum790jbvLw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Z29iLm14L2Ntcy91/cGxvYWRzL2FydGlj/bGUvbWFpbl9pbWFn/ZS85NjQwNC9HTE9S/SUFTU0lUSU8uanBn',
    categoria: 'Postres'
  },
  {
    nombre: 'Pan de Natas Veracruzano',
    descripción: 'Pan dulce hecho con nata (nata de leche), harina, azúcar y canela. Una especialidad veracruzana económica, cremosa y crujiente.',
    precio: 26,
    imagen_url: 'https://imgs.search.brave.com/pcfUVELORi2fPGytosIZnkTgoWtclAvI_eHNaJ9tuIk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9lZGl0/b3JpYWx0ZWxldmlz/YS5icmlnaHRzcG90/Y2RuLmNvbS9kaW1z/NC9kZWZhdWx0L2Y3/OGFlMTEvMjE0NzQ4/MzY0Ny9zdHJpcC90/cnVlL2Nyb3AvNTYw/eDU2MCsyMjArMC9y/ZXNpemUvMTAwMHgx/MDAwIS9xdWFsaXR5/LzkwLz91cmw9aHR0/cHM6Ly9rMi1wcm9k/LWVkaXRvcmlhbC10/ZWxldmlzYS5zMy51/cy1lYXN0LTEuYW1h/em9uYXdzLmNvbS9i/cmlnaHRzcG90L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE3LzA5/L3Bhbi1kZS1uYXRh/LmpwZw',
    categoria: 'Panes'
  },
  {
    nombre: 'Torta de Elote Veracruzana',
    descripción: 'Pastel tradicional veracruzano de maíz hecho con granos de elote fresco, crema, azúcar y huevos, con un distintivo color amarillo.',
    precio: 58,
    imagen_url: 'https://imgs.search.brave.com/drT665fSJFWkx6dytrVwFEItqi4_CkRhJNde2_NdCR0/rs:fit:500:0:1:0/g:ce/aHR0cDovL2xhY29j/aW5hZGV2ZXJvLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAy/MC8wNi9Ub3J0YS1k/ZS1lbG90ZS12ZXJh/Y3J1emFuYS0xLTY4/MHgxMDI0LmpwZw',
    categoria: 'Pasteles'
  },
  {
    nombre: 'Alfajores de Veracruz',
    descripción: 'Pasta de origen español adaptada en Veracruz con maíz blanco local, piloncillo y canela. Textura crujiente con relleno de miel.',
    precio: 24,
    imagen_url: 'https://imgs.search.brave.com/AqEZQMUDxOeXez9CdfWGR_MHPjADXwuJA4Qv2_6Z5io/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9sYWd1/YWRhLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNC8wMS9h/bGZham9yZXMtdmVy/YWNydXphbm9zLmpw/Zw',
    categoria: 'Galletas'
  },
  {
    nombre: 'Dulce de Leche de Tlacotalpan',
    descripción: 'Icónico dulce veracruzano de Tlacotalpan, hecho con leche y azúcar cocidas lentamente hasta espesar, con variantes de coco o almendra.',
    precio: 48,
    imagen_url: 'https://imgs.search.brave.com/6jVOdCE6mr0MCKIVghGbGR5cz-hPwlqjXV4udS5no1c/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/XzcxMTQ4NC1NTE00/ODc2MjA5MTI0M18w/MTIwMjItVi1kdWxj/ZS1tZXhpY2Fuby10/cmFkaWNpb25hbC1k/ZS1sZWNoZS53ZWJw',
    categoria: 'Postres'
  }
]

async function main() {
  console.log('🌟 Iniciando seed de productos para Pastelería Mairim...')

  try {
    // Clear existing products
    console.log('🧹 Limpiando productos existentes...')
    const { error: deleteError } = await supabase
      .from('productos')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (deleteError) {
      console.error('Error limpiando productos:', deleteError)
    }

    // Insert new products
    console.log('📦 Insertando productos nuevos...')
    const { data, error } = await supabase
      .from('productos')
      .insert(productos)

    if (error) {
      console.error('Error insertando productos:', error)
      throw error
    }

    console.log('✅ Seed completado exitosamente!')
    console.log(`📊 Productos insertados: ${productos.length}`)
    console.log(`🏷️ Categorías: ${[...new Set(productos.map(p => p.categoria))].join(', ')}`)
    console.log('🎉 Base de datos lista para Pastelería Mairim!')

  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    process.exit(1)
  }
}

main()
