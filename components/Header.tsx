"use client"

import Link from "next/link"
import { ShoppingCart, User, Search, Menu, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { totalItems } = useCart()

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-[#0084cc]">
            Papelería Amores
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/productos" className="hover:text-[#0084cc]">
              Productos
            </Link>
            <Link href="/categorias" className="hover:text-[#0084cc]">
              Categorías
            </Link>
            <Link href="/ofertas" className="hover:text-[#0084cc]">
              Ofertas
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:text-[#0084cc]">
              <Search size={20} />
            </button>

            <Link href="/carrito" className="p-2 hover:text-[#0084cc] relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff6b6b] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="p-2 hover:text-[#0084cc]">
                  <User size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  <Link href="/cuenta" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Mi Cuenta
                  </Link>
                  <Link href="/cuenta/pedidos" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Mis Pedidos
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm">Iniciar Sesión</Button>
              </Link>
            )}

            <button className="md:hidden p-2 hover:text-[#0084cc]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link href="/productos" className="py-2 hover:text-[#0084cc]">
                Productos
              </Link>
              <Link href="/categorias" className="py-2 hover:text-[#0084cc]">
                Categorías
              </Link>
              <Link href="/ofertas" className="py-2 hover:text-[#0084cc]">
                Ofertas
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
