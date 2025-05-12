import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Search, ShoppingCart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ProductCard"
import { CategoryCard } from "@/components/CategoryCard"
import { PromoSlider } from "@/components/promo-slider"
import { supabase } from "@/lib/supabase"

export default async function Home() {
  // Obtener productos destacados
  const { data: productosDestacados } = await supabase.from("productos").select("*").eq("destacado", true).limit(4)

  // Obtener categorías
  const { data: categorias } = await supabase.from("categorias").select("*").limit(4)

  return (
    <div className="min-h-screen bg-[#f5f8ff]">
      {/* Header */}
      <header className="bg-[#bdd5fc] py-4 px-6 md:px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center">
          <Menu className="mr-4 h-6 w-6 md:hidden" />
          <Link href="/">
            <div className="flex items-center">
              <Image src="/logo.png" alt="Papelería Amores Logo" width={60} height={60} className="object-contain" />
              <span className="ml-2 text-xl font-bold hidden md:block">Papelería Amores</span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/categorias" className="hover:text-[#0084cc]">
            Categorías
          </Link>
          <Link href="/ofertas" className="hover:text-[#0084cc]">
            Ofertas
          </Link>
          <Link href="/nuevos" className="hover:text-[#0084cc]">
            Nuevos Productos
          </Link>
          <Link href="/contacto" className="hover:text-[#0084cc]">
            Contacto
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="py-2 px-4 pr-10 rounded-full text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0084cc] w-[200px] lg:w-[300px]"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <Link href="/carrito">
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-[#ff6b6b] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center">
            <Link href="/cuenta">
              <Image
                src="/avatar.png"
                alt="Avatar"
                width={32}
                height={32}
                className="rounded-full border-2 border-white"
              />
            </Link>
          </div>

          <div className="flex items-center text-sm">
            <span>ES</span>
            <ChevronDown className="ml-1 h-4 w-4" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#bdd5fc] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Papelería con Estilo</h1>
            <p className="text-lg mb-8">
              Descubre nuestra colección de productos de papelería únicos y coloridos para expresar tu creatividad.
            </p>
            <div className="flex space-x-4">
              <Button className="bg-[#0084cc] hover:bg-[#006ba7] text-white">Explorar Ahora</Button>
              <Button variant="outline" className="border-[#0084cc] text-[#0084cc]">
                Ofertas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Categorías Populares</h2>
            <Link href="/categorias" className="text-[#0084cc] hover:underline">
              Ver Todas
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categorias?.map((categoria) => (
              <CategoryCard
                key={categoria.id}
                id={categoria.id}
                name={categoria.nombre}
                imageUrl={categoria.imagen_url || "/placeholder.svg?height=200&width=200"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promotions Slider */}
      <section className="py-8 px-6 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Ofertas Especiales</h2>
            <Link href="/ofertas" className="text-[#0084cc] font-medium hover:underline">
              Ver Todas
            </Link>
          </div>

          <PromoSlider />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Productos Destacados</h2>
            <Link href="/productos" className="text-[#0084cc] hover:underline">
              Ver Todos
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosDestacados?.map((producto) => (
              <ProductCard
                key={producto.id}
                id={producto.id}
                name={producto.nombre}
                price={producto.precio}
                discountPrice={producto.precio_descuento}
                imageUrl={producto.imagen_url || "/placeholder.svg?height=300&width=300"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-[#0084cc] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">¡Únete a Nuestra Newsletter!</h2>
          <p className="mb-8 max-w-xl mx-auto">
            Recibe las últimas novedades, ofertas exclusivas y consejos creativos directamente en tu correo.
          </p>

          <div className="flex flex-col md:flex-row max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-grow py-2 px-4 rounded-l-md text-black focus:outline-none md:rounded-r-none rounded-r-md mb-2 md:mb-0"
            />
            <Button className="bg-[#ffaa00] hover:bg-[#e69900] text-white rounded-r-md md:rounded-l-none rounded-l-md">
              Suscribirse
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#333] text-white py-12 px-6 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Image
                src="/logo-white.png"
                alt="Papelería Amores Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="ml-2 text-xl font-bold">Papelería Amores</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Tu tienda de papelería favorita con productos únicos y coloridos para expresar tu creatividad.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-gray-300 hover:text-white">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-gray-300 hover:text-white">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/nuevos" className="text-gray-300 hover:text-white">
                  Nuevos Productos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre-nosotros" className="text-gray-300 hover:text-white">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-white">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidad" className="text-gray-300 hover:text-white">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-gray-300 hover:text-white">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span>Calle Principal 123, Madrid, España</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <span>info@papeleriaamores.com</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                <span>+34 912 345 678</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  Lun-Vie: 9:00 - 20:00
                  <br />
                  Sáb: 10:00 - 15:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© 2023 Papelería Amores. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
