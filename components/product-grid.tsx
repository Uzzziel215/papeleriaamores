"use client"

import React from 'react';
import { ProductCard } from "@/components/product-card";
import type { Producto, ImagenesProducto } from "@/types/database.types";

interface ProductGridProps {
  products: Array<Producto & { imagenes_producto: ImagenesProducto[] } | Producto & { imagenes_producto: never[] }>;
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.nombre}
          price={product.precio}
          image={product.imagenes_producto?.[0]?.url || "/placeholder.svg"}
          rating={0} // Assuming rating is not available or 0 for now
          discount={product.porcentaje_descuento || undefined}
        />
      ))}
    </div>
  );
}
