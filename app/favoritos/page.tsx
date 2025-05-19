"use client";

import { useEffect, useState, useCallback } from "react";
import { useFavoritos } from "@/contexts/FavoritosContext";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function FavoritosPage() {
  const { user, isLoading } = useAuth();
  const { favoriteIds, loading: loadingFavoritos, toggleFavorite, isFavorited, reloadFavorites } = useFavoritos();
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // --- DEBUG avanzado ---
  // --- END DEBUG ---

  // Función para cargar productos favoritos
  const fetchProductosFavoritos = useCallback(async () => {
    if (!user || favoriteIds.length === 0) {
      setProductos([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    let data = [];
    if (favoriteIds.length === 1) {
      // Solo uno, usa .eq
      const res = await supabase
        .from("productos")
        .select("id, nombre, precio, precio_descuento, porcentaje_descuento, stock, imagenes_producto(url)")
        .eq("id", favoriteIds[0]);
      data = res.data || [];
    } else {
      // Varios, usa .or
      const orFilter = favoriteIds.map(id => `id.eq.${id}`).join(',');
      const res = await supabase
        .from("productos")
        .select("id, nombre, precio, precio_descuento, porcentaje_descuento, stock, imagenes_producto(url)")
        .or(orFilter);
      data = res.data || [];
    }
    setProductos(data);
    setLoading(false);
  }, [user, favoriteIds]);

  // Recargar productos favoritos cada vez que cambian los IDs
  useEffect(() => {
    fetchProductosFavoritos();
  }, [fetchProductosFavoritos]);

  // Forzar recarga de favoritos tras cada toggle
  const handleToggleFavorite = async (productId: string) => {
    await toggleFavorite(productId);
    await reloadFavorites(); // Forzar recarga de IDs y productos
    fetchProductosFavoritos();
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto py-12 text-center">Cargando...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Favoritos</h2>
        <p className="mb-6">Debes iniciar sesión para ver tus productos favoritos.</p>
        <Link href="/login">
          <Button>Iniciar Sesión</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">Mis Favoritos</h2>
      {/* DEBUG: Mostrar IDs de favoritos y productos encontrados */}
      
      {loadingFavoritos || loading ? (
        <div className="text-center">Cargando...</div>
      ) : favoriteIds.length === 0 ? (
        <div className="text-center text-gray-500">No tienes productos favoritos aún.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductCard
              key={producto.id}
              id={producto.id}
              name={producto.nombre}
              price={producto.precio}
              image={producto.imagenes_producto?.[0]?.url || "/placeholder.svg"}
              rating={producto.valoracion_promedio || 0}
              precio_descuento={producto.precio_descuento}
              porcentaje_descuento={producto.porcentaje_descuento}
              stock={producto.stock}
              isFavorited={isFavorited(producto.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
} 