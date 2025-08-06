import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    console.log('Webhook MercadoPago: Notificación recibida')
    
    const body = await request.json()
    console.log('Webhook MercadoPago: Body recibido:', body)

    // Verificar que sea una notificación de pago
    if (body.type === 'payment') {
      const paymentId = body.data.id
      console.log('Webhook MercadoPago: Procesando pago ID:', paymentId)

      // Obtener detalles del pago
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
      if (!accessToken) {
        console.error('Webhook MercadoPago: Access token no configurado')
        return NextResponse.json({ error: 'Configuración no encontrada' }, { status: 500 })
      }

      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!paymentResponse.ok) {
        console.error('Webhook MercadoPago: Error al obtener detalles del pago')
        return NextResponse.json({ error: 'Error al obtener pago' }, { status: 400 })
      }

      const paymentData = await paymentResponse.json()
      console.log('Webhook MercadoPago: Datos del pago:', paymentData)

      // Actualizar estado del pedido en la base de datos
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseKey) {
        console.error('Webhook MercadoPago: Variables de Supabase no configuradas')
        return NextResponse.json({ error: 'Configuración de BD no encontrada' }, { status: 500 })
      }

      const supabase = createClient(supabaseUrl, supabaseKey)

      // Buscar pedido por external_reference
      const externalReference = paymentData.external_reference
      if (externalReference) {
        const { data: pedido, error: pedidoError } = await supabase
          .from('pedidos')
          .select('*')
          .eq('id_pago_mp', externalReference)
          .single()

        if (pedido) {
          // Actualizar estado del pedido
          const nuevoEstado = paymentData.status === 'approved' ? 'Pagado' : 
                             paymentData.status === 'pending' ? 'Pendiente' : 'Cancelado'

          const { error: updateError } = await supabase
            .from('pedidos')
            .update({ 
              estado: nuevoEstado,
              fecha_actualizacion: new Date().toISOString()
            })
            .eq('id', pedido.id)

          if (updateError) {
            console.error('Webhook MercadoPago: Error al actualizar pedido:', updateError)
          } else {
            console.log('Webhook MercadoPago: Pedido actualizado exitosamente')
          }
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook MercadoPago: Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
} 