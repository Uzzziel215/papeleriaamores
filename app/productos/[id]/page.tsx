import Image from "next/image"
import { Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, Star, ChevronDown, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductCard } from "@/components/product-card"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // En una aplicación real, obtendríamos los datos del producto según el ID
  const productId = params.id

  return (
    <div className="min-h-screen bg-[#f5f8ff]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Productos", href: "/productos" },
            { label: "Cuaderno Espiral Colorido", href: `/productos/${productId}`, active: true },
          ]}
        />

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="relative aspect-square mb-4 border border-gray-100 rounded-lg overflow-hidden">
                <Image
                  src="/product-notebook-large.png"
                  alt="Cuaderno Espiral Colorido"
                  fill
                  className="object-contain"
                />
                <div className="absolute top-4 left-4 bg-[#ff6b6b] text-white text-sm font-medium px-2 py-1 rounded">
                  -15%
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="relative aspect-square border border-gray-100 rounded-lg overflow-hidden cursor-pointer hover:border-[#0084cc]"
                  >
                    <Image
                      src={`/product-notebook-thumb-${i}.png`}
                      alt={`Thumbnail ${i}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">4.5 (128 reseñas)</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-2">Cuaderno Espiral Colorido</h1>

              <div className="mb-4">
                <span className="text-sm text-gray-500">SKU: CN-12345 | </span>
                <span className="text-sm text-green-600">En stock (25 unidades)</span>
              </div>

              <div className="flex items-center mb-6">
                <span className="text-3xl font-bold text-[#0084cc]">€12.99</span>
                <span className="ml-3 text-xl text-gray-400 line-through">€15.29</span>
                <span className="ml-3 bg-[#ff6b6b] text-white text-sm font-medium px-2 py-1 rounded">Ahorra €2.30</span>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Cuaderno de espiral con diseño colorido, perfecto para tomar notas, dibujar o planificar. Papel de
                  alta calidad de 100 g/m² que evita que la tinta traspase.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Tamaño</h4>
                    <div className="relative">
                      <select className="w-full appearance-none bg-white border border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0084cc]">
                        <option>A5 (14.8 x 21 cm)</option>
                        <option>A4 (21 x 29.7 cm)</option>
                        <option>A6 (10.5 x 14.8 cm)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Tipo de Papel</h4>
                    <div className="relative">
                      <select className="w-full appearance-none bg-white border border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0084cc]">
                        <option>Cuadriculado</option>
                        <option>Líneas</option>
                        <option>Puntos</option>
                        <option>Liso</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-1">Color</h4>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer border-2 border-white ring-2 ring-[#0084cc]"></div>
                    <div className="w-8 h-8 rounded-full bg-pink-500 cursor-pointer border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-yellow-500 cursor-pointer border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer border-2 border-white"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <div className="flex items-center border border-gray-200 rounded-md mr-4">
                  <button className="px-3 py-2 text-gray-500 hover:text-[#0084cc]">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center">1</span>
                  <button className="px-3 py-2 text-gray-500 hover:text-[#0084cc]">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button className="bg-[#0084cc] hover:bg-[#006ba7] text-white px-8 py-6 rounded-full text-lg flex-1">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Añadir al Carrito
                </Button>

                <Button variant="outline" className="ml-3 p-3 rounded-full border-gray-200">
                  <Heart className="h-5 w-5 text-gray-500" />
                </Button>

                <Button variant="outline" className="ml-3 p-3 rounded-full border-gray-200">
                  <Share2 className="h-5 w-5 text-gray-500" />
                </Button>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-[#0084cc] mr-3" />
                    <div>
                      <h4 className="text-sm font-medium">Envío Gratis</h4>
                      <p className="text-xs text-gray-500">En pedidos superiores a €30</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-[#0084cc] mr-3" />
                    <div>
                      <h4 className="text-sm font-medium">Garantía de Calidad</h4>
                      <p className="text-xs text-gray-500">100% productos originales</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <RotateCcw className="h-5 w-5 text-[#0084cc] mr-3" />
                    <div>
                      <h4 className="text-sm font-medium">Devolución Fácil</h4>
                      <p className="text-xs text-gray-500">14 días para devoluciones</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <Tabs defaultValue="description">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas (128)</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="text-gray-600">
              <h3 className="text-lg font-semibold mb-4">Cuaderno Espiral Colorido</h3>
              <p className="mb-4">
                Este cuaderno de espiral con diseño colorido es perfecto para tomar notas, dibujar o planificar.
                Fabricado con papel de alta calidad de 100 g/m² que evita que la tinta traspase, proporcionando una
                experiencia de escritura suave y agradable.
              </p>
              <p className="mb-4">
                La encuadernación en espiral permite que el cuaderno se abra completamente plano, facilitando la
                escritura en cualquier página. Además, incluye una banda elástica para mantener el cuaderno cerrado
                cuando no está en uso y un bolsillo interior para guardar notas sueltas o pequeños documentos.
              </p>
              <p>
                Disponible en varios colores vibrantes y diferentes tipos de papel (cuadriculado, líneas, puntos o liso)
                para adaptarse a tus necesidades. El tamaño A5 es perfecto para llevar en tu mochila o bolso, mientras
                que el A4 ofrece más espacio para tus ideas.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Características</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Papel de alta calidad de 100 g/m²</li>
                    <li>Encuadernación en espiral resistente</li>
                    <li>80 hojas (160 páginas)</li>
                    <li>Banda elástica para cierre</li>
                    <li>Bolsillo interior</li>
                    <li>Disponible en varios colores y tamaños</li>
                    <li>Diferentes tipos de papel</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Usos Recomendados</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Tomar notas en clase o reuniones</li>
                    <li>Diario personal</li>
                    <li>Planificación diaria o semanal</li>
                    <li>Dibujo y bocetos</li>
                    <li>Bullet journaling</li>
                    <li>Listas de tareas</li>
                    <li>Proyectos creativos</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specifications">
              <div className="border-b border-gray-200">
                <div className="grid grid-cols-3 py-3">
                  <div className="col-span-1 font-medium">Marca</div>
                  <div className="col-span-2">Papelería Amores</div>
                </div>
              </div>
              <div className="border-b border-gray-200">
                <div className="grid grid-cols-3 py-3">
                  <div className="col-span-1 font-medium">Modelo</div>
                  <div className="col-span-2">CN-12345</div>
                </div>
              </div>
              <div className="border-b border-gray-200">
                <div className="grid grid-cols-3 py-3">
                  <div className="col-span-1 font-medium">Dimensiones</div>
                  <div className="col-span-2">A5: 14.8 x 21 cm / A4: 21 x 29.7 cm / A6: 10.5 x 14.8 cm</div>
                </div>
              </div>
              <div className="border-b border-gray-200">
                <div className="grid grid-cols-3 py-3">
                  <div className="col-span-1 font-medium">Número de Páginas</div>
                  <div className="col-span-2">160 páginas (80 hojas)</div>
                </div>
              </div>
              <div className="border-b border-gray-200">
                <div className="grid grid-cols-3 py-3">
                  <div className="col-span-1 font-medium">Gramaje del Papel</div>
                  <div className="col-span-2">100 g/m²</div>
                </div>
              </div>
              <div className="border-b border-gray-200">
                <div className="grid grid-cols-3 py-3">
                  <div className="col-span-1 font-medium">Tipo de Papel</div>
                  <div className="col-span-2">Cuadriculado, Líneas, Puntos, Liso</div>
                </div>
              </div>
              <div className="border-b border-gray-200">
                <div className="grid grid-cols-3 py-3">
                  <div className="col-span-1 font-medium">Colores Disponibles</div>
                  <div className="col-span-2">Azul, Rosa, Verde, Amarillo, Púrpura</div>
                </div>
              </div>
              <div className="border-b border-gray-200">
                <div className="grid grid-cols-3 py-3">
                  <div className="col-span-1 font-medium">Material de la Cubierta</div>
                  <div className="col-span-2">Cartón rígido con acabado mate</div>
                </div>
              </div>
              <div className="border-b border-gray-200">
                <div className="grid grid-cols-3 py-3">
                  <div className="col-span-1 font-medium">Tipo de Encuadernación</div>
                  <div className="col-span-2">Espiral metálica</div>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-3 py-3">
                  <div className="col-span-1 font-medium">Características Adicionales</div>
                  <div className="col-span-2">Banda elástica para cierre, bolsillo interior</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">Valoración de Clientes</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-lg font-medium">4.5</span>
                      <span className="ml-2 text-sm text-gray-500">basado en 128 reseñas</span>
                    </div>
                  </div>

                  <Button className="bg-[#0084cc] hover:bg-[#006ba7] text-white px-6 py-2 rounded-full">
                    Escribir una Reseña
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-24 text-sm">5 estrellas</div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-yellow-400 h-full rounded-full" style={{ width: "70%" }}></div>
                        </div>
                        <div className="w-12 text-sm text-right">70%</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 text-sm">4 estrellas</div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-yellow-400 h-full rounded-full" style={{ width: "20%" }}></div>
                        </div>
                        <div className="w-12 text-sm text-right">20%</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 text-sm">3 estrellas</div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-yellow-400 h-full rounded-full" style={{ width: "5%" }}></div>
                        </div>
                        <div className="w-12 text-sm text-right">5%</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 text-sm">2 estrellas</div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-yellow-400 h-full rounded-full" style={{ width: "3%" }}></div>
                        </div>
                        <div className="w-12 text-sm text-right">3%</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 text-sm">1 estrella</div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-yellow-400 h-full rounded-full" style={{ width: "2%" }}></div>
                        </div>
                        <div className="w-12 text-sm text-right">2%</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-3">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="relative">
                        <select className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0084cc]">
                          <option>Más recientes</option>
                          <option>Más antiguos</option>
                          <option>Mejor valorados</option>
                          <option>Peor valorados</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>

                      <div className="relative">
                        <select className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0084cc]">
                          <option>Todas las estrellas</option>
                          <option>5 estrellas</option>
                          <option>4 estrellas</option>
                          <option>3 estrellas</option>
                          <option>2 estrellas</option>
                          <option>1 estrella</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-start mb-2">
                    <Image src="/avatar-1.png" alt="Avatar" width={40} height={40} className="rounded-full mr-3" />
                    <div>
                      <h4 className="font-medium">María García</h4>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">hace 2 días</span>
                      </div>
                    </div>
                  </div>
                  <h5 className="font-medium mb-2">¡Excelente cuaderno para bullet journaling!</h5>
                  <p className="text-gray-600 mb-4">
                    Compré este cuaderno para empezar mi bullet journal y estoy encantada con la calidad. El papel es
                    grueso y no traspasa la tinta, incluso con rotuladores. La encuadernación en espiral permite que se
                    abra completamente plano, lo que facilita mucho la escritura. Los colores son preciosos y vibrantes.
                    Definitivamente compraré más cuando termine este.
                  </p>
                  <div className="flex space-x-2 mb-4">
                    <Image
                      src="/review-image-1.png"
                      alt="Review image"
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                    <Image
                      src="/review-image-2.png"
                      alt="Review image"
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="flex items-center text-sm">
                    <button className="text-gray-500 hover:text-[#0084cc] flex items-center">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        ></path>
                      </svg>
                      Útil (12)
                    </button>
                    <button className="text-gray-500 hover:text-[#0084cc] flex items-center ml-4">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2"
                        ></path>
                      </svg>
                      No útil (2)
                    </button>
                    <button className="text-[#0084cc] hover:underline ml-auto">Responder</button>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-start mb-2">
                    <Image src="/avatar-2.png" alt="Avatar" width={40} height={40} className="rounded-full mr-3" />
                    <div>
                      <h4 className="font-medium">Carlos Rodríguez</h4>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">hace 1 semana</span>
                      </div>
                    </div>
                  </div>
                  <h5 className="font-medium mb-2">Buena calidad pero el color no es exactamente como en la foto</h5>
                  <p className="text-gray-600 mb-4">
                    El cuaderno es de buena calidad, el papel es grueso y la encuadernación parece resistente. Sin
                    embargo, el color azul que recibí es más oscuro que el que se muestra en las fotos. No es un gran
                    problema, pero creo que es importante mencionarlo. Por lo demás, estoy satisfecho con la compra.
                  </p>
                  <div className="flex items-center text-sm">
                    <button className="text-gray-500 hover:text-[#0084cc] flex items-center">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        ></path>
                      </svg>
                      Útil (8)
                    </button>
                    <button className="text-gray-500 hover:text-[#0084cc] flex items-center ml-4">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2"
                        ></path>
                      </svg>
                      No útil (1)
                    </button>
                    <button className="text-[#0084cc] hover:underline ml-auto">Responder</button>
                  </div>
                </div>

                <div>
                  <div className="flex items-start mb-2">
                    <Image src="/avatar-3.png" alt="Avatar" width={40} height={40} className="rounded-full mr-3" />
                    <div>
                      <h4 className="font-medium">Laura Martínez</h4>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">hace 2 semanas</span>
                      </div>
                    </div>
                  </div>
                  <h5 className="font-medium mb-2">¡El mejor cuaderno que he tenido!</h5>
                  <p className="text-gray-600 mb-4">
                    Llevo años buscando un cuaderno con papel de calidad que no traspase la tinta y por fin lo he
                    encontrado. La calidad es excepcional, el diseño es precioso y el tamaño A5 es perfecto para llevar
                    en el bolso. Ya he comprado tres más para regalar a mis amigas. ¡Totalmente recomendado!
                  </p>
                  <div className="flex items-center text-sm">
                    <button className="text-gray-500 hover:text-[#0084cc] flex items-center">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        ></path>
                      </svg>
                      Útil (15)
                    </button>
                    <button className="text-gray-500 hover:text-[#0084cc] flex items-center ml-4">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2"
                        ></path>
                      </svg>
                      No útil (0)
                    </button>
                    <button className="text-[#0084cc] hover:underline ml-auto">Responder</button>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  className="border-[#0084cc] text-[#0084cc] hover:bg-[#0084cc] hover:text-white px-6 py-2 rounded-full"
                >
                  Cargar más reseñas
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <ProductCard id="2" name="Set de Bolígrafos Pastel" price={8.5} image="/product-pens.png" rating={4.8} />
            <ProductCard
              id="5"
              name="Marcadores Acuarelables"
              price={15.99}
              image="/product-markers.png"
              rating={4.6}
            />
            <ProductCard
              id="8"
              name="Set de Lápices de Colores"
              price={14.5}
              image="/product-colored-pencils.png"
              rating={4.9}
              discount={25}
            />
            <ProductCard
              id="4"
              name="Agenda 2023 Diseño Floral"
              price={18.75}
              image="/product-planner.png"
              rating={4.7}
            />
          </div>
        </div>

        {/* Recently Viewed */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Vistos Recientemente</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <ProductCard
              id="3"
              name="Organizador de Escritorio"
              price={24.99}
              image="/product-organizer.png"
              rating={4.2}
              discount={20}
            />
            <ProductCard
              id="6"
              name="Bloc de Notas Adhesivas"
              price={4.99}
              image="/product-sticky-notes.png"
              rating={4.3}
              discount={10}
            />
            <ProductCard
              id="7"
              name="Estuche Escolar Multicolor"
              price={9.99}
              image="/product-pencil-case.png"
              rating={4.4}
            />
            <ProductCard id="9" name="Carpeta Clasificadora A4" price={7.25} image="/product-folder.png" rating={4.1} />
          </div>
        </div>
      </div>
    </div>
  )
}
