import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    console.log('API MercadoPago: Iniciando creación de preferencia')
    
    const body = await request.json()
    const { items, user } = body

    console.log('API MercadoPago: Items recibidos:', items)
    console.log('API MercadoPago: User recibido:', user)

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('API MercadoPago: Items inválidos')
      return NextResponse.json(
        { error: 'Items inválidos' },
        { status: 400 }
      )
    }

    // Formatear items para MercadoPago
    const mpItems = items.map((item: any) => ({
      title: item.nombre,
      unit_price: Number(item.precio),
      quantity: Number(item.cantidad),
      currency_id: 'MXN'
    }))

    console.log('API MercadoPago: Items formateados para MP:', mpItems)

    // Crear preferencia en MercadoPago
    const preference = {
      items: mpItems,
      payer: {
        name: user?.nombre || 'Cliente',
        email: user?.email || 'cliente@example.com',
        phone: {
          number: user?.telefono || '0000000000'
        }
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pasteleria-mairim.vercel.app'}/confirmacion`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pasteleria-mairim.vercel.app'}/carrito`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pasteleria-mairim.vercel.app'}/carrito`
      },
      auto_return: 'approved',
      external_reference: `pedido_${Date.now()}`,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pasteleria-mairim.vercel.app'}/api/mercadopago/webhook`
    }

    console.log('API MercadoPago: Preferencia a crear:', preference)

    // Aquí normalmente harías la llamada a MercadoPago
    // Por ahora simulamos la respuesta
    const mockResponse = {
      id: `pref_${Date.now()}`,
      init_point: `https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=pref_${Date.now()}`,
      sandbox_init_point: `https://sandbox.mercadopago.com.mx/checkout/v1/redirect?pref_id=pref_${Date.now()}`
    }

    console.log('API MercadoPago: Respuesta simulada:', mockResponse)

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('API MercadoPago: Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 