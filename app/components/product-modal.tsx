'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Minus, ShoppingCart, X, Clock, Users, Star, Cake, Cookie, Coffee } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { Producto } from '@/lib/database.types'

interface ProductModalProps {
  product: Producto | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    if (product) {
      // Agregar la cantidad especificada
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          imagen_url: product.imagen_url
        })
      }
      onClose()
      setQuantity(1)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  // Función para obtener información específica del producto
  const getProductInfo = (product: Producto) => {
    const info = {
      tiempoPreparacion: '',
      porciones: '',
      ingredientes: [] as string[],
      alergenos: [] as string[],
      conservacion: '',
      icon: <Cake className="h-5 w-5" />
    }

    switch (product.categoria) {
      case 'Pastel':
        info.tiempoPreparacion = '24-48 horas'
        info.porciones = '8-12 personas'
        info.ingredientes = ['Harina de trigo', 'Huevos frescos', 'Leche entera', 'Mantequilla sin sal', 'Azúcar refinada', 'Vainilla natural']
        info.alergenos = ['Gluten', 'Huevos', 'Lácteos']
        info.conservacion = 'Refrigerar a 4°C, consumir en 5 días'
        info.icon = <Cake className="h-5 w-5" />
        break
      case 'Pan Dulce':
        info.tiempoPreparacion = '3-4 horas'
        info.porciones = '8-10 unidades'
        info.ingredientes = ['Harina de trigo', 'Levadura fresca', 'Agua tibia', 'Sal', 'Azúcar', 'Mantequilla']
        info.alergenos = ['Gluten']
        info.conservacion = 'Ambiente fresco, consumir en 2 días'
        info.icon = <Coffee className="h-5 w-5" />
        break
      case 'Frito':
        info.tiempoPreparacion = '30-45 minutos'
        info.porciones = '6-8 unidades'
        info.ingredientes = ['Harina de trigo', 'Huevos', 'Aceite vegetal', 'Azúcar', 'Canela', 'Sal']
        info.alergenos = ['Gluten', 'Huevos']
        info.conservacion = 'Consumir inmediatamente o guardar en contenedor hermético'
        info.icon = <Cookie className="h-5 w-5" />
        break
      case 'Galleta':
        info.tiempoPreparacion = '1-2 horas'
        info.porciones = '24 unidades'
        info.ingredientes = ['Harina de trigo', 'Mantequilla', 'Azúcar morena', 'Huevos', 'Vainilla', 'Canela']
        info.alergenos = ['Gluten', 'Huevos', 'Lácteos']
        info.conservacion = 'Contenedor hermético, consumir en 7 días'
        info.icon = <Cookie className="h-5 w-5" />
        break
      case 'Dulce':
        info.tiempoPreparacion = '2-3 horas'
        info.porciones = '12-15 unidades'
        info.ingredientes = ['Coco rallado', 'Azúcar', 'Huevos', 'Vainilla', 'Mantequilla']
        info.alergenos = ['Huevos', 'Lácteos']
        info.conservacion = 'Contenedor hermético, consumir en 5 días'
        info.icon = <Cake className="h-5 w-5" />
        break
      case 'Postre':
        info.tiempoPreparacion = '4-6 horas'
        info.porciones = '6-8 personas'
        info.ingredientes = ['Leche condensada', 'Huevos', 'Vainilla', 'Caramelo', 'Crema de leche']
        info.alergenos = ['Huevos', 'Lácteos']
        info.conservacion = 'Refrigerar, consumir en 3 días'
        info.icon = <Cake className="h-5 w-5" />
        break
      case 'Raspado':
        info.tiempoPreparacion = '15-20 minutos'
        info.porciones = '1 porción'
        info.ingredientes = ['Hielo', 'Plátano', 'Leche condensada', 'Vainilla', 'Canela', 'Jarabes naturales']
        info.alergenos = ['Lácteos']
        info.conservacion = 'Consumir inmediatamente'
        info.icon = <Cake className="h-5 w-5" />
        break
      default:
        info.tiempoPreparacion = '2-4 horas'
        info.porciones = '4-6 personas'
        info.ingredientes = ['Ingredientes frescos', 'Sin conservadores artificiales']
        info.alergenos = ['Consultar']
        info.conservacion = 'Refrigerar según indicaciones'
    }

    return info
  }

  if (!product) return null

  const productInfo = getProductInfo(product)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {productInfo.icon}
              <span>Detalles del Producto</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda - Imagen */}
          <div className="space-y-4">
            <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-soft">
              <img
                src={product.imagen_url}
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-3 right-3 bg-brand-primary text-white shadow-soft">
                ${product.precio}
              </Badge>
            </div>

            {/* Información rápida */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 p-3 bg-brand-accent/20 rounded-lg">
                <Clock className="h-4 w-4 text-brand-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Tiempo de preparación</p>
                  <p className="text-sm font-medium">{productInfo.tiempoPreparacion}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-brand-accent/20 rounded-lg">
                <Users className="h-4 w-4 text-brand-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Porciones</p>
                  <p className="text-sm font-medium">{productInfo.porciones}</p>
                </div>
              </div>
            </div>

            {/* Calificación */}
            <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">4.8/5.0</span>
              <span className="text-xs text-muted-foreground">(127 reseñas)</span>
            </div>
          </div>

          {/* Columna derecha - Información detallada */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-brand-warm mb-2">{product.nombre}</h3>
              <p className="text-3xl font-bold text-brand-primary mb-4">${product.precio}</p>
              <Badge variant="outline" className="text-brand-warm border-brand-accent">
                {product.categoria}
              </Badge>
            </div>

            <div>
              <h4 className="font-semibold text-brand-warm mb-2">Descripción</h4>
              <p className="text-muted-foreground leading-relaxed">{product.descripcion}</p>
            </div>

            <Separator />

            {/* Ingredientes */}
            <div>
              <h4 className="font-semibold text-brand-warm mb-3">Ingredientes Principales</h4>
              <div className="grid grid-cols-2 gap-2">
                {productInfo.ingredientes.map((ingrediente, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                    <span className="text-sm text-muted-foreground">{ingrediente}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Información adicional */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-brand-warm mb-2">Alérgenos</h4>
                <div className="flex flex-wrap gap-2">
                  {productInfo.alergenos.map((alergeno, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-red-200 text-red-700">
                      {alergeno}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-brand-warm mb-2">Conservación</h4>
                <p className="text-sm text-muted-foreground">{productInfo.conservacion}</p>
              </div>
            </div>

            <Separator />

            {/* Selector de cantidad y total */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-brand-warm mb-3">Cantidad</h4>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="border-brand-accent text-brand-warm hover:bg-brand-accent"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-brand-warm">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                    className="border-brand-accent text-brand-warm hover:bg-brand-accent"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 bg-brand-accent/20 rounded-lg">
                <span className="font-semibold text-brand-warm">Total:</span>
                <span className="text-xl font-bold text-brand-primary">
                  ${(product.precio * quantity).toFixed(2)}
                </span>
              </div>

              {/* Botón agregar al carrito */}
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-brand-primary hover:bg-brand-warm text-white shadow-soft hover:shadow-medium transition-all duration-200"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Agregar al Carrito
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 