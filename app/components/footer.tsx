
import Link from 'next/link'
import { MapPin, Phone, Clock, Facebook, Cake } from 'lucide-react'
import { Logo } from './logo'

export default function Footer() {
  return (
    <footer className="bg-brand-cream/50 border-t border-brand-accent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Logo size="md" />
              <span className="text-xl font-bold text-brand-warm">
                Pastelería Mairim
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Endulzando tus momentos especiales en Zongolica con los mejores pasteles y postres artesanales.
            </p>
          </div>

          {/* Información de contacto */}
          <div className="space-y-4">
            <h3 className="font-semibold text-brand-warm">Contacto</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-brand-primary" />
                <span>Calle Principal S/N, Col. Centro, Zongolica, Veracruz</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-brand-primary" />
                <span>272 227-2726</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-brand-primary" />
                <span>Lun - Dom: 8:00 AM - 9:00 PM</span>
              </div>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-brand-warm">Síguenos</h3>
            <div className="space-y-2">
              <a 
                href="https://www.facebook.com/profile.php?id=100057518706324" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-brand-primary transition-colors"
              >
                <Facebook className="h-4 w-4" />
                <span>Facebook desde 2019</span>
              </a>
              <div className="space-y-1">
                <Link href="/menu" className="block text-sm text-muted-foreground hover:text-brand-primary transition-colors">
                  Ver Menú
                </Link>
                <Link href="/contacto" className="block text-sm text-muted-foreground hover:text-brand-primary transition-colors">
                  Contacto
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-accent mt-8 pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Pastelería Mairim. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
