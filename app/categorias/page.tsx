'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Breadcrumb } from '@/components/breadcrumb';
import Link from 'next/link';

// Assuming you have a type for Category
interface Category {
    id: string;
    nombre: string; // Assuming categories have a name
    slug: string; // Assuming categories have a slug for URL filtering
    // Add other category fields if necessary
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch categories from your database table
        // Replace 'categorias' with your actual categories table name if different
        const { data, error } = await supabase
          .from('categorias')
          .select('id, nombre, slug'); // Select relevant category fields

        if (error) {
          console.error('Error fetching categories:', error);
          setError(error.message);
          setCategories([]);
        } else {
          setCategories(data as Category[]);
        }
      } catch (err: any) {
        console.error('Caught exception fetching categories:', err);
        setError('An unexpected error occurred.');
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen bg-[#f5f8ff]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Categorías', href: '/categorias', active: true },
          ]}
        />

        <h1 className="text-3xl font-bold mb-8">Explorar Categorías</h1>

        {isLoading && <p className="text-center">Cargando categorías...</p>}
        {error && <p className="text-center text-red-500">Error al cargar categorías: {error}</p>}
        {!isLoading && !error && categories.length === 0 && (
          <p className="text-center">No hay categorías disponibles en este momento.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!isLoading &&
            !error &&
            categories.map((category) => (
              // Link to the products page, filtering by the category slug
              <Link key={category.id} href={`/productos?categoria=${category.slug}`} passHref>
                {/* This is a basic example, you might want a more complex CategoryCard component */}
                <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <h2 className="text-xl font-semibold text-gray-800">{category.nombre}</h2>
                  {/* Add category image or icon here if available */}
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
