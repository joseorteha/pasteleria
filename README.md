# 🍰 Pastelería Mairim - E-commerce de Pastelería Mexicana

Una aplicación web moderna para una pastelería mexicana, construida con Next.js, TypeScript, Tailwind CSS y Supabase.

## ✨ Características

- 🛒 **Carrito de Compras** - Gestión completa de productos
- ❤️ **Sistema de Favoritos** - Guarda tus productos favoritos
- 👤 **Autenticación** - Login/registro con Google y email
- 📱 **Diseño Responsivo** - Optimizado para móviles y desktop
- 🎨 **UI Moderna** - Diseño elegante inspirado en el logo
- 💳 **Pagos con MercadoPago** - Integración completa
- 📊 **Panel de Administración** - Gestión de productos y pedidos
- ⭐ **Sistema de Comentarios** - Reseñas y calificaciones
- 🔍 **Filtros Avanzados** - Búsqueda por categorías y favoritos

## 🚀 Tecnologías

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Estado**: Zustand
- **Pagos**: MercadoPago
- **UI**: Shadcn/ui, Lucide Icons
- **Animaciones**: Framer Motion

## 📦 Instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/tu-usuario/pasteleria-mairim.git
cd pasteleria-mairim/app
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
```bash
cp env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase y MercadoPago.

4. **Configura la base de datos**
```bash
# Ejecuta el script SQL en Supabase
# Ver archivo: scripts/create-favorites-table.sql
```

5. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# MercadoPago Configuration
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=tu_mercadopago_public_key
MERCADOPAGO_ACCESS_TOKEN=tu_mercadopago_access_token

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=admin@pasteleriamairim.com
ADMIN_PASSWORD=tu_admin_password
```

### Base de Datos

Ejecuta el siguiente SQL en tu proyecto de Supabase:

```sql
-- Crear tabla de favoritos
CREATE TABLE IF NOT EXISTS favoritos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  producto_id TEXT REFERENCES productos(id) ON DELETE CASCADE,
  fecha_agregado TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, producto_id)
);

-- Habilitar RLS
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Usuarios pueden ver sus favoritos" ON favoritos
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden agregar favoritos" ON favoritos
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar favoritos" ON favoritos
  FOR DELETE USING (auth.uid() = usuario_id);
```

## 📁 Estructura del Proyecto

```
pasteleria_mairim/
├── app/                    # Aplicación Next.js
│   ├── app/               # Páginas de la aplicación
│   ├── components/        # Componentes reutilizables
│   ├── lib/              # Utilidades y configuración
│   ├── scripts/          # Scripts de base de datos
│   └── public/           # Archivos estáticos
├── scripts/              # Scripts SQL y utilidades
└── README.md            # Este archivo
```

## 🎨 Características de Diseño

- **Paleta de Colores**: Inspirada en el logo de Mairim
- **Tipografía**: Moderna y legible
- **Animaciones**: Suaves y profesionales
- **Responsive**: Optimizado para todos los dispositivos

## 🔐 Seguridad

- **Row Level Security (RLS)** en Supabase
- **Autenticación** con Supabase Auth
- **Variables de entorno** protegidas
- **Validación** de formularios

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. Deploy automático en cada push

### Otros Proveedores

- **Netlify**: Configuración similar a Vercel
- **Railway**: Soporte completo para Next.js
- **Heroku**: Configuración manual requerida

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Pastelería Mairim**
- Email: contacto@pasteleriamairim.com
- Sitio Web: [pasteleriamairim.com](https://pasteleriamairim.com)

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) por la infraestructura
- [Vercel](https://vercel.com) por el hosting
- [Tailwind CSS](https://tailwindcss.com) por el framework CSS
- [Shadcn/ui](https://ui.shadcn.com) por los componentes

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub! 