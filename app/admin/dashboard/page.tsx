
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  LogOut,
  Eye,
  CheckCircle,
  Clock,
  MessageCircle,
  Star,
  MessageSquare,
  Cake
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { signOut, getCurrentUser, isAdminUser } from '@/lib/auth'
import { Pedido, Producto } from '@/lib/database.types'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import PedidosTab from '@/components/admin/pedidos-tab'
import ProductosTab from '@/components/admin/productos-tab'
import ComentariosTab from '@/components/admin/comentarios-tab'
import MensajesTab from '@/components/admin/mensajes-tab'
import PastelesPersonalizadosTab from '@/components/admin/pasteles-personalizados-tab'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [stats, setStats] = useState({
    totalPedidos: 0,
    pedidosPendientes: 0,
    totalProductos: 0,
    ventasDelDia: 0,
    totalComentarios: 0,
    promedioCalificacion: 0,
    totalMensajes: 0,
    mensajesNuevos: 0,
    totalPastelesPersonalizados: 0,
    pastelesPendientes: 0,
    ventasPastelesDelDia: 0
  })

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  const checkAuth = async () => {
    try {
      const { user } = await getCurrentUser()
      if (!user || !isAdminUser(user.email)) {
        router.push('/admin/login')
        return
      }
    } catch (error) {
      router.push('/admin/login')
    }
  }

  const fetchData = async () => {
    try {
      // Fetch pedidos
      const { data: pedidosData } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false })

      // Fetch productos
      const { data: productosData } = await supabase
        .from('productos')
        .select('*')

      // Fetch comentarios
      const { data: comentariosData } = await supabase
        .from('comentarios')
        .select('*')

      // Fetch mensajes de contacto
      const { data: mensajesData } = await supabase
        .from('mensajes_contacto')
        .select('*')

      // Fetch pasteles personalizados
      const { data: pastelesData } = await supabase
        .from('pasteles_personalizados')
        .select('*')

      setPedidos(pedidosData || [])
      setProductos(productosData || [])

      // Calculate stats
      const totalPedidos = pedidosData?.length || 0
      const pedidosPendientes = pedidosData?.filter(p => p.estado === 'Pendiente').length || 0
      const totalProductos = productosData?.length || 0
      const today = new Date().toDateString()
      const ventasDelDia = pedidosData?.filter(p => 
        new Date(p.created_at).toDateString() === today
      ).reduce((sum, p) => sum + p.total, 0) || 0
      
      // Calculate pasteles personalizados stats
      const totalPastelesPersonalizados = pastelesData?.length || 0
      const pastelesPendientes = pastelesData?.filter(p => p.estado === 'Pendiente').length || 0
      const ventasPastelesDelDia = pastelesData?.filter(p => 
        new Date(p.created_at).toDateString() === today
      ).reduce((sum, p) => sum + p.precio_total, 0) || 0
      
      const totalComentarios = comentariosData?.length || 0
      const promedioCalificacion = comentariosData && comentariosData.length > 0 
        ? comentariosData.reduce((sum, c) => sum + c.calificacion, 0) / comentariosData.length 
        : 0
      
      const totalMensajes = mensajesData?.length || 0
      const mensajesNuevos = mensajesData?.filter(m => m.estado === 'Nuevo').length || 0

      setStats({
        totalPedidos,
        pedidosPendientes,
        totalProductos,
        ventasDelDia,
        totalComentarios,
        promedioCalificacion,
        totalMensajes,
        mensajesNuevos,
        totalPastelesPersonalizados,
        pastelesPendientes,
        ventasPastelesDelDia
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Sesión cerrada')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-primary mx-auto mb-4"></div>
          <p>Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-warm-primary">
                Panel de Administración
              </h1>
              <p className="text-muted-foreground">Pastelería Mairim</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
        >
          <Card className="shadow-soft border-brand-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pedidos</p>
                  <p className="text-2xl font-bold text-brand-warm">{stats.totalPedidos}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-brand-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pedidosPendientes}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-brand-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Productos</p>
                  <p className="text-2xl font-bold text-brand-warm">{stats.totalProductos}</p>
                </div>
                <Package className="h-8 w-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-brand-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ventas Hoy</p>
                  <p className="text-2xl font-bold text-green-600">${stats.ventasDelDia}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-brand-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Comentarios</p>
                  <p className="text-2xl font-bold text-brand-warm">{stats.totalComentarios}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-brand-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Calificación Prom.</p>
                  <p className="text-2xl font-bold text-yellow-500">{stats.promedioCalificacion.toFixed(1)}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-brand-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Mensajes</p>
                  <p className="text-2xl font-bold text-brand-warm">{stats.totalMensajes}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-brand-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Mensajes Nuevos</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.mensajesNuevos}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-brand-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pasteles Personalizados</p>
                  <p className="text-2xl font-bold text-brand-warm">{stats.totalPastelesPersonalizados}</p>
                </div>
                <Cake className="h-8 w-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-brand-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pasteles Pendientes</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pastelesPendientes}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-brand-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ventas Pasteles Hoy</p>
                  <p className="text-2xl font-bold text-green-600">${stats.ventasPastelesDelDia}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Tabs defaultValue="pedidos" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pedidos">Gestión de Pedidos</TabsTrigger>
              <TabsTrigger value="productos">Gestión de Productos</TabsTrigger>
              <TabsTrigger value="pasteles">Pasteles Personalizados</TabsTrigger>
              <TabsTrigger value="comentarios">Gestión de Comentarios</TabsTrigger>
              <TabsTrigger value="mensajes">Gestión de Mensajes</TabsTrigger>
            </TabsList>

            <TabsContent value="pedidos">
              <PedidosTab pedidos={pedidos} onRefresh={fetchData} />
            </TabsContent>

            <TabsContent value="productos">
              <ProductosTab productos={productos} onRefresh={fetchData} />
            </TabsContent>

            <TabsContent value="comentarios">
              <ComentariosTab onRefresh={fetchData} />
            </TabsContent>

            <TabsContent value="pasteles">
              <PastelesPersonalizadosTab onRefresh={fetchData} />
            </TabsContent>

            <TabsContent value="mensajes">
              <MensajesTab onRefresh={fetchData} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
