'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Breadcrumb } from '@/components/breadcrumb';
import { ProductCard } from '@/components/product-card'; // Assuming you have a ProductCard component
import type { Product } from '@/types/database.types'; // Assuming Product type is defined here or globally

// Define a type for products with potential discount fields
interface DiscountedProduct extends Product {
    precio_descuento: number | null; // Assuming discount price is stored here
    porcentaje_descuento: number | null; // Assuming discount percentage is stored here
}

export default function OffersPage() {
  const [products, setProducts] = useState<DiscountedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOffers() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch products where precio_descuento is not null OR porcentaje_descuento is greater than 0
        const { data, error } = await supabase
          .from('productos')
          .select('*') // Select all columns, including potential discount fields
          .or('precio_descuento.not.is.null,porcentaje_descuento.gt.0');
          // Add .eq('activo', true) if you only want active products

        if (error) {
          console.error('Error fetching offers:', error);
          setError(error.message);
          setProducts([]);
        } else {
          // Filter out products where discount fields might be null or invalid if necessary
          const discountedProducts = data.filter(product => product.precio_descuento !== null || (product.porcentaje_descuento !== null && product.porcentaje_descuento > 0));
          setProducts(discountedProducts as DiscountedProduct[]);
        }
      } catch (err: any) {
        console.error('Caught exception fetching offers:', err);
        setError('An unexpected error occurred.');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOffers();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen bg-[#f5f8ff]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Ofertas', href: '/ofertas', active: true },
          ]}
        />

        <h1 className="text-3xl font-bold mb-8">Ofertas Especiales</h1>

        {isLoading && <p className="text-center">Cargando ofertas...</p>}
        {error && <p className="text-center text-red-500">Error al cargar ofertas: {error}</p>}
        {!isLoading && !error && products.length === 0 && (
          <p className="text-center">No hay ofertas disponibles en este momento.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!isLoading &&
            !error &&
            products.map((product) => (
              // Assuming your ProductCard component can handle the product data structure
              // You might need to pass discount information explicitly if ProductCard needs it
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </div>
  );
}
