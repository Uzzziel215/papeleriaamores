import { Grid, List, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { Breadcrumb } from "@/components/breadcrumb"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

export default function ProductosPage() {
  return (
    <div className="min-h-screen bg-[#f5f8ff]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Productos", href: "/productos", active: true },
          ]}
        />

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Todos los Productos</h1>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Grid className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <List className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center">
              <span className="text-sm mr-2">Ordenar por:</span>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0084cc]">
                  <option>Más relevantes</option>
                  <option>Precio: Menor a mayor</option>
                  <option>Precio: Mayor a menor</option>
                  <option>Más nuevos</option>
                  <option>Mejor valorados</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filtros</h3>
                <Button variant="link" className="text-[#0084cc] text-sm p-0">
                  Limpiar todo
                </Button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categorías</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox id="cat-cuadernos" />
                    <label htmlFor="cat-cuadernos" className="ml-2 text-sm">
                      Cuadernos
                    </label>
                    <span className="ml-auto text-xs text-gray-500">42</span>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="cat-boligrafos" />
                    <label htmlFor="cat-boligrafos" className="ml-2 text-sm">
                      Bolígrafos
                    </label>
                    <span className="ml-auto text-xs text-gray-500">38</span>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="cat-organizacion" />
                    <label htmlFor="cat-organizacion" className="ml-2 text-sm">
                      Organización
                    </label>
                    <span className="ml-auto text-xs text-gray-500">25</span>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="cat-arte" />
                    <label htmlFor="cat-arte" className="ml-2 text-sm">
                      Arte
                    </label>
                    <span className="ml-auto text-xs text-gray-500">56</span>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="cat-escolar" />
                    <label htmlFor="cat-escolar" className="ml-2 text-sm">
                      Material Escolar
                    </label>
                    <span className="ml-auto text-xs text-gray-500">31</span>
                  </div>
                </div>
                <Button variant="link" className="text-[#0084cc] text-sm p-0 mt-2">
                  Ver más
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Rango de Precio</h4>
                <Slider defaultValue={[10, 50]} max={100} step={1} className="mb-4" />
                <div className="flex items-center justify-between">
                  <div className="w-20 px-2 py-1 bg-gray-100 rounded text-sm text-center">€5</div>
                  <span className="text-sm text-gray-500">hasta</span>
                  <div className="w-20 px-2 py-1 bg-gray-100 rounded text-sm text-center">€50</div>
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Marcas</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox id="brand-1" />
                    <label htmlFor="brand-1" className="ml-2 text-sm">
                      Moleskine
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="brand-2" />
                    <label htmlFor="brand-2" className="ml-2 text-sm">
                      Pilot
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="brand-3" />
                    <label htmlFor="brand-3" className="ml-2 text-sm">
                      Faber-Castell
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="brand-4" />
                    <label htmlFor="brand-4" className="ml-2 text-sm">
                      Staedtler
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="brand-5" />
                    <label htmlFor="brand-5" className="ml-2 text-sm">
                      Leuchtturm1917
                    </label>
                  </div>
                </div>
                <Button variant="link" className="text-[#0084cc] text-sm p-0 mt-2">
                  Ver más
                </Button>
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Valoraciones</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox id="rating-5" />
                    <label htmlFor="rating-5" className="ml-2 text-sm flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="rating-4" />
                    <label htmlFor="rating-4" className="ml-2 text-sm flex items-center">
                      <div className="flex">
                        {[...Array(4)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                        <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                      <span className="ml-1">y más</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="font-medium mb-3">Disponibilidad</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox id="availability-1" />
                    <label htmlFor="availability-1" className="ml-2 text-sm">
                      En stock
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="availability-2" />
                    <label htmlFor="availability-2" className="ml-2 text-sm">
                      Oferta
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <ProductCard
                id="1"
                name="Cuaderno Espiral Colorido"
                price={12.99}
                image="/product-notebook.png"
                rating={4.5}
                discount={15}
              />
              <ProductCard id="2" name="Set de Bolígrafos Pastel" price={8.5} image="/product-pens.png" rating={4.8} />
              <ProductCard
                id="3"
                name="Organizador de Escritorio"
                price={24.99}
                image="/product-organizer.png"
                rating={4.2}
                discount={20}
              />
              <ProductCard
                id="4"
                name="Agenda 2023 Diseño Floral"
                price={18.75}
                image="/product-planner.png"
                rating={4.7}
              />
              <ProductCard
                id="5"
                name="Marcadores Acuarelables"
                price={15.99}
                image="/product-markers.png"
                rating={4.6}
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
              <ProductCard
                id="8"
                name="Set de Lápices de Colores"
                price={14.5}
                image="/product-colored-pencils.png"
                rating={4.9}
                discount={25}
              />
              <ProductCard
                id="9"
                name="Carpeta Clasificadora A4"
                price={7.25}
                image="/product-folder.png"
                rating={4.1}
              />
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="w-9 h-9 p-0">
                  <span className="sr-only">Página anterior</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </Button>
                <Button variant="outline" size="sm" className="w-9 h-9 p-0 bg-[#0084cc] text-white border-[#0084cc]">
                  1
                </Button>
                <Button variant="outline" size="sm" className="w-9 h-9 p-0">
                  2
                </Button>
                <Button variant="outline" size="sm" className="w-9 h-9 p-0">
                  3
                </Button>
                <span className="text-gray-500">...</span>
                <Button variant="outline" size="sm" className="w-9 h-9 p-0">
                  8
                </Button>
                <Button variant="outline" size="sm" className="w-9 h-9 p-0">
                  <span className="sr-only">Página siguiente</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
