import 'dotenv/config'
import { supabase } from '../lib/supabase'
import productosData from '../productos_pasteleria_mexicana.json'

interface ProductoMexicano {
  id: number
  nombre: string
  descripcion: string
  precio_mxn: number
  categoria: string
  origen: string
  imagen_url: string
}

async function populateProducts() {
  try {
    console.log('🚀 Iniciando población de productos...')
    console.log('📡 URL de Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    const productos = productosData.productos_pasteleria_mexicana as ProductoMexicano[]
    
    for (const producto of productos) {
      const { data, error } = await supabase
        .from('productos')
        .upsert({
          id: producto.id.toString(),
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio_mxn,
          categoria: producto.categoria,
          imagen_url: producto.imagen_url,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      if (error) {
        console.error(`❌ Error al insertar ${producto.nombre}:`, error)
      } else {
        console.log(`✅ ${producto.nombre} - $${producto.precio_mxn} MXN`)
      }
    }

    console.log('🎉 Población de productos completada!')
    console.log(`📊 Total de productos: ${productos.length}`)
    
    // Mostrar estadísticas
    const categorias = [...new Set(productos.map(p => p.categoria))]
    console.log('📋 Categorías:', categorias.join(', '))
    
    const precios = productos.map(p => p.precio_mxn)
    const precioMin = Math.min(...precios)
    const precioMax = Math.max(...precios)
    console.log(`💰 Rango de precios: $${precioMin} - $${precioMax} MXN`)

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  populateProducts()
}

export { populateProducts } 