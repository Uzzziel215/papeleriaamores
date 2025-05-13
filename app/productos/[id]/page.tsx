import { notFound } from 'next/navigation';
import { Breadcrumb } from "@/components/breadcrumb";
// Importar el componente Client que creamos
import { ProductDetailsClient } from "@/components/product-details-client";
// Importar la instancia de Supabase directamente
import { supabase } from "@/lib/supabase";

// Definir interfaces para la estructura de datos que esperamos de la base de datos en el Server Component
interface ProductImage {
  id: string;
  url: string;
  alt_text?: string | null;
  es_principal: boolean;
}

interface ProductVariant {
  id: string;
  nombre: string;
  tipo: string;
  valor: string;
  codigo_sku?: string | null;
  precio_adicional?: number | null;
  stock: number;
  activo: boolean;
}

// Interface para la vista de valoración promedio
interface ProductAverageRatingView {
    producto_id: string;
    total_resenas: number;
    valoracion_promedio: number;
}

// Interface para reseñas individuales
interface ProductReview {
    id: string;
    producto_id: string;
    usuario_id: string;
    titulo: string;
    contenido: string;
    valoracion: number;
    aprobado: boolean;
    created_at: string;
    updated_at: string;
    // Si unes con perfiles de usuario, añade la interfaz aquí:
    // perfiles_usuario?: { nombre: string | null; apellidos?: string | null; };
}

// Interfaz del producto principal
interface ProductMainInfo {
  id: string;
  nombre: string;
  descripcion?: string | null;
  descripcion_larga?: string | null;
  precio: number;
  precio_descuento?: number | null;
  porcentaje_descuento?: number | null;
  sku?: string | null;
  stock: integer;
  marca?: string | null;
  destacado: boolean;
  nuevo: boolean;
  activo: boolean;
  created_at: string;
  updated_at: string;
  metadata?: any | null;
  categoria_id?: string | null;
}

// Props for the product details page (gets product ID from URL parameters)
export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  // ### MODIFICATION START ###
  // Await params before accessing its properties
  const productId = await params.id;
  // ### MODIFICATION END ###

  console.log("Attempting to fetch product details for ID (separate queries - final attempt):", productId);

  try {
    // --- Consulta 1: Obtener datos principales del producto ---
    const { data: productData, error: productError } = await supabase
      .from('productos')
      .select('*') // Seleccionar solo las columnas de productos
      .eq('id', productId)
      .single();

    if (productError) {
      // ### START ADDED LOGGING ###
      console.error("Detailed error loading main product details for ID:", productId);
      console.error("Error object:", productError); // Log the full error object
      console.error("Error name:", productError.name);
      console.error("Error message:", productError.message);
      console.error("Error code:", productError.code);
      if (productError.details) console.error("Error details:", productError.details);
      if (productError.hint) console.error("Error hint:", productError.hint);
      if (productError.stack) console.error("Error stack:", productError.stack);
      // ### END ADDED LOGGING ###

      // PGRST116 indica "No rows found". En ese caso, mostrar 404.
      if (productError.code === 'PGRST116') {
        notFound();
      }
      // Para otros errores, relanzar el error para que Next.js lo maneje (por ejemplo, mostrar una página de error 500)
      throw productError;
    }

    if (!productData) {
      // Aunque el error PGRST116 ya maneja esto, una verificación explícita no hace daño.
      notFound();
    }

    // --- Consulta 2: Obtener imágenes del producto ---
    const { data: imagesData, error: imagesError } = await supabase
      .from('imagenes_producto')
      .select('*')
      .eq('producto_id', productId)
      .order('orden', { ascending: true }); // O por 'es_principal' primero, luego 'orden'

    if (imagesError) {
      // ### START ADDED LOGGING (Images) ###
      console.error("Detailed error loading product images for ID:", productId);
      console.error("Error object:", imagesError); // Log the full error object
      console.error("Error name:", imagesError.name);
      console.error("Error message:", imagesError.message);
      console.error("Error code:", imagesError.code);
      if (imagesError.details) console.error("Error details:", imagesError.details);
      if (imagesError.hint) console.error("Error hint:", imagesError.hint);
      if (imagesError.stack) console.error("Error stack:", imagesError.stack);
      // ### END ADDED LOGGING (Images) ###
    }
    const productImages = imagesData || [];

    // --- Consulta 3: Obtener variantes del producto ---
    const { data: variantsData, error: variantsError } = await supabase
      .from('variantes_producto')
      .select('*')
      .eq('producto_id', productId)
      .order('tipo', { ascending: true }).order('valor', { ascending: true }); // Ordenar por tipo y valor

    if (variantsError) {
      // ### START ADDED LOGGING (Variants) ###
      console.error("Detailed error loading product variants for ID:", productId);
      console.error("Error object:", variantsError); // Log the full error object
      console.error("Error name:", variantsError.name);
      console.error("Error message:", variantsError.message);
      console.error("Error code:", variantsError.code);
      if (variantsError.details) console.error("Error details:", variantsError.details);
      if (variantsError.hint) console.error("Error hint:", variantsError.hint);
      if (variantsError.stack) console.error("Error stack:", variantsError.stack);
      // ### END ADDED LOGGING (Variants) ###
    }
    const productVariants = variantsData || [];

    // --- Consulta 4: Obtener la valoración promedio desde la vista ---
    const { data: ratingData, error: ratingError } = await supabase
      .from('valoraciones_producto')
      .select('valoracion_promedio')
      .eq('producto_id', productId)
      .single();

    // No lanzamos error si la valoración no se encuentra (PGRST116) o hay otro error leve
    if (ratingError && ratingError.code !== 'PGRST116') {
      console.error("Error loading product rating for ID:", productId, ratingError);
    }
    const averageRating = ratingData?.valoracion_promedio ?? 0; // Usar 0 si no hay valoración o hubo error PGRST116

    // --- Consulta 5: Obtener las reseñas individuales ---
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('resenas')
      .select('*')
      .eq('producto_id', productId)
      .order('created_at', { ascending: false });

    if (reviewsError) { // No lanzamos error si no hay reseñas
      console.error("Error loading product reviews for ID:", productId, reviewsError);
    }
    const individualReviews = reviewsData || [];

    // Preparar los datos que se pasarán al Client Component
    const productForClient = {
      ...productData,
      imagenes_producto: productImages, // Pasar las imágenes obtenidas por separado
      variantes_producto: productVariants, // Pasar las variantes obtenidas por separado
      rating: averageRating, // Pasar la valoración promedio
      // Las reseñas individuales se pasan por separado en las props del Client Component
    };

    // ### START ADDED LOGGING BEFORE RETURN ###
    console.log("Prepared data for client component:", productForClient);
    // ### END ADDED LOGGING BEFORE RETURN ###

    return (
      <div className="min-h-screen bg-[#f5f8ff]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Breadcrumb
            items={[
              { label: "Inicio", href: "/" },
              { label: "Productos", href: "/productos" },
              { label: productData.nombre, href: `/productos/${productData.id}`, active: true },
            ]}
          />
          {/* Renderizar el Client Component y pasar todos los datos */}
          <ProductDetailsClient product={productForClient} reviews={individualReviews} />
        </div>
      </div>
    );

  } catch (error) {
    // ### START CATCH-ALL SIMPLIFIED LOGGING ###
    console.error("Caught UNEXPECTED error fetching product details for ID:", productId);
    console.error("Error object caught:", error); 
    // Re-throw the error to ensure Next.js still shows an error state
    throw error;
    // ### END CATCH-ALL SIMPLIFIED LOGGING ###
  }
}

// Restore interfaces here, adjust types based on schema if necessary
interface ProductImage {
  id: string;
  url: string;
  alt_text?: string | null;
  es_principal: boolean;
}

interface ProductVariant {
  id: string;
  nombre: string;
  tipo: string;
  valor: string;
  codigo_sku?: string | null;
  precio_adicional?: number | null;
  stock: number;
  activo: boolean;
}

interface ProductAverageRatingView {
    producto_id: string;
    total_resenas: number;
    valoracion_promedio: number;
}

interface ProductReview {
    id: string;
    producto_id: string;
    usuario_id: string;
    titulo: string;
    contenido: string;
    valoracion: number;
    aprobado: boolean;
    created_at: string;
    updated_at: string;
    // perfiles_usuario?: { nombre: string | null; apellidos?: string | null; };
}
