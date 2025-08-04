
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Producto } from '@/lib/database.types'
import toast from 'react-hot-toast'

interface ProductosTabProps {
  productos: Producto[]
  onRefresh: () => void
}

const categorias = ['Pasteles', 'Cupcakes', 'Postres', 'Galletas', 'Panes']

export default function ProductosTab({ productos, onRefresh }: ProductosTabProps) {
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen_url: '',
    categoria: 'Pasteles'
  })

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      imagen_url: '',
      categoria: 'Pasteles'
    })
    setSelectedProducto(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (producto: Producto) => {
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio.toString(),
      imagen_url: producto.imagen_url,
      categoria: producto.categoria
    })
    setSelectedProducto(producto)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.nombre || !formData.descripcion || !formData.precio || !formData.imagen_url) {
        toast.error('Por favor completa todos los campos')
        return
      }

      const productData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        imagen_url: formData.imagen_url,
        categoria: formData.categoria
      }

      if (selectedProducto) {
        // Update existing product
        const { error } = await supabase
          .from('productos')
          .update(productData)
          .eq('id', selectedProducto.id)
        
        if (error) throw error
        toast.success('Producto actualizado correctamente')
      } else {
        // Create new product
        const { error } = await supabase
          .from('productos')
          .insert(productData)
        
        if (error) throw error
        toast.success('Producto creado correctamente')
      }

      setIsDialogOpen(false)
      resetForm()
      onRefresh()
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Error al guardar el producto')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', productId)

      if (error) throw error
      toast.success('Producto eliminado correctamente')
      onRefresh()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error al eliminar el producto')
    }
  }

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Productos</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="bg-brand-primary hover:bg-brand-warm text-white shadow-soft hover:shadow-medium transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedProducto ? 'Editar Producto' : 'Nuevo Producto'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre del producto *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="precio">Precio *</Label>
                    <Input
                      id="precio"
                      type="number"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="categoria">Categoría *</Label>
                  <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción *</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="imagen_url">URL de la imagen *</Label>
                  <Input
                    id="imagen_url"
                    type="url"
                    value={formData.imagen_url}
                    onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                    required
                    placeholder="https://imgs.search.brave.com/ju38_JNKZvBs9PW1SQgdCxCXBXNT8iV2rUlr1jbAM0M/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/bGFzZXJmaWNoZS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjMvMDQvZm9ybXMu/cG5n"
                  />
                </div>

                {formData.imagen_url && (
                  <div>
                    <Label>Vista previa de la imagen:</Label>
                    <div className="mt-2 w-32 h-24 relative rounded overflow-hidden">
                      <Image
                        src={formData.imagen_url}
                        alt="Vista previa"
                        fill
                        className="object-cover"
                        onError={() => toast.error('Error al cargar la imagen')}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-brand-primary hover:bg-brand-warm text-white shadow-soft hover:shadow-medium transition-all duration-200">
                    {loading ? 'Guardando...' : selectedProducto ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productos.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground py-8">
                No hay productos registrados
              </p>
            ) : (
              productos.map((producto) => (
                <Card key={producto.id} className="overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{producto.nombre}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {producto.descripcion}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-brand-primary">
                        ${producto.precio}
                      </span>
                      <span className="text-xs bg-brand-accent px-2 py-1 rounded text-brand-warm">
                        {producto.categoria}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(producto)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(producto.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
