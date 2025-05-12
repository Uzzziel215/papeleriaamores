import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/breadcrumb"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#f5f8ff]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Carrito", href: "/carrito" },
            { label: "Checkout", href: "/checkout", active: true },
          ]}
        />

        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="flex-1">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Dirección de Envío</h2>
                  <Button variant="link" className="text-[#0084cc] text-sm p-0">
                    Editar
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" placeholder="Tu nombre" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellidos</Label>
                    <Input id="lastName" placeholder="Tus apellidos" className="mt-1" />
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" placeholder="Calle y número" className="mt-1" />
                </div>

                <div className="mb-4">
                  <Label htmlFor="addressDetails">Detalles adicionales (opcional)</Label>
                  <Input id="addressDetails" placeholder="Apartamento, piso, etc." className="mt-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="postalCode">Código Postal</Label>
                    <Input id="postalCode" placeholder="28001" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input id="city" placeholder="Madrid" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="province">Provincia</Label>
                    <Input id="province" placeholder="Madrid" className="mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" placeholder="612 345 678" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="tu@email.com" className="mt-1" />
                  </div>
                </div>

                <div className="flex items-center">
                  <Checkbox id="saveAddress" />
                  <label htmlFor="saveAddress" className="ml-2 text-sm">
                    Guardar esta dirección para futuras compras
                  </label>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold">Método de Envío</h2>
              </div>

              <div className="p-6">
                <RadioGroup defaultValue="standard">
                  <div className="flex items-center justify-between border border-gray-200 rounded-md p-4 mb-3">
                    <div className="flex items-center">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="ml-2">
                        <div>
                          <span className="font-medium">Envío Estándar</span>
                          <p className="text-sm text-gray-500">Entrega en 3-5 días laborables</p>
                        </div>
                      </Label>
                    </div>
                    <span className="font-medium">€4.99</span>
                  </div>

                  <div className="flex items-center justify-between border border-gray-200 rounded-md p-4 mb-3">
                    <div className="flex items-center">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="ml-2">
                        <div>
                          <span className="font-medium">Envío Express</span>
                          <p className="text-sm text-gray-500">Entrega en 1-2 días laborables</p>
                        </div>
                      </Label>
                    </div>
                    <span className="font-medium">€9.99</span>
                  </div>

                  <div className="flex items-center justify-between border border-gray-200 rounded-md p-4">
                    <div className="flex items-center">
                      <RadioGroupItem value="store" id="store" />
                      <Label htmlFor="store" className="ml-2">
                        <div>
                          <span className="font-medium">Recogida en Tienda</span>
                          <p className="text-sm text-gray-500">Disponible en 24 horas</p>
                        </div>
                      </Label>
                    </div>
                    <span className="font-medium">Gratis</span>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold">Método de Pago</h2>
              </div>

              <div className="p-6">
                <RadioGroup defaultValue="card">
                  <div className="flex items-center justify-between border border-gray-200 rounded-md p-4 mb-3">
                    <div className="flex items-center">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="ml-2">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 mr-2" />
                          <span className="font-medium">Tarjeta de Crédito/Débito</span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-md p-4 mb-3 ml-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                        <Input id="cardName" placeholder="Nombre completo" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Fecha de Caducidad</Label>
                        <Input id="expiryDate" placeholder="MM/AA" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" className="mt-1" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border border-gray-200 rounded-md p-4 mb-3">
                    <div className="flex items-center">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="ml-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
                          <span className="font-medium">PayPal</span>
                        </div>
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border border-gray-200 rounded-md p-4">
                    <div className="flex items-center">
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Label htmlFor="transfer" className="ml-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
                          <span className="font-medium">Transferencia Bancaria</span>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Back to Cart */}
            <div className="flex items-center justify-between">
              <Link href="/carrito" className="text-[#0084cc] hover:underline flex items-center">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Volver al Carrito
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
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src="/product-notebook.png"
                        alt="Cuaderno Espiral Colorido"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="text-sm font-medium">Cuaderno Espiral Colorido</h4>
                      <div className="text-xs text-gray-500 mt-1">
                        <span>Azul</span> | <span>A5</span> | <span>Qty: 1</span>
                      </div>
                      <div className="text-sm font-medium mt-1">€12.99</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image src="/product-pens.png" alt="Set de Bolígrafos Pastel" fill className="object-contain" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="text-sm font-medium">Set de Bolígrafos Pastel</h4>
                      <div className="text-xs text-gray-500 mt-1">
                        <span>10 unidades</span> | <span>Qty: 2</span>
                      </div>
                      <div className="text-sm font-medium mt-1">€17.00</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src="/product-organizer.png"
                        alt="Organizador de Escritorio"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="text-sm font-medium">Organizador de Escritorio</h4>
                      <div className="text-xs text-gray-500 mt-1">
                        <span>Madera</span> | <span>Qty: 1</span>
                      </div>
                      <div className="text-sm font-medium mt-1">€19.99</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal (4 items)</span>
                    <span>€49.98</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Descuento</span>
                    <span className="text-green-600">-€7.30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span>€4.99</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>€47.67</span>
                  </div>
                  <div className="text-green-600 text-sm text-right">Ahorras €7.30</div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <Checkbox id="terms" />
                    <label htmlFor="terms" className="ml-2 text-sm">
                      He leído y acepto los{" "}
                      <Link href="/terminos" className="text-[#0084cc] hover:underline">
                        términos y condiciones
                      </Link>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <Checkbox id="newsletter" />
                    <label htmlFor="newsletter" className="ml-2 text-sm">
                      Suscribirme a la newsletter
                    </label>
                  </div>
                </div>

                <Button className="bg-[#0084cc] hover:bg-[#006ba7] text-white w-full py-6 rounded-full text-lg mb-4">
                  Confirmar Pedido
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <p>
                    Tus datos personales serán utilizados para procesar tu pedido, mejorar tu experiencia en nuestra web
                    y otros propósitos descritos en nuestra política de privacidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
