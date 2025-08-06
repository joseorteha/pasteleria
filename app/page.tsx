
import { Suspense } from 'react'
import HeroSection from '@/components/home/hero-section'
import FeaturedProducts from '@/components/home/featured-products'
import CatalogoPastelesSection from '@/components/home/catalogo-pasteles-section'
import PastelesPersonalizadosSection from '@/components/home/pasteles-personalizados-section'
import AboutSection from '@/components/home/about-section'
import ContactCTA from '@/components/home/contact-cta'
import ComentariosSection from '@/components/home/comentarios-section'

export default function Home() {
  // Datos de pasteles destacados
  const pastelesDestacados = [
    {
      id: 1,
      nombre: "Pastel de Chocolate Clásico",
      descripcion: "Delicioso pastel de chocolate con cobertura suave y decoraciones elegantes de chocolate. Perfecto para cualquier celebración.",
      precio: 450,
      categoria: "Chocolate",
      tamaño: "Completo (8-12 porciones)",
      ingredientes: ["Chocolate premium", "Crema de mantequilla", "Decoraciones de chocolate"],
      imagen_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
      destacado: true,
      disponible: true
    },
    {
      id: 2,
      nombre: "Pastel Tres Leches Decorado",
      descripcion: "Tradicional pastel tres leches con crema batida y frutas frescas. Decorado con flores comestibles y frutos rojos.",
      precio: 520,
      categoria: "Tres Leches",
      tamaño: "Completo (8-12 porciones)",
      ingredientes: ["Leche evaporada", "Leche condensada", "Crema batida", "Frutas frescas"],
      imagen_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=500&fit=crop",
      destacado: true,
      disponible: true
    },
    {
      id: 5,
      nombre: "Pastel Red Velvet",
      descripcion: "Clásico pastel red velvet con su característico color rojo y cobertura de queso crema. Decorado con rosas de crema.",
      precio: 580,
      categoria: "Red Velvet",
      tamaño: "Completo (8-12 porciones)",
      ingredientes: ["Cacao", "Colorante rojo", "Queso crema", "Decoraciones de crema"],
      imagen_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
      destacado: true,
      disponible: true
    },
    {
      id: 8,
      nombre: "Pastel de Chocolate Blanco y Frambuesas",
      descripcion: "Elegante pastel de chocolate blanco con frambuesas frescas y decoraciones de chocolate blanco. Ideal para eventos románticos.",
      precio: 600,
      categoria: "Chocolate Blanco",
      tamaño: "Completo (8-12 porciones)",
      ingredientes: ["Chocolate blanco", "Frambuesas frescas", "Crema de mantequilla"],
      imagen_url: "https://images.unsplash.com/photo-1562440499-64c9a111f713?w=500&h=500&fit=crop",
      destacado: true,
      disponible: true
    }
  ]

  return (
    <div className="space-y-0">
      <HeroSection />
      <Suspense fallback={<div>Cargando productos...</div>}>
        <FeaturedProducts />
      </Suspense>
      <CatalogoPastelesSection pasteles={pastelesDestacados} />
      <PastelesPersonalizadosSection />
      <AboutSection />
      <ContactCTA />
      <ComentariosSection />
    </div>
  )
}
