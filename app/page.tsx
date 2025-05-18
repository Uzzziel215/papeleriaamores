import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CategoryCard } from "@/components/category-card"
import { Carousel } from "@/components/carousel"
import { ChevronRight, Star, TrendingUp, Gift, Truck } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { ProductGrid } from "@/components/product-grid"

async function getCategories() {
  const { data, error } = await supabase.from("categorias").select("id, nombre, imagen_url, slug").order("orden")
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
}

async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from("productos")
    .select("*, imagenes_producto!inner(url, es_principal)")
    .eq("destacado", true)
    .eq("imagenes_producto.es_principal", true);
  if (error) {
    console.error("Error fetching featured products:", JSON.stringify(error, null, 2));
    return [];
  }
  return data;
}

async function getNewArrivals() {
  const { data, error } = await supabase
    .from("productos")
    .select("*, imagenes_producto!inner(url, es_principal)")
    .eq("nuevo", true)
    .eq("imagenes_producto.es_principal", true)
    .order("created_at", { ascending: false })
    .limit(4);
  if (error) {
    console.error("Error fetching new arrivals:", JSON.stringify(error, null, 2));
    return [];
  }
  return data;
}

// Function to fetch approved reviews (simplified - no user join for now)
async function getReviews() {
  const { data, error } = await supabase
    .from('resenas')
    // SIMPLIFIED SELECT: Only fetch review data directly from resenas
    .select('id, contenido, valoracion')
    .eq('aprobado', true)
    .order('created_at', { ascending: false })
    .limit(5); // Fetch a few reviews

  if (error) {
    console.error("Error fetching reviews:", error);
    return []; // Return empty array on error
  }

  // Map the data to a more usable format (simplified user info)
  const reviews = data.map(review => ({
    id: review.id,
    content: review.contenido,
    rating: review.valoracion,
    // Placeholder user info since we are not joining profile data
    user_name: 'Usuario con Reseña', // Placeholder name
    user_image: '/placeholder-user.jpg', // Placeholder avatar
  }));

  return reviews;
}

const bannerImages = [
  "/banners/50e5badf-cdaf-45f4-a56f-85b95b189315.png",
  "/banners/ChatGPT Image 13 may 2025, 10_05_59 p.m..png",
  "/banners/ChatGPT Image 13 may 2025, 10_14_15 p.m..png",
];

export default async function InicioPage() {
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts();
  const newArrivals = await getNewArrivals();
  const reviews = await getReviews(); // Fetch reviews

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
              {/* Comprar ahora button with Link to featured products */}
              <Link href="/productos?filter=featured" passHref> {/* Changed href here */}
                <Button className="bg-[#0084cc] hover:bg-[#006ba7] text-white px-8 py-6 rounded-full text-lg">
                  Comprar Ahora
                </Button>
              </Link>
              {/* Ver catálogo button with Link to all products */}
              <Link href="/productos" passHref>
                <Button
                  variant="outline"
                  className="border-[#0084cc] text-[#0084cc] hover:bg-[#0084cc] hover:text-white px-8 py-6 rounded-full text-lg"
                >
                  Ver Catálogo
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative"> {/* Added relative position */}
            <Image src="/hero-image.png" alt="Papelería Amores" width={600} height={500} className="object-contain" />
          </div>
        </div>
      </section>

      {/* Banner/Ofertas Especiales Section */}
      <section className="py-16 bg-[#0084cc] text-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ofertas Especiales</h2>
            <p className="text-lg mb-6">Aprovecha nuestros descuentos de hasta el 30% en productos seleccionados.</p>
            {/* Ver ofertas button with Link and filter param */}
            <Link href="/productos?availability=on-offer" passHref>
              <Button className="bg-white text-[#0084cc] hover:bg-gray-100 px-8 py-6 rounded-full text-lg">
                Ver Ofertas
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2 relative"> {/* Added relative position */}
            {/* Carousel with banners */}
            <Carousel>
              {bannerImages.map((src, index) => (
                <div key={index} className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden"> {/* Added relative position */}
                  <Image
                    src={src}
                    alt={`Promotional Banner ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </Carousel>
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
            {categories.map((category) => (
              // CORRECTED: Ensure CategoryCard is NOT wrapped in an outer Link
              // CategoryCard handles its own internal Link/<a>
              <CategoryCard
                key={category.id}
                name={category.nombre}
                image={category.imagen_url || ""}
                href={`/productos?categoria=${category.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[#f5f8ff]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Productos Destacados</h2>
            <Link href="/productos?filter=featured" className="text-[#0084cc] hover:underline flex items-center"> {/* Modified href here */}
              Ver Todos
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <ProductGrid products={featuredProducts} /> {/* Use ProductGrid for featured products */}
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

          <ProductGrid products={newArrivals} /> {/* Use ProductGrid for new arrivals */}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-[#f5f8ff]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Lo Que Dicen Nuestros Clientes</h2>

          {reviews.length === 0 ? (
            // Case 0 reviews: Show message directly
            <div className="bg-white p-6 rounded-lg shadow-sm text-center flex justify-center items-center h-full">
               <p className="text-gray-600">No hay reseñas disponibles en este momento.</p>
            </div>
          ) : reviews.length === 1 ? (
            // Case 1 review: Show single review card directly
            reviews.map((review) => (
               <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm"> {/* Testimonial card container */}
                 <div className="flex mb-4">
                   {/* Display rating stars */}
                   {[...Array(5)].map((_, i) => (
                     <Star
                       key={i}
                       className={`h-5 w-5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                     />
                   ))}
                 </div>
                 {/* Display review content */}
                 <p className="text-gray-600 mb-4">
                   {review.content}
                 </p>
                 <div className="flex items-center">
                   {/* Display user image - parent needs relative position */}
                   <div className="relative w-12 h-12"> {/* Added relative position */}
                     <Image src={review.user_image} alt={review.user_name} fill className="rounded-full object-cover" />
                   </div>
                   {/* Display user name */}
                   <div className="ml-3">
                     <h4 className="font-medium">{review.user_name}</h4>
                   </div>
                 </div>
               </div>
             ))
          ) : (
            // Case > 1 reviews: Use Carousel
            <Carousel>
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm"> {/* Testimonial card container */}
                  <div className="flex mb-4">
                    {/* Display rating stars */}
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  {/* Display review content */}
                  <p className="text-gray-600 mb-4">
                    {review.content}
                  </p>
                  <div className="flex items-center">
                    {/* Display user image - parent needs relative position */}
                    <div className="relative w-12 h-12"> {/* Added relative position */}
                      <Image src={review.user_image} alt={review.user_name} fill className="rounded-full object-cover" />
                    </div>
                    {/* Display user name */}
                    <div className="ml-3">
                      <h4 className="font-medium">{review.user_name}</h4>
                    </div>
                  </div>
                </div>
              ))
            }
            </Carousel>
          )}

        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">{/* Container for Feature item */}
              <div className="w-16 h-16 bg-[#bdd5fc] rounded-full flex items-center justify-center mb-4 relative"> {/* Added relative position */}
                <Truck className="h-8 w-8 text-[#0084cc]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Envío Gratis</h3>
              <p className="text-gray-600">En todos los pedidos superiores a €30. Entrega rápida y segura.</p>
            </div>

            <div className="flex flex-col items-center text-center">{/* Container for Feature item */}
              <div className="w-16 h-16 bg-[#bdd5fc] rounded-full flex items-center justify-center mb-4 relative"> {/* Added relative position */}
                <TrendingUp className="h-8 w-8 text-[#0084cc]" />
              </div>              <h3 className="text-xl font-semibold mb-2">Calidad Garantizada</h3>
              <p className="text-gray-600">
                Todos nuestros productos son seleccionados cuidadosamente para asegurar la mejor calidad.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">{/* Container for Feature item */}
              <div className="w-16 h-16 bg-[#bdd5fc] rounded-full flex items-center justify-center mb-4 relative"> {/* Added relative position */}
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
  );
}
