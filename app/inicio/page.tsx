import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { CategoryCard } from "@/components/category-card"
import { Carousel } from "@/components/carousel"
import { ChevronRight, Star, TrendingUp, Gift, Truck } from "lucide-react"
import { supabase } from "@/lib/supabase"

async function getCategories() {
  const { data, error } = await supabase.from("categorias").select("id, nombre, imagen_url, slug").order("orden")
  if (error) {
 throw error
  }
  return data
}
export default function InicioPage() {
  return (
    <div className="min-h-screen">
      {/* Async functions to fetch data */}
      {/* This needs to be outside the component to be awaited */}
      {async function FeaturedProducts() {
        const { data, error } = await supabase
          .from("productos")
          .select("*, imagenes_producto!inner(url, es_principal), valoraciones_producto(valoracion_promedio)")
          .eq("destacado", true)
          .eq("imagenes_producto.es_principal", true);
        if (error) {
          console.error("Error fetching featured products:", error);
          return <p>Error loading featured products.</p>;
        }
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {data.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.nombre}
                price={product.precio}
                image={product.imagenes_producto[0]?.url || "/placeholder.svg"}
                rating={product.valoraciones_producto[0]?.valoracion_promedio || 0}
                discount={product.porcentaje_descuento || undefined}
              />
            ))}
          </div>
        );
      }()}

      {async function NewArrivals() {
        const { data, error } = await supabase
          .from("productos")
          .select("*, imagenes_producto!inner(url, es_principal), valoraciones_producto(valoracion_promedio)")
          .eq("nuevo", true)
          .eq("imagenes_producto.es_principal", true)
          .order("created_at", { ascending: false })
          .limit(4); // Limit to the first 4 new products
        if (error) {
          console.error("Error fetching new arrivals:", error);
          return <p>Error loading new arrivals.</p>;
        }
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {data.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.nombre}
                price={product.precio}
                image={product.imagenes_producto[0]?.url || "/placeholder.svg"}
                rating={product.valoraciones_producto[0]?.valoracion_promedio || 0}
                discount={product.porcentaje_descuento || undefined}
              />
            ))}
          </div>
        );
      }()}

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
            {/* For now, it remains with static data as the async fetch needs to be handled */}
 {
 getCategories().then((categories) => (
 categories.map((category) => (
 <CategoryCard
 key={category.id}
 name={category.nombre}
 image={category.imagen_url || ""} // Provide a default empty string if imagen_url can be null
 // count={0} // We don't have the product count yet from this simple query
 href={`/productos?categoria=${category.slug}`}
 />
 ))
 ))
 }
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

          {/* Featured Products rendered here */}
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

          {/* New Arrivals rendered here */}
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
