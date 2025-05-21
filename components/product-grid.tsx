"use client"

import React from 'react';
import { ProductCard } from "@/components/product-card";
import type { Producto } from "@/types/database.types";

// Define a more specific type for products received by ProductGrid from app/page.tsx
interface ProductForGrid extends Producto {
  imagenes_producto: { url: string, es_principal: boolean }[];
  // Explicitly add fields used by ProductCard that might not be strictly in Producto type or are optional
  precio_descuento: number | null;
  porcentaje_descuento: number | null;
  stock: number; // Stock is in Producto
  valoracion_promedio?: number | null; // Keep as optional, can be null
}

interface ProductGridProps {
  products: ProductForGrid[];
  // Add props for favorites functionality
  favoriteIds: string[];
  onToggleFavorite: (productId: string) => void; // Function to toggle favorite status
}

export function ProductGrid({ products, favoriteIds, onToggleFavorite }: ProductGridProps) {
  // Helper function to check if a product is favorited
  const isFavorited = (productId: string) => favoriteIds.includes(productId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.nombre}
          price={product.precio}
          image={product.imagenes_producto?.[0]?.url || "/placeholder.svg"}
          rating={product.valoracion_promedio || 0} // Use valoracion_promedio if available, otherwise 0
          precio_descuento={product.precio_descuento}
          porcentaje_descuento={product.porcentaje_descuento}
          stock={product.stock}
          isFavorited={isFavorited(product.id)} // Pass isFavorited status
          onToggleFavorite={onToggleFavorite} // Pass the toggle function
        />
      ))}
    </div>
  );
}
