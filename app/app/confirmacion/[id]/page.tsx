
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'

interface Pedido {
  id: string
  cliente_nombre: string
  cliente_telefono: string
  cliente_direccion: string
  total: number
  estado: string
  fecha_creacion: string
  items: any[]
}

export default function ConfirmacionPage() {
  const params = useParams()
  const pedidoId = params.id as string
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        console.log('Buscando pedido:', pedidoId)
        const response = await fetch(`/api/pedidos/${pedidoId}`)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Pedido encontrado:', data)
          setPedido(data)
        } else {
          const errorData = await response.json()
          console.error('Error en la respuesta:', errorData)
        }
      } catch (error) {
        console.error('Error fetching pedido:', error)
      } finally {
        setLoading(false)
      }
    }

    if (pedidoId) {
      fetchPedido()
    }
  }, [pedidoId])

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Pagado':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'Pendiente':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pagado':
        return 'bg-green-100 text-green-800'
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-red-100 text-red-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando confirmación...</p>
        </div>
      </div>
    )
  }

  if (!pedido) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Pedido no encontrado</h2>
            <p className="text-gray-600 mb-6">El pedido que buscas no existe o ha sido eliminado.</p>
            <Link href="/menu">
              <Button className="w-full">Volver al menú</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-soft">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Confirmación de Pedido
            </CardTitle>
            <p className="text-gray-600">ID: {pedido.id}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Estado del pedido */}
            <div className="flex items-center justify-center space-x-2">
              {getEstadoIcon(pedido.estado)}
              <Badge className={getEstadoColor(pedido.estado)}>
                {pedido.estado}
              </Badge>
            </div>

            {/* Información del cliente */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Información del Cliente</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Nombre:</span> {pedido.cliente_nombre}</p>
                <p><span className="font-medium">Teléfono:</span> {pedido.cliente_telefono}</p>
                <p><span className="font-medium">Dirección:</span> {pedido.cliente_direccion}</p>
              </div>
            </div>

            {/* Productos */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Productos</h3>
              <div className="space-y-2">
                {pedido.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <div>
                      <p className="font-medium">{item.nombre}</p>
                      <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                    </div>
                    <p className="font-semibold">${item.precio}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-brand-primary">${pedido.total}</span>
              </div>
            </div>

            {/* Fecha */}
            <div className="text-center text-sm text-gray-500">
              <p>Fecha: {new Date(pedido.fecha_creacion).toLocaleDateString('es-MX')}</p>
            </div>

            {/* Botones */}
            <div className="flex space-x-4 pt-4">
              <Link href="/menu" className="flex-1">
                <Button variant="outline" className="w-full">
                  Hacer otro pedido
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full">
                  Ir al inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
