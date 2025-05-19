"use client"

import Link from "next/link"
import { ShoppingCart, User, Search, Menu, X, Heart } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import Image from "next/image";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const { user, signOut } = useAuth()
  const { totalItems } = useCart()
  const router = useRouter();

  const accountMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [accountMenuRef])

  useEffect(() => {
    if (isAccountMenuOpen) {
      setIsMenuOpen(false)
    }
  }, [isAccountMenuOpen])

  useEffect(() => {
    if (isMenuOpen) {
      setIsAccountMenuOpen(false)
    }
  }, [isMenuOpen])

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      router.push(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); // Clear search term after search
      setIsMenuOpen(false); // Close mobile menu on search
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-[#0084cc] flex items-center py-2">
            <Image
              src="/icons/5.png"
              alt="Papelería Amores Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 ml-auto mr-4">
            <Link href="/productos" className="hover:text-[#0084cc]">
              Productos
            </Link>
            <Link href="/favoritos" className="hover:text-[#ff6b6b] flex items-center">
              <Heart className="h-5 w-5 mr-1 text-[#ff6b6b]" />
              Favoritos
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/carrito" className="p-2 hover:text-[#0084cc] relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff6b6b] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={accountMenuRef}>
                <button className="p-2 hover:text-[#0084cc]" onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}>
                  <User size={20} />
                </button>
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 block">
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
                )}
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
          {/* Mobile Search */}
          <div className="px-4 py-2">
             <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#0084cc]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
            />
          </div>
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link href="/productos" className="py-2 hover:text-[#0084cc]">
                Productos
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
