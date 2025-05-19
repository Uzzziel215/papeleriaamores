"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { useCart } from '@/contexts/CartContext';
import { useFavoritos } from "@/contexts/FavoritosContext";

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
}

interface ProductDetailProps {
  product: {
    id: string;
    nombre: string;
    descripcion?: string | null;
    descripcion_larga?: string | null;
    precio: number;
    precio_descuento?: number | null;
    porcentaje_descuento?: number | null;
    sku?: string | null;
    stock: number;
    marca?: string | null;
    destacado: boolean;
    nuevo: boolean;
    activo: boolean;
    created_at: string;
    updated_at: string;
    metadata?: any | null;
    categoria_id?: string | null;
    imagenes_producto: ProductImage[];
    variantes_producto: ProductVariant[];
    rating: number;
    is_favorited_by_user?: boolean;
  };
  reviews: ProductReview[];
}

export function ProductDetailsClient({ product, reviews }: ProductDetailProps) {
   const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
   const [quantity, setQuantity] = useState<number>(1);
   const [mainImageUrl, setMainImageUrl] = useState<string>(product.imagenes_producto.find(img => img.es_principal)?.url || product.imagenes_producto[0]?.url || '/placeholder.jpg');
   const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

   const router = useRouter();
   const { toast } = useToast();

   const [user, setUser] = useState<any | null>(null);
   const [isLoadingAuth, setIsLoadingAuth] = useState(true);

   const { addItem } = useCart();
   const { isFavorited: globalIsFavorited, toggleFavorite } = useFavoritos();

   useEffect(() => {
       const getUser = async () => {
           setIsLoadingAuth(true);
           const { data: { user } } = await supabase.auth.getUser();
           setUser(user);
           setIsLoadingAuth(false);
       };
       getUser();
   }, []);

   const variantsByType = product.variantes_producto.reduce((acc, variant) => {
     if (!acc[variant.tipo]) {
       acc[variant.tipo] = [];
     }
     acc[variant.tipo].push(variant);
     return acc;
   }, {} as Record<string, ProductVariant[]>);

   const handleVariantSelect = (type: string, variantId: string) => {
      setSelectedVariants(prev => ({ ...prev, [type]: variantId }));
   };

    const handleQuantityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setQuantity(parseInt(event.target.value, 10));
    };

   const handleAddToCart = async () => {
       console.log('Add to cart clicked!', { product: product.id, variants: selectedVariants, quantity });

       const selectedVariantId = Object.values(selectedVariants)[0] || null;

       await addItem(product.id, selectedVariantId, quantity);

        toast({
          title: "Producto Añadido",
          description: `${quantity} x ${product.nombre} ha(n) sido añadido(s) al carrito.`, 
          variant: "default",
        });
   };

   const selectedVariant = product.variantes_producto.find(v => v.id === Object.values(selectedVariants)[0]);
   const basePrice = product.precio_descuento ?? product.precio;
   const priceWithVariant = basePrice + (selectedVariant?.precio_adicional ?? 0);

   const discountPercentage = product.precio_descuento != null && product.precio != null && product.precio > 0
     ? Math.round(((product.precio - product.precio_descuento) / product.precio) * 100)
     : undefined;

    const renderStars = (rating: number) => {
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 !== 0;
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

      const stars = [];
      for (let i = 0; i < fullStars; i++) {
          stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-current text-yellow-400" />);
      }
      // Simplified half-star logic by rounding
      const roundedRating = Math.round(rating);
      stars.length = 0; // Clear previous stars
      for (let i = 0; i < roundedRating; i++) {
          stars.push(<Star key={`rounded-full-${i}`} className="h-4 w-4 fill-current text-yellow-400" />);
      }
      for (let i = 0; i < (5 - roundedRating); i++) {
          stars.push(<Star key={`rounded-empty-${i}`} className="h-4 w-4 text-gray-300" />);
      }

      return (
        <div className="flex">
          {stars}
        </div>
      );
    };


  return (

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Images */}
      {product.imagenes_producto && product.imagenes_producto.length > 0 && (
         <div className="relative aspect-square rounded-lg overflow-hidden shadow-sm bg-white p-4">
          <Image
            src={mainImageUrl}
            alt={product.nombre}
            fill
            className="object-contain"
          />
        </div>
      )}

      {/* Product Info */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.nombre}</h1>

        {/* Rating Promedio */}
        <div className="flex items-center mb-4">
          {renderStars(product.rating)}
          <span className="ml-2 text-gray-600">{product.rating.toFixed(1)}</span>
          {reviews && reviews.length > 0 && <span className="ml-2 text-sm text-gray-500">({reviews.length} reseñas)</span>}
        </div>

        {/* Price */}
        <div className="mb-4">
          {product.precio_descuento != null ? (
            <div className="flex items-center">
              <span className="text-2xl font-semibold text-[#0084cc]">€{priceWithVariant.toFixed(2)}</span>
              <span className="ml-2 text-base text-gray-500 line-through">€{product.precio.toFixed(2)}</span>
              {discountPercentage != null && (
                <span className="ml-2 bg-[#ff6b6b] text-white text-sm font-medium px-2 py-0.5 rounded">-{discountPercentage}%</span>
              )}
            </div>
          ) : (
            <span className="text-2xl font-semibold text-[#0084cc]">€{priceWithVariant.toFixed(2)}</span>
          )}
        </div>

        {/* Description */}
        <div className="mb-6 text-gray-700">
          <p>{product.descripcion_larga || product.descripcion}</p>
        </div>

        {/* Variants (Interactive) */}
        {product.variantes_producto && product.variantes_producto.length > 0 && (
           <div className="mb-6">
              {Object.entries(variantsByType).map(([type, variants]) => (
                 <div key={type} className="mb-4">
                    <h4 className="font-medium mb-2 capitalize">{type}:</h4>
                    <div className="flex flex-wrap gap-2">
                       {variants.map(variant => (
                          <Button
                             key={variant.id}
                             variant={selectedVariants[type] === variant.id ? 'default' : 'outline'}
                             size="sm"
                             onClick={() => handleVariantSelect(type, variant.id)}
                             className={selectedVariants[type] === variant.id ? 'bg-[#0084cc] hover:bg-[#007acc] text-white' : ''}
                             disabled={!variant.activo || variant.stock === 0}
                          >
                             {variant.valor} {(!variant.activo || variant.stock === 0) && '(Agotado)'}
                          </Button>
                       ))}
                    </div>
                 </div>
              ))}
           </div>
        )}

        {/* Quantity Selector and Add to Cart (Interactive) */}
        {product.stock > 0 ? (
           <div className="flex items-center space-x-4 mb-6">
             <div className="flex items-center border border-gray-300 rounded-md">
                <select value={quantity} onChange={handleQuantityChange} className="appearance-none bg-white py-2 px-3 text-sm focus:outline-none">
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                     <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
             </div>
             <Button size="lg" className="bg-[#0084cc] hover:bg-[#007acc]" onClick={handleAddToCart} disabled={product.stock === 0}>
               <ShoppingCart className="h-5 w-5 mr-2" />
               Añadir al Carrito
             </Button>
           </div>
        ) : (
            <div className="text-red-600 font-semibold mb-6">Sin stock</div>
        )}

        {/* Add to Favorites (Interactive with auth check) */}
        <div className="mb-6">
          <Button
             variant="outline"
             className={
                globalIsFavorited(product.id)
                   ? "w-full border-[#ff6b6b] bg-[#ff6b6b] text-white hover:bg-[#e05a5a] hover:border-[#e05a6a]"
                   : "w-full border-[#ff6b6b] text-[#ff6b6b] hover:bg-[#ff6b6b] hover:text-white"
             }
             onClick={() => toggleFavorite(product.id)}
             disabled={isLoadingAuth || isTogglingFavorite}
          >
            <Heart className={`h-5 w-5 mr-2 ${globalIsFavorited(product.id) ? 'fill-current' : ''}`} />
            {globalIsFavorited(product.id) ? 'En Favoritos' : 'Añadir a Favoritos'}
          </Button>
        </div>

        {/* Tabs for Details, Reviews, etc. */}
         <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
               <TabsTrigger value="description">Detalles</TabsTrigger>
               <TabsTrigger value="reviews">Reseñas</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4 text-gray-700">
               <h3 className="font-semibold mb-2">Descripción Larga</h3>
               <p>{product.descripcion_larga || product.descripcion}</p>
            </TabsContent>
            <TabsContent value="reviews" className="pt-4">
               <h3 className="font-semibold mb-4">Reseñas de Clientes</h3>
                 {reviews && reviews.length > 0 ? (
                    <div className="space-y-4">
                       {reviews.map(review => (
                          <div key={review.id} className="border-b pb-4 last:border-b-0">
                             <div className="flex items-center mb-1">
                                <span className="font-semibold mr-2">Usuario</span> 
                                 {renderStars(review.valoracion)}
                             </div>
                             <h4 className="font-medium mb-1">{review.titulo}</h4>
                             <p className="text-sm text-gray-700">{review.contenido}</p>
                             <div className="text-xs text-gray-500 mt-2">{new Date(review.created_at).toLocaleDateString()}</div>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <p>No hay reseñas todavía.</p>
                 )}
            </TabsContent>
         </Tabs>
      </div>
    </div>
  );
}
