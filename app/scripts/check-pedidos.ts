import { supabase } from '../lib/supabase'

async function checkPedidos() {
  try {
    console.log('🔍 Verificando pedidos en la base de datos...')
    
    const { data: pedidos, error } = await supabase
      .from('pedidos')
      .select('id, created_at, cliente_nombre, total, estado')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('❌ Error al obtener pedidos:', error)
      return
    }

    if (!pedidos || pedidos.length === 0) {
      console.log('📭 No hay pedidos en la base de datos')
      return
    }

    console.log('✅ Pedidos encontrados:')
    pedidos.forEach((pedido, index) => {
      console.log(`${index + 1}. ID: ${pedido.id}`)
      console.log(`   Cliente: ${pedido.cliente_nombre}`)
      console.log(`   Total: $${pedido.total}`)
      console.log(`   Estado: ${pedido.estado}`)
      console.log(`   Fecha: ${pedido.created_at}`)
      console.log('---')
    })

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkPedidos() 