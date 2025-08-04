import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN
  return NextResponse.json({
    mercadopagoToken: token ? 'Presente' : 'FALTANTE',
    tokenLength: token ? token.length : 0,
    tokenStart: token ? token.substring(0, 10) + '...' : 'N/A',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Presente' : 'FALTANTE',
    appUrl: process.env.NEXT_PUBLIC_APP_URL ? 'Presente' : 'FALTANTE',
    nodeEnv: process.env.NODE_ENV,
    allEnvVars: Object.keys(process.env).filter(key => key.includes('MERCADOPAGO'))
  })
} 