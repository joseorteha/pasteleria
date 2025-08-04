import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Webhook received:', body)

    // Verificar que es una notificación de pago
    if (body.type === 'payment') {
      const paymentId = body.data.id
      const status = body.data.status
      const externalReference = body.data.external_reference

      console.log(`Payment ${paymentId} status: ${status} for order: ${externalReference}`)

      // Actualizar el estado del pedido en Supabase
      if (status === 'approved') {
        const { error } = await supabase
          .from('pedidos')
          .update({ 
            estado_pedido: 'Pagado',
            id_pago_mp: paymentId.toString()
          })
          .eq('id', externalReference)

        if (error) {
          console.error('Error updating order:', error)
        } else {
          console.log(`Order ${externalReference} marked as paid`)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
} 