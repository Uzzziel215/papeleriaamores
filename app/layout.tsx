import type React from "react"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import { FavoritosProvider } from "@/contexts/FavoritosContext"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export const metadata = {
  title: "Papelería Amores",
  description: "Tu tienda de papelería favorita",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <CartProvider>
            <FavoritosProvider>
              <Header />
              <main className="min-h-screen pt-16">{children}</main>
              <Footer />
            </FavoritosProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
