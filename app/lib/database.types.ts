
export interface Database {
  public: {
    Tables: {
      productos: {
        Row: {
          id: string
          created_at: string
          nombre: string
          descripcion: string
          precio: number
          imagen_url: string
          categoria: string
          tiempo_preparacion?: string | null
          porciones?: string | null
          ingredientes?: string[] | null
          alergenos?: string[] | null
          conservacion?: string | null
          origen?: string | null
          activo?: boolean | null
        }
        Insert: {
          id?: string
          created_at?: string
          nombre: string
          descripcion: string
          precio: number
          imagen_url: string
          categoria: string
          tiempo_preparacion?: string | null
          porciones?: string | null
          ingredientes?: string[] | null
          alergenos?: string[] | null
          conservacion?: string | null
          origen?: string | null
          activo?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string
          nombre?: string
          descripcion?: string
          precio?: number
          imagen_url?: string
          categoria?: string
          tiempo_preparacion?: string | null
          porciones?: string | null
          ingredientes?: string[] | null
          alergenos?: string[] | null
          conservacion?: string | null
          origen?: string | null
          activo?: boolean | null
        }
      }
      pedidos: {
        Row: {
          id: string
          created_at: string
          total: number
          estado: string
          id_pago_mp: string | null
          usuario_id: string | null
          cliente_nombre: string | null
          cliente_telefono: string | null
          cliente_direccion: string | null
          items: any
          fecha_creacion: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          total: number
          estado?: string
          id_pago_mp?: string | null
          usuario_id?: string | null
          cliente_nombre?: string | null
          cliente_telefono?: string | null
          cliente_direccion?: string | null
          items?: any
          fecha_creacion?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          total?: number
          estado?: string
          id_pago_mp?: string | null
          usuario_id?: string | null
          cliente_nombre?: string | null
          cliente_telefono?: string | null
          cliente_direccion?: string | null
          items?: any
          fecha_creacion?: string | null
        }
      }
    }
  }
}

export interface Producto {
  id: string
  created_at: string
  nombre: string
  descripcion: string
  precio: number
  imagen_url: string
  categoria: string
  tiempo_preparacion?: string | null
  porciones?: string | null
  ingredientes?: string[] | null
  alergenos?: string[] | null
  conservacion?: string | null
  origen?: string | null
  activo?: boolean | null
}

export interface Pedido {
  id: string
  created_at: string
  total: number
  estado: string
  id_pago_mp?: string | null
  usuario_id?: string | null
  cliente_nombre?: string | null
  cliente_telefono?: string | null
  cliente_direccion?: string | null
  items?: CartItem[]
  fecha_creacion?: string | null
}

export interface CartItem {
  id: string
  nombre: string
  precio: number
  imagen_url: string
  cantidad: number
}

export interface ClienteData {
  nombre: string
  telefono: string
  direccion: string
  notas?: string
}
