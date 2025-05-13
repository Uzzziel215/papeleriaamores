"use client"

import { Grid, List, ArrowUpDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Breadcrumb } from "@/components/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
// Importar la instancia de Supabase ya creada
import { supabase } from "@/lib/supabase";

import { useState, useEffect, useCallback } from "react";
import Image from 'next/image';

// Definir interfaces para los datos devueltos por la RPC
// Ahora las columnas no tienen el prefijo 'r_'. Coinciden con la tabla productos + valoracion_promedio.
interface ProductRpc {
  id: string;
  nombre: string;
  descripcion: string | null; // Añadir descripcion
  precio: number;
  precio_descuento: number | null; // Puede ser null
  porcentaje_descuento: number | null; // Puede ser null
  sku: string | null; // Puede ser null
  stock: number;
  marca: string | null; // Puede ser null
  destacado: boolean;
  nuevo: boolean;
  activo: boolean;
  created_at: string; // O Date si prefieres parsear
  updated_at: string; // O Date
  metadata: any | null; // Ajusta el tipo si conoces la estructura del JSONB
  categoria_id: string | null; // Puede ser null si ON DELETE SET NULL
  valoracion_promedio: number; // Valoración promedio directamente
}

// Interfaz para los productos como se usarán en el frontend (incluyendo imágenes)
interface ProductForFrontend {
  id: string;
  nombre: string;
  precio: number;
  imagenes_producto: { id: string; url: string; alt_text?: string; es_principal: boolean }[]; // Ajustar para incluir id de imagen
  precio_descuento?: number | null;
  marca?: string | null;
  stock: number;
  destacado: boolean;
  nuevo: boolean;
  rating: number; // Valoración promedio para el ProductCard
}

export default function ProductosPage() {
  const [products, setProducts] = useState<ProductForFrontend[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para filtros y ordenamiento
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]); // Rango de precio inicial (ajustar max si es necesario)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0); // Estado para valoración mínima seleccionada
  const [availabilityFilters, setAvailabilityFilters] = useState<string[]>([]); // 'in-stock', 'on-offer'
  const [sortOrder, setSortOrder] = useState<string>('relevance');

  // Función para cargar categorías
  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase.from("categorias").select("id, nombre, slug").order('orden', { ascending: true });
    if (error) console.error("Error loading categories:", error); else setCategories(data || []);
  }, []);

  // Función para cargar marcas disponibles (únicas)
  const fetchBrands = useCallback(async () => {
    const { data, error } = await supabase.from("productos").select("marca", { distinct: true }).not('marca', 'is', null);
    if (error) {
      console.error("Error loading brands:", error);
    } else {
      setBrands(data?.map(item => item.marca!) || []);
    }
  }, []);

  // Función para cargar productos usando la RPC
  const fetchProducts = useCallback(async () => {
    setLoading(true);

    // Preparar parámetros para la RPC. Pasar null para arrays vacíos según la definición de la RPC.
    const rpcParams = {
      category_slugs: selectedCategories.length > 0 ? selectedCategories : null,
      price_min: priceRange[0],
      price_max: priceRange[1],
      brands: selectedBrands.length > 0 ? selectedBrands : null,
      min_rating: minRating,
      is_in_stock: availabilityFilters.includes('in-stock'),
      is_on_offer: availabilityFilters.includes('on-offer'),
      sort_by: sortOrder, // Pasar el criterio de ordenamiento a la RPC
      // Añadir parámetros de paginación si los implementas (page_limit, page_offset)
    };

    // Llamar a la RPC
    const { data, error } = await supabase.rpc('get_filtered_products_with_rating', rpcParams);

    if (error) {
      console.error("Error loading products from RPC:", error);
      setProducts([]);
    } else {
       // Los datos vienen de la RPC. Necesitamos obtener las imágenes por separado para cada producto.
       const productIds = data?.map(item => item.id) || []; // Usar item.id ya sin prefijo
       let productsWithImages: ProductForFrontend[] = [];

       if (productIds.length > 0) {
          const { data: imagesData, error: imagesError } = await supabase
            .from('imagenes_producto')
            .select('id, producto_id, url, es_principal') // Seleccionar también id de imagen
            .in('producto_id', productIds);

          if (imagesError) {
             console.error("Error fetching product images:", imagesError);
             // Continuar sin imágenes o manejar el error
          } else {
             // Mapear los productos devueltos por la RPC y adjuntar sus imágenes
             productsWithImages = data.map((productRpc: ProductRpc) => {
                const productImages = imagesData?.filter(img => img.producto_id === productRpc.id) || []; // Usar productRpc.id
                 const mainImage = productImages.find(img => img.es_principal) || productImages[0];
                 const imageUrl = mainImage?.url || '/placeholder.jpg';

                return {
                   id: productRpc.id, // Usar productRpc.id sin prefijo
                   nombre: productRpc.nombre,
                   precio: productRpc.precio,
                   precio_descuento: productRpc.precio_descuento,
                   marca: productRpc.marca,
                   stock: productRpc.stock,
                   destacado: productRpc.destacado,
                   nuevo: productRpc.nuevo,
                   rating: productRpc.valoracion_promedio, // Usar valoracion_promedio directamente
                   imagenes_producto: productImages, // Adjuntar las imágenes obtenidas
                };
             });
          }
       }
        setProducts(productsWithImages);
    }
    setLoading(false);
  }, [selectedCategories, priceRange, selectedBrands, minRating, availabilityFilters, sortOrder]); // Dependencias del efecto

  // Efectos para cargar datos iniciales y refetching al cambiar filtros/orden
  useEffect(() => {
    fetchCategories();
    fetchBrands(); // Cargar marcas disponibles
  }, [fetchCategories, fetchBrands]);

   useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Manejar cambio en los checkboxes de categoría
  const handleCategoryChange = (slug: string, isChecked: boolean) => {
    setSelectedCategories(prevSelected =>
      isChecked
        ? [...prevSelected, slug]
        : prevSelected.filter(catSlug => catSlug !== slug)
    );
  };

  // Manejar cambio en el slider de rango de precio
  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  // Manejar cambio en los checkboxes de marca
  const handleBrandChange = (brand: string, isChecked: boolean) => {
    setSelectedBrands(prevSelected =>
      isChecked
        ? [...prevSelected, brand]
        : prevSelected.filter(b => b !== brand)
    );
  };

   // Manejar cambio en los checkboxes de valoración
  const handleRatingChange = (rating: number, isChecked: boolean) => {
    setMinRating(isChecked ? rating : 0);
  };

  // Manejar cambio en los checkboxes de disponibilidad
  const handleAvailabilityChange = (filter: string, isChecked: boolean) => {
    setAvailabilityFilters(prevSelected =>
      isChecked
        ? [...prevSelected, filter]
        : prevSelected.filter(f => f !== filter)
    );
  };

  // Manejar cambio en el selector de ordenamiento
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value);
  };

  // Manejar limpiar todos los filtros
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]); // Ajustar si el rango máximo real es diferente.
    setSelectedBrands([]);
    setMinRating(0);
    setAvailabilityFilters([]);
    setSortOrder('relevance');
  };


  return (
    <div className="min-h-screen bg-[#f5f8ff]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Productos", href: "/productos", active: true },
          ]}
        />

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Todos los Productos</h1>

          <div className="flex items-center space-x-4">
            {/* Vista en cuadrícula/lista - Lógica no implementada */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Grid className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <List className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center">
              <span className="text-sm mr-2">Ordenar por:</span>
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0084cc]"
                  value={sortOrder}
                  onChange={handleSortChange}
                >
                  <option value="relevance">Más relevantes</option>
                  <option value="price-asc">Precio: Menor a mayor</option>
                  <option value="price-desc">Precio: Mayor a menor</option>
                  <option value="newest">Más nuevos</option>
                  <option value="rating">Mejor valorados</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filtros</h3>
                <Button variant="link" className="text-[#0084cc] text-sm p-0" onClick={handleClearFilters}>
                  Limpiar todo
                </Button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categorías</h4>
                <div className="space-y-2">
                  {categories.length === 0 ? (
                    <div>Cargando categorías...</div>
                  ) : (
                    categories.map(category => (
                      <div key={category.id} className="flex items-center">
                        <Checkbox
                          id={`cat-${category.slug}`}
                          checked={selectedCategories.includes(category.slug)}
                          onCheckedChange={(isChecked: boolean) => handleCategoryChange(category.slug, isChecked)}
                        />
                        <label htmlFor={`cat-${category.slug}`} className="ml-2 text-sm">
                          {category.nombre}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Rango de Precio</h4>
                <Slider defaultValue={[0, 1000]} max={1000} step={1} className="mb-4" value={priceRange} onValueChange={handlePriceRangeChange} />
                <div className="flex items-center justify-between">
                  <div className="w-20 px-2 py-1 bg-gray-100 rounded text-sm text-center">€{priceRange[0]}</div>
                  <span className="text-sm text-gray-500">hasta</span>
                  <div className="w-20 px-2 py-1 bg-gray-100 rounded text-sm text-center">€{priceRange[1]}</div>
                </div>
              </div>

              {/* Brands */}
              {brands.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Marcas</h4>
                  <div className="space-y-2">
                     {brands.map(brand => (
                         <div key={brand} className="flex items-center">
                           <Checkbox
                             id={`brand-${brand}`}
                             checked={selectedBrands.includes(brand)}
                             onCheckedChange={(isChecked: boolean) => handleBrandChange(brand, isChecked)}
                           />
                           <label htmlFor={`brand-${brand}`} className="ml-2 text-sm">
                             {brand}
                           </label>
                         </div>
                       ))
                     }
                  </div>
                </div>
              )}

              {/* Ratings */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Valoraciones</h4>
                <div className="space-y-2">
                  {[5, 4, 3].map(ratingValue => (
                     <div key={ratingValue} className="flex items-center">
                       <Checkbox
                         id={`rating-${ratingValue}`}
                         checked={minRating === ratingValue}
                         onCheckedChange={(isChecked: boolean) => handleRatingChange(ratingValue, isChecked)}
                       />
                       <label htmlFor={`rating-${ratingValue}`} className="ml-2 text-sm flex items-center">
                         <div className="flex">
                           {[...Array(ratingValue)].map((_, i) => (
                             <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                           ))}
                           {[...Array(5 - ratingValue)].map((_, i) => (
                              <Star key={i + ratingValue} className="w-4 h-4 text-gray-300" fill="currentColor" />
                           ))}
                         </div>
                          {ratingValue < 5 && <span className="ml-1">y más</span>}
                       </label>
                     </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="font-medium mb-3">Disponibilidad</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox
                      id="availability-stock"
                      checked={availabilityFilters.includes('in-stock')}
                      onCheckedChange={(isChecked: boolean) => handleAvailabilityChange('in-stock', isChecked)}
                    />
                    <label htmlFor="availability-stock" className="ml-2 text-sm">
                      En stock
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id="availability-offer"
                       checked={availabilityFilters.includes('on-offer')}
                      onCheckedChange={(isChecked: boolean) => handleAvailabilityChange('on-offer', isChecked)}
                    />
                    <label htmlFor="availability-offer" className="ml-2 text-sm">
                      Oferta
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div>Cargando productos...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full text-center">No se encontraron productos con los filtros seleccionados.</div>
                ) : (
                  products.map((product) => {
                    // Encontrar la imagen principal o usar la primera si no hay principal
                    const mainImage = product.imagenes_producto.find(img => img.es_principal) || product.imagenes_producto[0];
                    const imageUrl = mainImage?.url || '/placeholder.jpg';

                    return (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.nombre}
                        price={product.precio}
                        image={imageUrl}
                        rating={product.rating} // Usar la valoración promedio real obtenida de la RPC
                        discount={product.precio_descuento ? Math.round(((product.precio - product.precio_descuento) / product.precio) * 100) : undefined}
                      />
                    );
                  })
                )}
              </div>
            )}

            {/* Pagination - Lógica no implementada */}
            <div className="mt-12 flex justify-center">
               {/* Componente de paginación aquí */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
