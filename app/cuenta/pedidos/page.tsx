import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/breadcrumb"
import { User, Package, Heart, CreditCard, LogOut, ShoppingBag, Clock, Check, Search } from "lucide-react"

export default function PedidosPage() {
  return (
    <div className="min-h-screen bg-[#f5f8ff]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Mi Cuenta", href: "/cuenta" },
            { label: "Mis Pedidos", href: "/cuenta/pedidos", active: true },
          ]}
        />

        <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  {/* Añadir relative al padre de la imagen */}
                  <div className="relative w-16 h-16">
                    <Image src="/avatar-profile.png" alt="Avatar" fill className="rounded-full object-cover" />
                  </div>
                  <div className="ml-4">
                    <h2 className="font-semibold">Laura Martínez</h2>
                    <p className="text-sm text-gray-500">Cliente desde 2022</p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <nav className="space-y-1">
                  <Link
                    href="/cuenta"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <User className="h-5 w-5 mr-3" />
                    <span>Mi Perfil</span>
                  </Link>
                  <Link
                    href="/cuenta/pedidos"
                    className="flex items-center px-3 py-2 text-[#0084cc] bg-blue-50 rounded-md"
                  >
                    <Package className="h-5 w-5 mr-3" />
                    <span>Mis Pedidos</span>
                  </Link>
                  <Link
                    href="/cuenta/favoritos"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <Heart className="h-5 w-5 mr-3" />
                    <span>Favoritos</span>
                  </Link>
                  <Link
                    href="/cuenta/pagos"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <CreditCard className="h-5 w-5 mr-3" />
                    <span>Métodos de Pago</span>
                  </Link>
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <button className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md w-full text-left">
                      <LogOut className="h-5 w-5 mr-3" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Historial de Pedidos</h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar pedido..."
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0084cc]"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <Tabs defaultValue="all">
                  <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="processing">En Proceso</TabsTrigger>
                    <TabsTrigger value="shipped">Enviados</TabsTrigger>
                    <TabsTrigger value="delivered">Entregados</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    <div className="space-y-6">
                      {/* Order 1 */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">Pedido #PA-12345</span>
                              <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Entregado
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Realizado el 15 de mayo, 2023</div>
                          </div>

                          <div className="flex items-center mt-3 md:mt-0">
                            <Button variant="outline" size="sm" className="text-sm mr-2">
                              Ver Detalles
                            </Button>
                            <Button variant="outline" size="sm" className="text-sm">
                              Repetir Pedido
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <Check className="h-5 w-5 text-green-500 mr-2" />
                              <span className="text-sm">Entregado el 18 de mayo, 2023</span>
                            </div>
                            <span className="font-medium">€47.67</span>
                          </div>

                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center">
                              {/* Añadir relative al padre de la imagen */}
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src="/product-notebook.png"
                                  alt="Cuaderno Espiral Colorido"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium">Cuaderno Espiral Colorido</h4>
                                <div className="text-xs text-gray-500 mt-1">Qty: 1</div>
                              </div>
                            </div>

                            <div className="flex items-center">
                              {/* Añadir relative al padre de la imagen */}
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src="/product-pens.png"
                                  alt="Set de Bolígrafos Pastel"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium">Set de Bolígrafos Pastel</h4>
                                <div className="text-xs text-gray-500 mt-1">Qty: 2</div>
                              </div>
                            </div>

                            <div className="flex items-center">
                              {/* Añadir relative al padre de la imagen */}
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src="/product-organizer.png"
                                  alt="Organizador de Escritorio"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium">Organizador de Escritorio</h4>
                                <div className="text-xs text-gray-500 mt-1">Qty: 1</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order 2 */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">Pedido #PA-12344</span>
                              <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Enviado
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Realizado el 2 de mayo, 2023</div>
                          </div>

                          <div className="flex items-center mt-3 md:mt-0">
                            <Button variant="outline" size="sm" className="text-sm mr-2">
                              Ver Detalles
                            </Button>
                            <Button variant="outline" size="sm" className="text-sm">
                              Seguimiento
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-blue-500 mr-2" />
                              <span className="text-sm">Estimado para el 22 de mayo, 2023</span>
                            </div>
                            <span className="font-medium">€32.50</span>
                          </div>

                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center">
                              {/* Añadir relative al padre de la imagen */}
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src="/product-markers.png"
                                  alt="Marcadores Acuarelables"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium">Marcadores Acuarelables</h4>
                                <div className="text-xs text-gray-500 mt-1">Qty: 1</div>
                              </div>
                            </div>

                            <div className="flex items-center">
                              {/* Añadir relative al padre de la imagen */}
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src="/product-planner.png"
                                  alt="Agenda 2023 Diseño Floral"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium">Agenda 2023 Diseño Floral</h4>
                                <div className="text-xs text-gray-500 mt-1">Qty: 1</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order 3 */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">Pedido #PA-12343</span>
                              <span className="ml-3 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                En Proceso
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Realizado el 18 de abril, 2023</div>
                          </div>

                          <div className="flex items-center mt-3 md:mt-0">
                            <Button variant="outline" size="sm" className="text-sm mr-2">
                              Ver Detalles
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-sm text-red-500 border-red-200 hover:bg-red-50"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <ShoppingBag className="h-5 w-5 text-yellow-500 mr-2" />
                              <span className="text-sm">Preparando pedido</span>
                            </div>
                            <span className="font-medium">€21.75</span>
                          </div>

                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center">
                              {/* Añadir relative al padre de la imagen */}
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src="/product-colored-pencils.png"
                                  alt="Set de Lápices de Colores"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium">Set de Lápices de Colores</h4>
                                <div className="text-xs text-gray-500 mt-1">Qty: 1</div>
                              </div>
                            </div>

                            <div className="flex items-center">
                              {/* Añadir relative al padre de la imagen */}
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src="/product-sticky-notes.png"
                                  alt="Bloc de Notas Adhesivas"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium">Bloc de Notas Adhesivas</h4>
                                <div className="text-xs text-gray-500 mt-1">Qty: 2</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="processing">
                    <div className="space-y-6">
                      {/* Order 3 (Processing) */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">Pedido #PA-12343</span>
                              <span className="ml-3 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                En Proceso
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Realizado el 18 de abril, 2023</div>
                          </div>

                          <div className="flex items-center mt-3 md:mt-0">
                            <Button variant="outline" size="sm" className="text-sm mr-2">
                              Ver Detalles
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-sm text-red-500 border-red-200 hover:bg-red-50"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <ShoppingBag className="h-5 w-5 text-yellow-500 mr-2" />
                              <span className="text-sm">Preparando pedido</span>
                            </div>
                            <span className="font-medium">€21.75</span>
                          </div>

                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center">
                               {/* Añadir relative al padre de la imagen */}
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src="/product-colored-pencils.png"
                                  alt="Set de Lápices de Colores"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium">Set de Lápices de Colores</h4>
                                <div className="text-xs text-gray-500 mt-1">Qty: 1</div>
                              </div>
                            </div>

                            <div className="flex items-center">
                               {/* Añadir relative al padre de la imagen */}
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src="/product-sticky-notes.png"
                                  alt="Bloc de Notas Adhesivas"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium">Bloc de Notas Adhesivas</h4>
                                <div className="text-xs text-gray-500 mt-1">Qty: 2</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="shipped">
                    <div className="space-y-6">
                      {/* Order 2 (Shipped) */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">Pedido #PA-12344</span>
                              <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Enviado
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Realizado el 2 de mayo, 2023</div>
                          </div>

                          <div className="flex items-center mt-3 md:mt-0">
                            <Button variant="outline" size="sm" className="text-sm mr-2">
                              Ver Detalles
                            </Button>
                            <Button variant="outline" size="sm" className="text-sm">
                              Seguimiento
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-blue-500 mr-2" />
                              <span className="text-sm">Estimado para el 22 de mayo, 2023</span>
                            </div>
                            <span className="font-medium">€32.50</span>
                          </div>

                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center">
                               {/* Añadir relative al padre de la imagen */}
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src="/product-markers.png"
                                  alt="Marcadores Acuarelables"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium">Marcadores Acuarelables</h4>
                                <div className="text-xs text-gray-500 mt-1">Qty: 1</div>
                              </div>
                            </div>

                            <div className="flex items-center">
                               {/* Añadir relative al padre de la imagen */}
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src="/product-planner.png"
                                  alt="Agenda 2023 Diseño Floral"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium">Agenda 2023 Diseño Floral</h4>
                                <div className="text-xs text-gray-500 mt-1">Qty: 1</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="delivered">
                    <div className="space-y-6">
                      {/* Order 1 (Delivered) */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">Pedido #PA-12345</span>
                              <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Entregado
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Realizado el 15 de mayo, 2023</div>
                          </div>

                          <div className="flex items-center mt-3 md:mt-0">
                            <Button variant="outline" size="sm" className="text-sm mr-2">
                              Ver Detalles
                            </Button>
                            <Button variant="outline" size="sm" className="text-sm">
                              Repetir Pedido
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <Check className="h-5 w-5 text-green-500 mr-2" />
                              <span className="text-sm">Entregado el 18 de mayo, 2023</span>
                            </div>
                            <span className="font-medium">€47.67</span>
                          </div>

                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center">
                              {/* Añadir relative al padre de la imagen */}
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src="/product-notebook.png"
                                  alt="Cuaderno Espiral Colorido"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium">Cuaderno Espiral Colorido</h4>
                                <div className="text-xs text-gray-500 mt-1">Qty: 1</div>
                              </div>
                            </div>

                            <div className="flex items-center">
                               {/* Añadir relative al padre de la imagen */}
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src="/product-pens.png"
                                  alt="Set de Bolígrafos Pastel"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium">Set de Bolígrafos Pastel</h4>
                                <div className="text-xs text-gray-500 mt-1">Qty: 2</div>
                              </div>
                            </div>

                            <div className="flex items-center">
                               {/* Añadir relative al padre de la imagen */}
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src="/product-organizer.png"
                                  alt="Organizador de Escritorio"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium">Organizador de Escritorio</h4>
                                <div className="text-xs text-gray-500 mt-1">Qty: 1</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
