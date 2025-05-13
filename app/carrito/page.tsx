"use client"

import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Trash2, ChevronLeft, Plus, Minus } from "lucide-react"

export default function CarritoPage() {
  const { items, updateItem, removeItem, isLoading } = useCart()

  // Calcular subtotal
  const subtotal = items.reduce((total, item) => {
    const precio = item.producto?.precio_descuento || item.producto?.precio || 0
    return total + precio * item.cantidad
  }, 0)

  // Calcular envío (gratis si el subtotal es mayor a 30€)
  const envio = subtotal > 30 ? 0 : 4.99

  // Calcular total
  const total = subtotal + envio

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Tu Carrito</h1>
        <p>Cargando...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Tu Carrito</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500 mb-6">Tu carrito está vacío</p>
          <Link href="/productos">
            <Button className="bg-[#0084cc]">Continuar Comprando</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Tu Carrito</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Productos en tu Carrito ({items.length})</h2>
              </div>
            </div>

            {items.map((item) => (
              <div key={item.id} className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <Image
                      src={item.producto?.imagen_url || "/placeholder.svg?height=80&width=80"}
                      alt={item.producto?.nombre || "Producto"}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="ml-4 flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-medium">{item.producto?.nombre}</h3>
                      </div>

                      <div className="flex items-center mt-3 md:mt-0">
                        <div className="flex items-center border border-gray-200 rounded-md mr-4">
                          <button
                            className="px-3 py-1 text-gray-500 hover:text-[#0084cc]"
                            onClick={() => updateItem(item.id, item.cantidad - 1)}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center">{item.cantidad}</span>
                          <button
                            className="px-3 py-1 text-gray-500 hover:text-[#0084cc]"
                            onClick={() => updateItem(item.id, item.cantidad + 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="font-medium">
                            €
                            {((item.producto?.precio_descuento || item.producto?.precio || 0) * item.cantidad).toFixed(
                              2,
                            )}
                          </div>
                          {item.producto?.precio_descuento && (
                            <div className="text-sm text-gray-500 line-through">
                              €{(item.producto.precio * item.cantidad).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <Button
                        variant="link"
                        className="text-[#0084cc] text-sm p-0 flex items-center"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="flex items-center justify-between">
            <Link href="/productos" className="text-[#0084cc] hover:underline flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Continuar Comprando
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold">Resumen del Pedido</h2>
            </div>

            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.length} productos)</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  {envio === 0 ? <span className="text-green-600">Gratis</span> : <span>€{envio.toFixed(2)}</span>}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                {envio === 0 && <div className="text-green-600 text-sm text-right">Envío gratis</div>}
              </div>

              {/* Wrapped the button with Link */}
              <Link href="/checkout" passHref>
                <Button className="bg-[#0084cc] hover:bg-[#006ba7] text-white w-full py-6 rounded-md text-lg mb-4">
                  Proceder al Pago
                </Button>
              </Link>

              <div className="text-center text-sm text-gray-500">
                <p>Envío gratis en pedidos superiores a €30</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
