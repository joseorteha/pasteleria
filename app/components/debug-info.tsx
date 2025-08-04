'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function DebugInfo() {
  const [apiStatus, setApiStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testPedidoAPI = async () => {
    setLoading(true)
    try {
      // Test con un ID de ejemplo
      const response = await fetch('/api/pedidos/test-id-123')
      const data = await response.json()
      
      if (response.ok) {
        setApiStatus('✅ API funcionando correctamente')
      } else {
        setApiStatus(`❌ API Error: ${data.error}`)
      }
    } catch (error) {
      setApiStatus(`❌ Error de conexión: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Badge variant="outline">Debug</Badge>
          <span>Información de Debug</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Estado de las funcionalidades implementadas:
          </p>
          <ul className="space-y-2 text-sm">
            <li>✅ Modal de productos implementado</li>
            <li>✅ Autenticación en carrito implementada</li>
            <li>✅ Carga de datos de perfil implementada</li>
            <li>✅ Campo de dirección agregado</li>
            <li>✅ API de pedidos creada</li>
          </ul>
        </div>
        
        <div>
          <Button 
            onClick={testPedidoAPI} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? 'Probando...' : 'Probar API de Pedidos'}
          </Button>
          {apiStatus && (
            <p className="mt-2 text-sm">{apiStatus}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 