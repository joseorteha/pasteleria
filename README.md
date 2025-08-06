# 🍰 Pastelería Mairim - Plataforma E-commerce

![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=pasteleria-mairim-ecommerce) ![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)

**Pastelería Mairim** es una plataforma de e-commerce full-stack, robusta y moderna, diseñada para llevar la experiencia de una pastelería mexicana tradicional al mundo digital. El proyecto integra un completo sistema de gestión de productos, autenticación de usuarios, procesamiento de pagos y un perfil de cliente enriquecido.

---

## 🎬 Demostración Visual

*Aquí puedes insertar GIFs que muestren las funcionalidades clave de tu aplicación. ¡Un buen visual vale más que mil palabras! Graba tu pantalla y convierte los videos a GIF.* 

| Flujo de Compra | Perfil de Usuario | Creación de Pastel Personalizado |
| :---: | :---: | :---: |
| *[GIF: Usuario navegando, añadiendo al carrito y completando un pedido]* | *[GIF: Usuario revisando su historial de pedidos, favoritos y direcciones]* | *[GIF: Usuario usando el formulario para crear un pastel personalizado paso a paso]* |

---

## ✨ Características Principales

- **Catálogo de Productos:** Sistema dinámico para mostrar y gestionar los productos de la pastelería.
- **Carrito de Compras Persistente:** Carrito de compras funcional que guarda el estado entre sesiones.
- **Autenticación Segura:** Registro e inicio de sesión de usuarios utilizando Supabase Auth (proveedores de Google y Email/Contraseña).
- **Perfil de Usuario Completo:** Los usuarios pueden ver su historial de pedidos, gestionar sus productos favoritos y administrar sus direcciones de envío.
- **Pedidos Personalizados:** Flujo completo para que los clientes diseñen pasteles a medida, seleccionando tamaño, sabor, relleno y decoración.
- **Integración de Pagos:** Procesamiento de pagos seguro y eficiente a través de la API de MercadoPago.
- **Diseño Responsivo y Moderno:** Interfaz de usuario elegante construida con Tailwind CSS y Shadcn/ui, totalmente optimizada para dispositivos móviles y de escritorio.

---

## 🚀 Stack Tecnológico

| Área | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js) | Renderizado del lado del servidor (SSR), generación de sitios estáticos (SSG) y arquitectura de la aplicación. |
| **Lenguaje** | ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) | Tipado estático para un código más robusto y mantenible. |
| **Backend & DB** | ![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase) | Base de datos PostgreSQL, autenticación, y almacenamiento de archivos. |
| **Estilos** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css) | Framework CSS utility-first para un diseño rápido y personalizado. |
| **Componentes UI** | ![Shadcn/ui](https://img.shields.io/badge/shadcn/ui-black?logo=shadcnui&logoColor=white) | Colección de componentes de UI reutilizables y accesibles. |
| **Gestión de Estado**| ![Zustand](https://img.shields.io/badge/Zustand-black?logo=zustand&logoColor=white) | Manejo de estado global simple y potente. |
| **Pagos** | ![MercadoPago](https://img.shields.io/badge/MercadoPago-blue?logo=mercadopago) | Integración de la pasarela de pagos. |
| **ORM** | ![Prisma](https://img.shields.io/badge/Prisma-black?logo=prisma&logoColor=white) | ORM para interactuar con la base de datos de manera segura y eficiente. |

---

## 🛠️ Instalación y Puesta en Marcha Local

Sigue estos pasos para configurar el proyecto en tu entorno de desarrollo local.

### **Prerrequisitos**
- **Node.js**: Versión 18.x o superior.
- **npm** o **yarn**: Gestor de paquetes.
- **Cuenta de Supabase**: Para la base de datos y autenticación.
- **Cuenta de MercadoPago**: Para las credenciales de la API de pagos.

### **Pasos de Configuración**

1.  **Clonar el Repositorio**
    ```bash
    git clone https://github.com/tu-usuario/pasteleria-mairim.git
    cd pasteleria-mairim
    ```

2.  **Instalar Dependencias**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**
    Crea una copia del archivo de ejemplo y rellena con tus credenciales.
    ```bash
    cp .env.example .env.local
    ```
    Asegúrate de rellenar todas las variables en `.env.local`:
    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL="tu_supabase_url"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_supabase_anon_key"
    SUPABASE_SERVICE_ROLE_KEY="tu_service_role_key"
    DATABASE_URL="tu_url_de_base_de_datos_postgresql_de_supabase"

    # MercadoPago
    NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="tu_mercadopago_public_key"
    MERCADOPAGO_ACCESS_TOKEN="tu_mercadopago_access_token"

    # App
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ```

4.  **Sincronizar la Base de Datos**
    El proyecto usa Prisma para gestionar el esquema de la base de datos. Ejecuta el siguiente comando para aplicar las migraciones y asegurar que tu base de datos en Supabase tenga el esquema correcto.
    ```bash
    npx prisma db push
    ```

5.  **Poblar la Base de Datos con Datos de Prueba (Opcional pero recomendado)**
    Para tener productos y datos iniciales con los que trabajar, ejecuta el script de seeding.
    ```bash
    npm run populate-products
    ```

6.  **Iniciar el Servidor de Desarrollo**
    ```bash
    npm run dev
    ```

¡Listo! La aplicación debería estar corriendo en [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Arquitectura de la Base de Datos

El esquema de la base de datos está gestionado por Supabase (PostgreSQL) y se centra en las siguientes entidades principales:

-   `usuarios`: Almacena la información del perfil de los usuarios registrados.
-   `productos`: Contiene el catálogo completo de productos de la pastelería.
-   `pedidos`: Registra todos los pedidos realizados por los clientes, incluyendo los items y el estado del pago.
-   `favoritos`: Tabla de unión que relaciona a los `usuarios` con sus `productos` favoritos.
-   `direcciones_usuario`: Permite a los usuarios guardar múltiples direcciones de envío.
-   `comentarios`: Almacena las reseñas y calificaciones de los productos.
-   `pasteles_personalizados`: Guarda las configuraciones de los pasteles creados por los usuarios.

---

## 🚀 Despliegue

Se recomienda encarecidamente desplegar esta aplicación en **Vercel** para aprovechar al máximo las optimizaciones de Next.js.

1.  **Conecta tu repositorio de GitHub a Vercel.**
2.  **Configura las mismas variables de entorno** que usaste en `.env.local` en la configuración del proyecto de Vercel.
3.  **¡Despliega!** Vercel se encargará de los builds y despliegues automáticos en cada `push` a la rama principal.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar el proyecto, por favor sigue estos pasos:

1.  Haz un **Fork** de este repositorio.
2.  Crea una nueva rama para tu funcionalidad (`git checkout -b feature/AmazingFeature`).
3.  Realiza tus cambios y haz **Commit** (`git commit -m 'Add some AmazingFeature'`).
4.  Haz **Push** a tu rama (`git push origin feature/AmazingFeature`).
5.  Abre un **Pull Request** para revisión.