'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Breadcrumb } from '@/components/breadcrumb';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/types/database.types'; // Assuming Product type is here
import { useParams } from 'next/navigation';

// Assuming a Category type exists
interface Category {
    id: string;
    nombre: string;
    slug: string;
    // Add other category fields like description or image if they exist
}

// Reuse or adapt the Product type from app/productos/page.tsx snippets
interface ProductWithDetails extends Product {
    valoracion_promedio?: number; // Optional: if your products table includes this
    imagenes_producto?: { url: string }[]; // Assuming images are linked like this
    variantes_producto?: { id: string; tipo: string; valor: string; precio_adicional: number }[]; // Assuming variants are linked
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string; // Get the slug from the URL

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      if (!slug) {
        setError('Category slug is missing.');
        setIsLoading(false);
        return;
      }

      try {
        // 1. Fetch category details using the slug
        const { data: categoryData, error: categoryError } = await supabase
          .from('categorias') // Assuming your categories table is named 'categorias'
          .select('id, nombre, slug')
          .eq('slug', slug)
          .maybeSingle();

        if (categoryError) {
          console.error('Error fetching category:', categoryError);
          setError(categoryError.message);
          setIsLoading(false);
          return;
        }

        if (!categoryData) {
          setError(\`Category with slug "\${slug}" not found.\`);
          setIsLoading(false);
          return;
        }

        setCategory(categoryData as Category);

        // 2. Fetch products belonging to this category using the category ID
        const { data: productsData, error: productsError } = await supabase
          .from('productos') // Assuming your products table is named 'productos'
           .select(\`
              *,
              imagenes_producto(url),
              variantes_producto(id, tipo, valor, precio_adicional)
           \`) // Fetch product details and related images/variants
          .eq('categoria_id', categoryData.id) // Filter by the fetched category ID
          .eq('activo', true); // Assuming you only want active products

        if (productsError) {
          console.error('Error fetching products for category:', productsError);
          setError(productsError.message);
          setProducts([]);
        } else {
          setProducts(productsData as ProductWithDetails[]);
        }

      } catch (err: any) {
        console.error('Caught exception fetching category data:', err);
        setError('An unexpected error occurred.');
        setCategory(null);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [slug]); // Rerun effect if slug changes

  // Determine breadcrumb label - use category name if loaded, otherwise slug or generic
   const breadcrumbLabel = category ? category.nombre : slug ? slug.replace(/-/g, ' ').replace(/\w/g, l => l.toUpperCase()) : 'Categoría';

  return (
    <div className="min-h-screen bg-[#f5f8ff]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Categorías', href: '/categorias' }, // Link back to a potential category index page
            { label: breadcrumbLabel, href: `/categorias/\${slug}`, active: true },
          ]}
        />

        <h1 className="text-3xl font-bold mb-8">{category ? category.nombre : 'Cargando Categoría...'}</h1>

        {isLoading && <p className="text-center">Cargando productos...</p>}
        {error && <p className="text-center text-red-500">Error al cargar productos: {error}</p>}
        {!isLoading && !error && products.length === 0 && (
          <p className="text-center">No hay productos en esta categoría en este momento.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!isLoading &&
            !error &&
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </div>
  );
}
