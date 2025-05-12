import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingCart, Heart, User, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#0084cc] text-white py-2">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="text-sm">Envío gratis en pedidos superiores a €30</div>
          <div className="flex items-center space-x-4">
            <Link href="/contacto" className="text-sm hover:underline">
              Contacto
            </Link>
            <Link href="/ayuda" className="text-sm hover:underline">
              Ayuda
            </Link>
            <div className="flex items-center">
              <span className="text-sm">ES</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center">
          {/* Logo */}
          <Link href="/" className="mb-4 md:mb-0">
            <Image src="/logo.png" alt="Papelería Amores" width={150} height={60} className="object-contain" />
          </Link>

          {/* Search */}
          <div className="flex-1 w-full md:w-auto md:mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full border border-gray-200 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#0084cc]"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="/cuenta/favoritos" className="flex flex-col items-center">
              <div className="relative">
                <Heart className="h-6 w-6 text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-[#ff6b6b] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </div>
              <span className="text-xs mt-1 hidden md:block">Favoritos</span>
            </Link>

            <Link href="/cuenta" className="flex flex-col items-center">
              <User className="h-6 w-6 text-gray-600" />
              <span className="text-xs mt-1 hidden md:block">Cuenta</span>
            </Link>

            <Link href="/carrito" className="flex flex-col items-center">
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-[#0084cc] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </div>
              <span className="text-xs mt-1 hidden md:block">Carrito</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center space-x-8 py-3">
              <Link href="/productos" className="font-medium hover:text-[#0084cc]">
                Todos los Productos
              </Link>
              <Link href="/productos?categoria=cuadernos" className="font-medium hover:text-[#0084cc]">
                Cuadernos
              </Link>
              <Link href="/productos?categoria=boligrafos" className="font-medium hover:text-[#0084cc]">
                Bolígrafos
              </Link>
              <Link href="/productos?categoria=arte" className="font-medium hover:text-[#0084cc]">
                Arte
              </Link>
              <Link href="/productos?categoria=organizacion" className="font-medium hover:text-[#0084cc]">
                Organización
              </Link>
              <Link href="/ofertas" className="font-medium text-[#ff6b6b] hover:text-[#ff5252]">
                Ofertas
              </Link>
            </div>

            <Button variant="ghost" className="md:hidden py-3">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
