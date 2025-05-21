'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Star, TrendingUp, Gift, Truck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/category-card";
import { Carousel } from "@/components/carousel";
import { ProductGrid } from "@/components/product-grid";
import { FavoritosProvider, useFavoritos } from "@/contexts/FavoritosContext";
import type { Producto } from "@/types/database.types";

// Define types for the data received from the server component (app/page.tsx)
interface ProductForHomePage extends Producto {
  imagenes_producto: { url: string, es_principal: boolean }[] | never[];
  precio_descuento: number | null;
  porcentaje_descuento: number | null;
  stock: number;
  valoracion_promedio?: number | null;
}

interface HomePageClientProps {
  categories: any[]; // Replace 'any' with a more specific type if available
  featuredProducts: ProductForHomePage[];
  newArrivals: ProductForHomePage[];
  reviews: any[]; // Replace 'any' with a more specific type if available
  bannerImages: string[];
}

function HomePageContent({ categories, featuredProducts, newArrivals, reviews, bannerImages }: HomePageClientProps) {
  const { favoriteIds, toggleFavorite, isFavorited } = useFavoritos();

  // Pass favoriteIds and onToggleFavorite to ProductGrid
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#bdd5fc] py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Descubre Nuestra Colección de Papelería</h1>
            <p className="text-lg mb-6">
              Encuentra todo lo que necesitas para la escuela, oficina o tus proyectos creativos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/productos?filter=featured" passHref>
                <Button className="bg-[#0084cc] hover:bg-[#006ba7] text-white px-8 py-6 rounded-full text-lg">
                  Comprar Ahora
                </Button>
              </Link>
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
          <div className="md:w-1/2 relative">
            <Image src="/neo-sakura-online-shopping.gif" alt="Oferta Especial" width={600} height={500} className="object-contain" unoptimized />
          </div>
        </div>
      </section>

      {/* Banner/Ofertas Especiales Section */}
      <section className="py-16 bg-[#0084cc] text-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ofertas Especiales</h2>
            <p className="text-lg mb-6">Aprovecha nuestros descuentos de hasta el 30% en productos seleccionados.</p>
            <Link href="/productos?availability=on-offer" passHref>
              <Button className="bg-white text-[#0084cc] hover:bg-gray-100 px-8 py-6 rounded-full text-lg">
                Ver Ofertas
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2 relative">
            <Carousel>
              {bannerImages.map((src, index) => (
                <div key={index} className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
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
            <Link href="/productos?filter=featured" className="text-[#0084cc] hover:underline flex items-center">
              Ver Todos
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {/* Pass favorite data to ProductGrid */}
          <ProductGrid products={featuredProducts} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />
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

          {/* Pass favorite data to ProductGrid */}
          <ProductGrid products={newArrivals} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-[#f5f8ff]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Lo Que Dicen Nuestros Clientes</h2>

          {reviews.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center flex justify-center items-center h-full">
               <p className="text-gray-600">No hay reseñas disponibles en este momento.</p>
            </div>
          ) : (
            <Carousel>
               {reviews.map(review => (
                  <div key={review.id} className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-sm min-h-[150px] justify-center">
                     <div className="flex items-center mb-4">
                        {/* Assuming you have a way to display user images/initials */}
                        {/* <Image src={review.user_image} alt={review.user_name} width={40} height={40} className="rounded-full mr-3" /> */}
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">{review.user_name.charAt(0)}</div>
                        <span className="font-semibold">{review.user_name}</span>
                     </div>
                     <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`} />
                        ))}
                     </div>
                     <p className="text-gray-700 mb-4 flex-1 flex items-center">"{review.content}"</p>
                  </div>
               ))}
            </Carousel>
          )}
        </div>
      </section>

      {/* Trust Badges/Features */}
      <section className="py-16 bg-white">
         <div className="max-w-6xl mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
             <div className="flex flex-col items-center">
               <Truck className="h-12 w-12 text-[#0084cc] mb-4" />
               <h3 className="text-xl font-semibold mb-2">Envío Rápido</h3>
               <p className="text-gray-600">Entregamos tus pedidos en 24-48 horas laborables.</p>
             </div>
             <div className="flex flex-col items-center">
               <Gift className="h-12 w-12 text-[#0084cc] mb-4" />
               <h3 className="text-xl font-semibold mb-2">Grandes Ofertas</h3>
               <p className="text-gray-600">Encuentra descuentos increíbles en una amplia selección de productos.</p>
             </div>
             <div className="flex flex-col items-center">
               <Star className="h-12 w-12 text-[#0084cc] mb-4 fill-current" />
               <h3 className="text-xl font-semibold mb-2">Productos de Calidad</h3>
               <p className="text-gray-600">Seleccionamos cuidadosamente cada artículo para garantizar la mejor calidad.</p>
             </div>
           </div>
         </div>
      </section>

    </>
  );
}

export default function HomePageClient(props: HomePageClientProps) {
  return (
    <FavoritosProvider>
      <HomePageContent {...props} />
    </FavoritosProvider>
  );
}
 