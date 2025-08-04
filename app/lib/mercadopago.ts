import { MercadoPagoConfig, Preference } from 'mercadopago'

// Configuración del cliente de MercadoPago
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
const client = new MercadoPagoConfig({ 
  accessToken: accessToken! 
})

// Interfaz para los items del carrito
export interface CartItem {
  id: string
  title: string
  unit_price: number
  quantity: number
  picture_url?: string
}

// Interfaz para la preferencia de pago
export interface PaymentPreference {
  items: CartItem[]
  payer: {
    name: string
    email: string
    phone?: {
      number: string
    }
  }
  back_urls: {
    success: string
    failure: string
    pending: string
  }
  auto_return?: 'approved' | 'all'
  external_reference?: string
  notification_url?: string
}

/**
 * Crea una preferencia de pago en MercadoPago
 */
export async function createPaymentPreference(preferenceData: PaymentPreference) {
  try {
    const preference = new Preference(client)
    
    const result = await preference.create({
      body: {
        items: preferenceData.items,
        payer: preferenceData.payer,
        back_urls: preferenceData.back_urls,
        external_reference: preferenceData.external_reference,
        notification_url: preferenceData.notification_url,
        expires: true,
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      }
    })

    return {
      success: true,
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point
    }
  } catch (error) {
    console.error('Error creating payment preference:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Convierte los items del carrito al formato de MercadoPago
 */
export function formatCartItemsForMP(items: any[]): CartItem[] {
  console.log('Formateando items:', items)
  const formatted = items.map(item => ({
    id: item.id,
    title: item.nombre,
    unit_price: item.precio,
    quantity: item.cantidad,
    picture_url: item.imagen_url
  }))
  console.log('Items formateados:', formatted)
  return formatted
}

/**
 * Obtiene la URL de pago según el entorno
 */
export function getPaymentUrl(preferenceId: string, isSandbox: boolean = true) {
  const baseUrl = isSandbox 
    ? 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id='
    : 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id='
  
  return `${baseUrl}${preferenceId}`
} 