import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CategoryCard } from "@/components/category-card"
import { Carousel } from "@/components/carousel"
import { ChevronRight, Star, TrendingUp, Gift, Truck } from "lucide-react"
import { supabase } from "@/lib/supabase"
import HomePageClient from "@/components/HomePageClient"

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
    <HomePageClient
      categories={categories}
      featuredProducts={featuredProducts}
      newArrivals={newArrivals}
      reviews={reviews}
      bannerImages={bannerImages}
    />
  );
}
