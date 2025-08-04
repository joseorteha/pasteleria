import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('API Route: Buscando pedido con ID:', params.id)
    
    // Usar el cliente normal de Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Variables de entorno de Supabase no configuradas')
      return NextResponse.json(
        { error: 'Configuración de Supabase no encontrada' },
        { status: 500 }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('id', params.id)
      .single()

    console.log('API Route: Resultado de búsqueda:', { data, error })

    if (error) {
      console.error('API Route: Error fetching pedido:', error)
      return NextResponse.json(
        { error: 'Pedido no encontrado', searchedId: params.id },
        { status: 404 }
      )
    }

    console.log('API Route: Pedido encontrado:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Route: Error in pedidos API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 