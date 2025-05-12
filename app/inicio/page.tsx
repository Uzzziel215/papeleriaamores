import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { CategoryCard } from "@/components/category-card"
import { Carousel } from "@/components/carousel"
import { ChevronRight, Star, TrendingUp, Gift, Truck } from "lucide-react"

export default function InicioPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#bdd5fc] py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Descubre Nuestra Colección de Papelería</h1>
            <p className="text-lg mb-6">
              Encuentra todo lo que necesitas para la escuela, oficina o tus proyectos creativos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-[#0084cc] hover:bg-[#006ba7] text-white px-8 py-6 rounded-full text-lg">
                Comprar Ahora
              </Button>
              <Button
                variant="outline"
                className="border-[#0084cc] text-[#0084cc] hover:bg-[#0084cc] hover:text-white px-8 py-6 rounded-full text-lg"
              >
                Ver Catálogo
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <Image src="/hero-image.png" alt="Papelería Amores" width={600} height={500} className="object-contain" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Categorías Populares</h2>
            <Link href="/categorias" className="text-[#0084cc] hover:underline flex items-center">
              Ver Todas
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            <CategoryCard
              name="Cuadernos"
              image="/category-notebooks.png"
              count={42}
              href="/productos?categoria=cuadernos"
            />
            <CategoryCard
              name="Bolígrafos"
              image="/category-pens.png"
              count={38}
              href="/productos?categoria=boligrafos"
            />
            <CategoryCard name="Arte" image="/category-art.png" count={56} href="/productos?categoria=arte" />
            <CategoryCard
              name="Organización"
              image="/category-organization.png"
              count={25}
              href="/productos?categoria=organizacion"
            />
            <CategoryCard
              name="Material Escolar"
              image="/category-school.png"
              count={31}
              href="/productos?categoria=escolar"
            />
            <CategoryCard
              name="Agendas"
              image="/category-planners.png"
              count={18}
              href="/productos?categoria=agendas"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[#f5f8ff]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Productos Destacados</h2>
            <Link href="/productos" className="text-[#0084cc] hover:underline flex items-center">
              Ver Todos
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 bg-[#0084cc] text-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ofertas Especiales</h2>
            <p className="text-lg mb-6">Aprovecha nuestros descuentos de hasta el 30% en productos seleccionados.</p>
            <Button className="bg-white text-[#0084cc] hover:bg-gray-100 px-8 py-6 rounded-full text-lg">
              Ver Ofertas
            </Button>
          </div>
          <div className="md:w-1/2 relative">
            <Image
              src="/banner-image.png"
              alt="Ofertas Especiales"
              width={500}
              height={400}
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Nuevos Productos</h2>
            <Link href="/productos?sort=newest" className="text-[#0084cc] hover:underline flex items-center">
              Ver Todos
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-[#f5f8ff]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Lo Que Dicen Nuestros Clientes</h2>

          <Carousel>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Los productos son de excelente calidad. El cuaderno que compré tiene un papel grueso que no traspasa la
                tinta. Definitivamente volveré a comprar."
              </p>
              <div className="flex items-center">
                <div className="relative w-12 h-12">
                  <Image src="/avatar-1.png" alt="Avatar" fill className="rounded-full object-cover" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">María García</h4>
                  <p className="text-sm text-gray-500">Cliente desde 2022</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "El servicio al cliente es excepcional. Tuve un problema con mi pedido y lo resolvieron rápidamente. Los
                productos son hermosos y de gran calidad."
              </p>
              <div className="flex items-center">
                <div className="relative w-12 h-12">
                  <Image src="/avatar-2.png" alt="Avatar" fill className="rounded-full object-cover" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Carlos Rodríguez</h4>
                  <p className="text-sm text-gray-500">Cliente desde 2021</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Me encanta la variedad de productos que ofrecen. Los bolígrafos pastel son mis favoritos, escriben muy
                suave y los colores son preciosos."
              </p>
              <div className="flex items-center">
                <div className="relative w-12 h-12">
                  <Image src="/avatar-3.png" alt="Avatar" fill className="rounded-full object-cover" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Laura Martínez</h4>
                  <p className="text-sm text-gray-500">Cliente desde 2023</p>
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#bdd5fc] rounded-full flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-[#0084cc]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Envío Gratis</h3>
              <p className="text-gray-600">En todos los pedidos superiores a €30. Entrega rápida y segura.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#bdd5fc] rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-[#0084cc]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad Garantizada</h3>
              <p className="text-gray-600">
                Todos nuestros productos son seleccionados cuidadosamente para asegurar la mejor calidad.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#bdd5fc] rounded-full flex items-center justify-center mb-4">
                <Gift className="h-8 w-8 text-[#0084cc]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Programa de Fidelidad</h3>
              <p className="text-gray-600">
                Gana puntos con cada compra y canjéalos por descuentos en futuras compras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-[#0084cc] text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Suscríbete a Nuestra Newsletter</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Recibe las últimas novedades, ofertas exclusivas y consejos creativos directamente en tu bandeja de entrada.
          </p>

          <div className="flex flex-col md:flex-row max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 rounded-l-full text-black focus:outline-none md:rounded-r-none rounded-r-full mb-4 md:mb-0"
            />
            <Button className="bg-[#ffaa00] hover:bg-[#e69900] text-white px-8 py-3 rounded-r-full md:rounded-l-none rounded-l-full">
              Suscribirse
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
