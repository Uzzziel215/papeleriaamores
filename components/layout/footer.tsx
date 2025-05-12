import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <Image 
              src="/logo-white.png" 
              alt="Papelería Amores" 
              width={150} 
              height={60}
              className="object-contain mb-4"
            />
            <p className="text-gray-400 mb-4">
              Tu tienda de papelería favorita con los mejores productos para la escuela, oficina y proyectos creativos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="text-gray-400 hover:text-white">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-gray-400 hover:text-white">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/nuevos" className="text-gray-400 hover:text-white">
                  Nuevos Productos
                </Link>
              </li>
              <li>
                <Link href="/populares" className="text-gray-400 hover:text-white">
                  Más Populares
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicio al Cliente</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cuenta" className="text-gray-400 hover:text-white">
                  Mi Cuenta
                </Link>
              </li>
              <li>
                <Link href="/cuenta/pedidos" className="text-gray-400 hover:text-white">
                  Seguimiento de Pedidos
                </Link>
              </li>
              <li>
                <Link href="/ayuda" className="text-gray-400 hover:text-white">
                  Ayuda & FAQ
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-gray-400 hover:text-white">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#0084cc] mr-2 mt-0.5" />
                <span className="text-gray-400">
                  Calle Principal 123<br />
                  28001, Madrid, España
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-[#0084cc] mr-2" />
                <span className="text-gray-400">+34 912 345 678</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-[#0084cc] mr-2" />
                <span className="text-gray-400">info@papeleriaamores.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 pb-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Suscríbete a Nuestra Newsletter</h3>
            </div>

\
