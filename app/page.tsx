
import { Suspense } from 'react'
import HeroSection from '@/components/home/hero-section'
import FeaturedProducts from '@/components/home/featured-products'
import PastelesPersonalizadosSection from '@/components/home/pasteles-personalizados-section'
import AboutSection from '@/components/home/about-section'
import ContactCTA from '@/components/home/contact-cta'
import ComentariosSection from '@/components/home/comentarios-section'

export default function Home() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <Suspense fallback={<div>Cargando productos...</div>}>
        <FeaturedProducts />
      </Suspense>
      <PastelesPersonalizadosSection />
      <AboutSection />
      <ContactCTA />
      <ComentariosSection />
    </div>
  )
}
