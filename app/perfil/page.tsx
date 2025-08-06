'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  Package, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Cake
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { User as UserType } from '@supabase/supabase-js'

interface Usuario {
  id: string
  nombre: string
  email: string
  telefono: string
  direccion: string
  fecha_registro: string
}

interface Direccion {
  id: string
  nombre: string
  direccion: string
  ciudad: string
  estado: string
  codigo_postal: string
  es_principal: boolean
}

interface Pedido {
  id: string
  total: number
  estado: string
  fecha_creacion: string
  items: any[]
}

interface Favorito {
  id: string
  producto: {
    id: string
    nombre: string
    precio: number
    imagen_url: string
  }
}

interface PastelPersonalizado {
  id: string
  nombre_cliente: string
  telefono: string
  email: string
  fecha_entrega: string
  hora_entrega: string
  notas: string
  precio_total: number
  estado: string
  created_at: string
  tamano: {
    nombre: string
  }
  sabor: {
    nombre: string
  }
  relleno: {
    nombre: string
  }
  decoracion: {
    nombre: string
  }
}

export default function PerfilPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [favoritos, setFavoritos] = useState<Favorito[]>([])
  const [pastelesPersonalizados, setPastelesPersonalizados] = useState<PastelPersonalizado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)
      await loadUserData(user.id)
    }

    checkAuth()
  }, [router])

  const loadUserData = async (userId: string) => {
    try {
      // Cargar perfil de usuario
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('Usuario data:', usuarioData)
      console.log('Usuario error:', usuarioError)

      if (usuarioData) {
        setUsuario(usuarioData)
      } else if (usuarioError && usuarioError.code === 'PGRST116') {
        // Si el usuario no existe, crear el perfil
        console.log('Usuario no encontrado, creando perfil...')
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: newUsuario, error: createError } = await supabase
            .from('usuarios')
            .insert({
              id: user.id,
              nombre: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
              email: user.email || '',
              telefono: '',
              direccion: ''
            })
            .select()
            .single()

          if (newUsuario) {
            setUsuario(newUsuario)
            console.log('Perfil creado:', newUsuario)
          }
        }
      }

      // Cargar direcciones
      const { data: direccionesData } = await supabase
        .from('direcciones_usuario')
        .select('*')
        .eq('usuario_id', userId)
        .order('es_principal', { ascending: false })

      if (direccionesData) {
        setDirecciones(direccionesData)
      }

      // Cargar pedidos
      const { data: pedidosData } = await supabase
        .from('pedidos')
        .select('*')
        .eq('usuario_id', userId)
        .order('fecha_creacion', { ascending: false })

      console.log('Pedidos cargados para usuario:', userId)
      console.log('Pedidos encontrados:', pedidosData)
      
      // Verificar si los pedidos realmente existen
      if (pedidosData && pedidosData.length > 0) {
        for (const pedido of pedidosData) {
          console.log(`Verificando pedido ID: ${pedido.id}`)
          const { data: pedidoVerificado, error } = await supabase
            .from('pedidos')
            .select('id')
            .eq('id', pedido.id)
            .single()
          
          if (error) {
            console.log(`❌ Pedido ${pedido.id} NO existe en BD:`, error.message)
          } else {
            console.log(`✅ Pedido ${pedido.id} existe en BD`)
          }
        }
      }

      if (pedidosData) {
        setPedidos(pedidosData)
      }

      // Cargar favoritos
      const { data: favoritosData, error: favoritosError } = await supabase
        .from('favoritos')
        .select('id, producto_id')
        .eq('usuario_id', userId)

      console.log('Favoritos data:', favoritosData)
      console.log('Favoritos error:', favoritosError)

      if (favoritosData && favoritosData.length > 0) {
        // Obtener los productos de los favoritos
        const productoIds = favoritosData.map((favorito: any) => favorito.producto_id)
        
        const { data: productosData, error: productosError } = await supabase
          .from('productos')
          .select('id, nombre, precio, imagen_url')
          .in('id', productoIds)

        console.log('Productos data:', productosData)
        console.log('Productos error:', productosError)

        if (productosData) {
          // Crear un mapa de productos para acceso rápido
          const productosMap = productosData.reduce((map: any, producto: any) => {
            map[producto.id] = producto
            return map
          }, {})

          // Transformar los datos para que coincidan con la interfaz Favorito
          const favoritosTransformados = favoritosData.map((favorito: any) => ({
            id: favorito.id,
            producto: productosMap[favorito.producto_id] || {
              id: favorito.producto_id,
              nombre: 'Producto no encontrado',
              precio: 0,
              imagen_url: ''
            }
          }))
          setFavoritos(favoritosTransformados)
        }
      }

      // Cargar pasteles personalizados
      const { data: pastelesData, error: pastelesError } = await supabase
        .from('pasteles_personalizados')
        .select(`
          *,
          tamano:tamanos_pastel(nombre),
          sabor:sabores_pastel(nombre),
          relleno:rellenos_pastel(nombre),
          decoracion:decoraciones_pastel(nombre)
        `)
        .eq('usuario_id', userId)
        .order('created_at', { ascending: false })

      console.log('Pasteles personalizados data:', pastelesData)
      console.log('Pasteles personalizados error:', pastelesError)

      if (pastelesData) {
        setPastelesPersonalizados(pastelesData)
      }

    } catch (error) {
      console.error('Error loading user data:', error)
      setError('Error al cargar los datos del usuario')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !usuario) return

    try {
      console.log('Actualizando perfil para usuario:', user.id)
      console.log('Datos a actualizar:', {
        nombre: usuario.nombre,
        telefono: usuario.telefono,
        direccion: usuario.direccion
      })

      const { data, error } = await supabase
        .from('usuarios')
        .update({
          nombre: usuario.nombre,
          telefono: usuario.telefono,
          direccion: usuario.direccion
        })
        .eq('id', user.id)
        .select()

      console.log('Respuesta de actualización:', { data, error })

      if (error) {
        console.error('Error al actualizar:', error)
        throw error
      }

      setSuccess('Perfil actualizado correctamente')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error completo:', error)
      setError('Error al actualizar el perfil')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleRefreshPedidos = async () => {
    if (!user) return
    console.log('🔄 Recargando pedidos...')
    setPedidos([])
    await loadUserData(user.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu cuenta y pedidos</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="perfil" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="perfil" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="pedidos" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Pedidos</span>
            </TabsTrigger>
            <TabsTrigger value="pasteles" className="flex items-center space-x-2">
              <Cake className="h-4 w-4" />
              <span className="hidden sm:inline">Pasteles</span>
            </TabsTrigger>
            <TabsTrigger value="favoritos" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Favoritos</span>
            </TabsTrigger>
            <TabsTrigger value="direcciones" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Direcciones</span>
            </TabsTrigger>
          </TabsList>

          {/* Perfil */}
          <TabsContent value="perfil">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Información Personal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="nombre"
                          value={usuario?.nombre || ''}
                          onChange={(e) => setUsuario(prev => prev ? {...prev, nombre: e.target.value} : null)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          value={usuario?.email || ''}
                          disabled
                          className="pl-10 bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="telefono"
                          value={usuario?.telefono || ''}
                          onChange={(e) => setUsuario(prev => prev ? {...prev, telefono: e.target.value} : null)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="direccion">Dirección principal</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="direccion"
                          value={usuario?.direccion || ''}
                          onChange={(e) => setUsuario(prev => prev ? {...prev, direccion: e.target.value} : null)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="submit">
                      Guardar Cambios
                    </Button>
                    <Button variant="outline" onClick={handleSignOut}>
                      Cerrar Sesión
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pedidos */}
          <TabsContent value="pedidos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Historial de Pedidos</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRefreshPedidos}
                  >
                    🔄 Recargar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pedidos.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No tienes pedidos aún</p>
                    <Button className="mt-4" onClick={() => router.push('/menu')}>
                      Hacer mi primer pedido
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pedidos.map((pedido) => (
                      <div key={pedido.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium">Pedido #{pedido.id.slice(0, 8)}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(pedido.fecha_creacion).toLocaleDateString('es-MX')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">${pedido.total}</p>
                            <Badge 
                              variant={pedido.estado === 'Pagado' ? 'default' : 'secondary'}
                            >
                              {pedido.estado}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">
                            {pedido.items?.length || 0} productos
                          </p>
                                                     <Button 
                             variant="outline" 
                             size="sm"
                             onClick={() => {
                               console.log('Navegando a confirmación con ID:', pedido.id)
                               router.push(`/confirmacion/${pedido.id}`)
                             }}
                           >
                             Ver Detalles
                           </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pasteles Personalizados */}
          <TabsContent value="pasteles">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cake className="h-5 w-5" />
                  <span>Mis Pasteles Personalizados</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pastelesPersonalizados.length === 0 ? (
                  <div className="text-center py-8">
                    <Cake className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No tienes pasteles personalizados aún</p>
                    <Button className="mt-4" onClick={() => router.push('/pasteles-personalizados')}>
                      Crear Pastel Personalizado
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastelesPersonalizados.map((pastel) => (
                      <div key={pastel.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium">Pastel Personalizado</h3>
                            <p className="text-sm text-gray-600">
                              {pastel.tamano?.nombre} - {pastel.sabor?.nombre}
                            </p>
                            <p className="text-sm text-gray-600">
                              Relleno: {pastel.relleno?.nombre} | Decoración: {pastel.decoracion?.nombre}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-brand-primary">${pastel.precio_total}</p>
                            <Badge 
                              variant={
                                pastel.estado === 'Pendiente' ? 'secondary' :
                                pastel.estado === 'En preparación' ? 'default' :
                                pastel.estado === 'Listo' ? 'default' :
                                'secondary'
                              }
                              className="mt-1"
                            >
                              {pastel.estado}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Fecha de entrega:</p>
                            <p className="font-medium">{new Date(pastel.fecha_entrega).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Hora de entrega:</p>
                            <p className="font-medium">{pastel.hora_entrega || 'No especificada'}</p>
                          </div>
                        </div>
                        {pastel.notas && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Notas especiales:</p>
                            <p className="text-sm">{pastel.notas}</p>
                          </div>
                        )}
                        <div className="mt-3 text-xs text-gray-500">
                          Creado: {new Date(pastel.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favoritos */}
          <TabsContent value="favoritos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Mis Favoritos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoritos.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No tienes favoritos aún</p>
                    <Button className="mt-4" onClick={() => router.push('/menu')}>
                      Explorar productos
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoritos.map((favorito) => (
                      <div key={favorito.id} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          {favorito.producto.imagen_url && (
                            <Image
                              src={favorito.producto.imagen_url}
                              alt={favorito.producto.nombre}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-medium">{favorito.producto.nombre}</h3>
                            <p className="text-sm text-gray-600">${favorito.producto.precio}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push('/menu')}
                          >
                            Agregar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Direcciones */}
          <TabsContent value="direcciones">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Mis Direcciones</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {direcciones.map((direccion) => (
                    <div key={direccion.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="font-medium">{direccion.nombre}</p>
                            {direccion.es_principal && (
                              <Badge variant="secondary">Principal</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{direccion.direccion}</p>
                          <p className="text-sm text-gray-600">
                            {direccion.ciudad}, {direccion.estado} {direccion.codigo_postal}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Nueva Dirección
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 