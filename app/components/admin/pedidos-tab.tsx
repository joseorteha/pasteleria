
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, CheckCircle, Clock, Package } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Pedido } from '@/lib/database.types'
import toast from 'react-hot-toast'

interface PedidosTabProps {
  pedidos: Pedido[]
  onRefresh: () => void
}

export default function PedidosTab({ pedidos, onRefresh }: PedidosTabProps) {
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'Preparando':
        return 'bg-blue-100 text-blue-800'
      case 'Listo':
        return 'bg-green-100 text-green-800'
      case 'Completado':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return <Clock className="h-4 w-4" />
      case 'Preparando':
        return <Package className="h-4 w-4" />
      case 'Listo':
        return <CheckCircle className="h-4 w-4" />
      case 'Completado':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const updateEstadoPedido = async (pedidoId: string, nuevoEstado: string) => {
    setLoading(pedidoId)
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ estado: nuevoEstado })
        .eq('id', pedidoId)

      if (error) throw error

      toast.success('Estado del pedido actualizado')
      onRefresh()
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Error al actualizar el estado')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lista de pedidos */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pedidos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay pedidos registrados
                </p>
              ) : (
                pedidos.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedPedido(pedido)}
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-semibold">#{pedido.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {pedido.cliente_nombre || 'Cliente no especificado'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(pedido.created_at).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-bold">${pedido.total}</p>
                        <p className="text-sm text-muted-foreground">
                          {pedido.items ? pedido.items.length : 0} productos
                        </p>
                      </div>
                      <Badge className={getEstadoColor(pedido.estado)}>
                        <div className="flex items-center space-x-1">
                          {getEstadoIcon(pedido.estado)}
                          <span>{pedido.estado}</span>
                        </div>
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalles del pedido seleccionado */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPedido ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Número de pedido:</p>
                  <p className="font-mono text-sm">{selectedPedido.id.slice(0, 8)}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Cliente:</p>
                  <p className="font-medium">{selectedPedido.cliente_nombre || 'No especificado'}</p>
                  <p className="text-sm">{selectedPedido.cliente_telefono || 'No especificado'}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Dirección:</p>
                  <p className="text-sm">{selectedPedido.cliente_direccion || 'No especificada'}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Productos:</p>
                  <div className="space-y-2">
                    {selectedPedido.items && selectedPedido.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-8 h-8 relative rounded overflow-hidden">
                          <Image
                            src={item.imagen_url}
                            alt={item.nombre}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.nombre}</p>
                          <p className="text-muted-foreground">
                            ${item.precio} x {item.cantidad}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ${item.precio * item.cantidad}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${selectedPedido.total}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Cambiar estado:</p>
                  <Select
                    value={selectedPedido.estado}
                    onValueChange={(value) => updateEstadoPedido(selectedPedido.id, value)}
                    disabled={loading === selectedPedido.id}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Preparando">Preparando</SelectItem>
                      <SelectItem value="Listo">Listo</SelectItem>
                      <SelectItem value="Completado">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Selecciona un pedido para ver los detalles
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
