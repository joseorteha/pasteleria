import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Buscando pedido con ID:', params.id)
    // DEBUG: Verificar si la clave de servicio está cargada
    console.log('SUPABASE_SERVICE_ROLE_KEY cargada:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    const { data, error } = await supabaseAdmin
      .from('pedidos')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching pedido:', error)
      console.error('ID buscado:', params.id)
      
      // Verificar si hay pedidos en la base de datos
      const { data: allPedidos, error: listError } = await supabaseAdmin
        .from('pedidos')
        .select('id, created_at, cliente_nombre')
        .limit(5)
      
      console.log('Pedidos disponibles:', allPedidos)
      
      return NextResponse.json(
        { 
          error: 'Pedido no encontrado',
          searchedId: params.id,
          availablePedidos: allPedidos || [],
          debug_serviceKeyLoaded: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        },
        { status: 404 }
      )
    }

    console.log('Pedido encontrado:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in pedidos API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 