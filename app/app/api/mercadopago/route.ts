import { NextRequest, NextResponse } from 'next/server'
import { createPaymentPreference, formatCartItemsForMP } from '@/lib/mercadopago'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, payer, back_urls, external_reference } = body

    // Validar que items existe y es un array
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('Invalid items data:', items)
      return NextResponse.json(
        { error: 'Items data is required and must be a non-empty array' },
        { status: 400 }
      )
    }

    console.log('Creating preference with data:', {
      items: items.length,
      payer: payer?.name || 'Unknown',
      back_urls,
      external_reference
    })

    // Los items ya vienen formateados desde el carrito
    console.log('Items recibidos:', items)
    
    const preferenceData = {
      items: items, // Usar items directamente ya que ya están formateados
      payer,
      back_urls,
      external_reference
    }

    const result = await createPaymentPreference(preferenceData)

    if (!result.success) {
      console.error('MercadoPago error:', result.error)
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    console.log('Preference created successfully:', result.preferenceId)

    return NextResponse.json({
      success: true,
      preferenceId: result.preferenceId,
      initPoint: result.initPoint,
      sandboxInitPoint: result.sandboxInitPoint
    })

  } catch (error) {
    console.error('Error creating payment preference:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 