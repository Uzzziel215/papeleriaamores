'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Breadcrumb } from '@/components/breadcrumb';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
    id: string;
    nombre: string;
    slug: string;
    imagen_url: string | null;
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
        const { data, error } = await supabase
          .from('categorias')
          .select('id, nombre, slug, imagen_url');

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
  }, []);

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
          {!isLoading && !error && categories.map((category) => (
            <Link key={category.id} href={`/productos?categoria=${category.slug}`} passHref>
              <div className="bg-white rounded-lg shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                {category.imagen_url && (
                  <div className="relative aspect-square">
                    <Image
                      src={category.imagen_url}
                      alt={category.nombre}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{category.nombre}</h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
