import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    console.log('API MercadoPago: Iniciando creación de preferencia')
    
    const body = await request.json()
    console.log('API MercadoPago: Body completo recibido:', body)

    const { items, payer, back_urls, external_reference } = body

    console.log('API MercadoPago: Items recibidos:', items)
    console.log('API MercadoPago: Payer recibido:', payer)

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('API MercadoPago: Items inválidos')
      return NextResponse.json(
        { error: 'Items inválidos' },
        { status: 400 }
      )
    }

    // Verificar variables de entorno
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!accessToken) {
      console.error('API MercadoPago: Access token no configurado')
      return NextResponse.json(
        { error: 'Configuración de MercadoPago no encontrada' },
        { status: 500 }
      )
    }

    // Formatear items para MercadoPago
    const mpItems = items.map((item: any) => ({
      title: item.title || item.nombre,
      unit_price: Number(item.unit_price || item.precio),
      quantity: Number(item.quantity || item.cantidad),
      currency_id: 'MXN'
    }))

    console.log('API MercadoPago: Items formateados para MP:', mpItems)

    // Crear preferencia en MercadoPago
    const preference = {
      items: mpItems,
      payer: payer || {
        name: 'Cliente',
        email: 'cliente@example.com',
        phone: {
          number: '0000000000'
        }
      },
      back_urls: back_urls || {
        success: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pasteleria-mairim.vercel.app'}/confirmacion`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pasteleria-mairim.vercel.app'}/carrito`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pasteleria-mairim.vercel.app'}/carrito`
      },
      auto_return: 'approved',
      external_reference: external_reference || `pedido_${Date.now()}`,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pasteleria-mairim.vercel.app'}/api/mercadopago/webhook`
    }

    console.log('API MercadoPago: Preferencia a crear:', preference)

    // Llamada real a MercadoPago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('API MercadoPago: Error en respuesta:', errorData)
      return NextResponse.json(
        { error: 'Error al crear preferencia en MercadoPago' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('API MercadoPago: Respuesta exitosa:', data)

    // Asegurar que devolvemos los campos correctos
    const responseData = {
      id: data.id,
      preferenceId: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
      initPoint: data.init_point,
      sandboxInitPoint: data.sandbox_init_point
    }

    console.log('API MercadoPago: Datos de respuesta formateados:', responseData)
    return NextResponse.json(responseData)
  } catch (error) {
    console.error('API MercadoPago: Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 