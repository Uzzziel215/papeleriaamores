"use client"

import { Grid, List, ArrowUpDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Breadcrumb } from "@/components/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
// Importar la instancia de Supabase ya creada
import { supabase } from "@/lib/supabase";
import type { Categoria } from "@/types/database.types";

import { useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation'; // Import useSearchParams and useRouter
import { useAuth } from "@/contexts/AuthContext";
import { FavoritosProvider, useFavoritos } from "@/contexts/FavoritosContext"; // Import FavoritosProvider and useFavoritos
import { ProductGrid } from "@/components/product-grid"; // Import ProductGrid

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
  porcentaje_descuento?: number | null; // Añadir porcentaje_descuento
  marca?: string | null;
  stock: number;
  destacado: boolean;
  nuevo: boolean;
  rating: number; // Valoración promedio para el ProductCard
}

// Interfaz para la data de marcas de la base de datos
interface BrandData { marca: string | null; }

// Define a wrapper component to use the hook and provider
function ProductosPageContent() {
  const searchParams = useSearchParams(); // Get search params
  const router = useRouter(); // Get router
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { favoriteIds, toggleFavorite, loading } = useFavoritos(); // Use useFavoritos hook and use 'loading'

  // Read initial filter states from URL search params
  const getInitialStateFromUrl = () => {
    const categorySlugs = searchParams.get('categorias')?.split(',').filter(Boolean) || [];
    const availability = searchParams.get('disponibilidad')?.split(',').filter(Boolean) || [];
    const filter = searchParams.get('filtro'); // 'featured'
    const minRatingParam = searchParams.get('valoracion');
    const priceMinParam = searchParams.get('precio_min');
    const priceMaxParam = searchParams.get('precio_max');
    const brandsParam = searchParams.get('marcas')?.split(',').filter(Boolean) || [];
    const sortParam = searchParams.get('orden') || 'relevance';

    return {
      initialCategories: categorySlugs,
      initialAvailability: availability,
      initialFeatured: filter === 'destacados',
      initialMinRating: minRatingParam ? parseInt(minRatingParam, 10) : 0,
      initialPriceRange: [
        priceMinParam ? parseFloat(priceMinParam) : 0,
        priceMaxParam ? parseFloat(priceMaxParam) : 1000,
      ] as [number, number],
      initialBrands: brandsParam,
      initialSortOrder: sortParam,
    };
  };

  const initialState = getInitialStateFromUrl();

  // Initialize selectedCategories state with the category slug from URL if it exists
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialState.initialCategories
  );

  const [products, setProducts] = useState<ProductForFrontend[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true); // Renamed to avoid conflict

  // Estados para otros filtros y ordenamiento
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialState.initialPriceRange
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialState.initialBrands
  );
  const [minRating, setMinRating] = useState<number>(
    initialState.initialMinRating
  );

  // State for absolute max price from database
  const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState<number>(1000);

  // Initialize availabilityFilters state with 'on-offer' if the URL param is present
  const [availabilityFilters, setAvailabilityFilters] = useState<string[]>(
    initialState.initialAvailability
  );

  // Initialize featuredFilter state based on URL parameter
  const [featuredFilter, setFeaturedFilter] = useState<boolean>(
    initialState.initialFeatured
  );

  const [sortOrder, setSortOrder] = useState<string>(
    initialState.initialSortOrder
  );

  // Effect to update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategories.length > 0) {
      params.set('categorias', selectedCategories.join(','));
    } else {
      params.delete('categorias');
    }

    if (availabilityFilters.length > 0) {
      params.set('disponibilidad', availabilityFilters.join(','));
    } else {
      params.delete('disponibilidad');
    }

    if (featuredFilter) {
      params.set('filtro', 'destacados');
    } else {
      params.delete('filtro');
    }

    if (minRating > 0) {
      params.set('valoracion', minRating.toString());
    } else {
      params.delete('valoracion');
    }

    if (priceRange[0] !== 0 || priceRange[1] !== 1000) {
       params.set('precio_min', priceRange[0].toString());
       params.set('precio_max', priceRange[1].toString());
    } else {
       params.delete('precio_min');
       params.delete('precio_max');
    }

    if (selectedBrands.length > 0) {
      params.set('marcas', selectedBrands.join(','));
    } else {
      params.delete('marcas');
    }

    if (sortOrder !== 'relevance') {
      params.set('orden', sortOrder);
    } else {
      params.delete('orden');
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }, [selectedCategories, availabilityFilters, featuredFilter, minRating, priceRange, selectedBrands, sortOrder, router, searchParams]);

  // Fetch absolute maximum price on mount
  useEffect(() => {
    const fetchAbsoluteMaxPrice = async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('precio')
        .order('precio', { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching absolute max price:", error);
      } else if (data && data.length > 0) {
        setAbsoluteMaxPrice(data[0].precio);
        // If the initial priceRange max is higher than the actual max, adjust it
        if (initialState.initialPriceRange[1] > data[0].precio) {
           setPriceRange([initialState.initialPriceRange[0], data[0].precio]);
        }
      }
    };
    fetchAbsoluteMaxPrice();
  }, []); // Empty dependency array means this effect runs only once on mount

  // Función para cargar categorías
  const fetchCategories = useCallback(async () => {
    // Select all necessary fields to match the Categoria type
    const { data, error } = await supabase.from("categorias").select("id, nombre, slug, imagen_url").order('orden', { ascending: true });
    if (error) console.error("Error loading categories:", error); else setCategories(data || []);
  }, []);

  // Función para cargar marcas disponibles (únicas)
  const fetchBrands = useCallback(async () => {
    // Use a simple query and process distinct brands in the frontend
    const { data, error } = await supabase.from("productos").select("marca").not('marca', 'is', null) as { data: BrandData[] | null, error: any };
    if (error) {
      console.error("Error loading brands:", error);
    } else {
      // Explicitly type the item in the map callback and filter out nulls
      setBrands(data?.map((item: BrandData) => item.marca).filter((marca): marca is string => marca !== null).filter((value, index, self) => self.indexOf(value) === index) || []);
    }
  }, []);

  // Función para cargar productos usando la RPC
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true); // Use renamed loading state

    const rpcParams = {
      category_slugs: selectedCategories.length > 0 ? selectedCategories : null,
      price_min: priceRange[0],
      price_max: priceRange[1],
      brands: selectedBrands.length > 0 ? selectedBrands : null,
      min_rating: minRating,
      is_in_stock: availabilityFilters.includes('in-stock'),
      is_on_offer: availabilityFilters.includes('on-offer'),
      sort_by: sortOrder,
      // Removed is_featured filter as it's not supported by the RPC
      page_limit: 24,
      page_offset: 0,
    };

    const { data, error } = await supabase.rpc('get_filtered_products_with_rating', rpcParams);

    if (error) {
      console.error("Error loading products from RPC:", error);
      setProducts([]);
    } else {
       const productIds = data?.map((item: ProductRpc) => item.id) || [];
       let productsWithImages: ProductForFrontend[] = [];

       if (productIds.length > 0) {
          const { data: imagesData, error: imagesError } = await supabase
            .from('imagenes_producto')
            .select('id, producto_id, url, es_principal')
            .in('producto_id', productIds);

          if (imagesError) {
             console.error("Error fetching product images:", imagesError);
          } else {
             productsWithImages = data.map((productRpc: ProductRpc) => {
                // Explicitly type the item in the filter callback
                const productImages = imagesData?.filter((img: { producto_id: string }) => img.producto_id === productRpc.id) || [];
                 const mainImage = productImages.find(img => img.es_principal) || productImages[0];
                 const imageUrl = mainImage?.url || '/placeholder.jpg';

                return {
                   id: productRpc.id,
                   nombre: productRpc.nombre,
                   precio: productRpc.precio,
                   precio_descuento: productRpc.precio_descuento,
                   porcentaje_descuento: productRpc.porcentaje_descuento, // Ensure this is included
                   marca: productRpc.marca,
                   stock: productRpc.stock,
                   destacado: productRpc.destacado,
                   nuevo: productRpc.nuevo,
                   rating: productRpc.valoracion_promedio,
                   imagenes_producto: productImages,
                };
             });
             setProducts(productsWithImages);
           }
        } else {
           setProducts([]);
        }
    }
    setLoadingProducts(false); // Use renamed loading state
  }, [selectedCategories, priceRange, selectedBrands, minRating, availabilityFilters, sortOrder]);

  // Initial data fetch
  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, [fetchCategories, fetchBrands]);

  // Fetch products whenever filters or sort order change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (slug: string, isChecked: boolean) => {
    setSelectedCategories(
      isChecked ? [...selectedCategories, slug] : selectedCategories.filter((cat) => cat !== slug)
    );
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  const handleBrandChange = (brand: string, isChecked: boolean) => {
    setSelectedBrands(
      isChecked ? [...selectedBrands, brand] : selectedBrands.filter((b) => b !== brand)
    );
  };

  const handleRatingChange = (rating: number, isChecked: boolean) => {
    setMinRating(isChecked ? rating : 0);
  };
  
  const handleFeaturedChange = (isChecked: boolean) => {
    setFeaturedFilter(isChecked);
  };

  const handleAvailabilityChange = (filter: string, isChecked: boolean) => {
    setAvailabilityFilters(
      isChecked ? [...availabilityFilters, filter] : availabilityFilters.filter((f) => f !== filter)
    );
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setSelectedBrands([]);
    setMinRating(0);
    setAvailabilityFilters([]);
    setFeaturedFilter(false);
    setSortOrder('relevance');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Productos', href: '/productos' },
        ]}
      />

      <h1 className="text-3xl font-bold mb-8">Catálogo de Productos</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64">
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4">Filtros</h3>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Categorías</h4>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center mb-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.slug)}
                    onCheckedChange={(isChecked: boolean) =>
                      handleCategoryChange(category.slug, isChecked)
                    }
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.nombre}
                  </label>
                </div>
              ))}
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-4">Precio</h4>
              <Slider
                min={0}
                max={absoluteMaxPrice} // Use the absolute max price here
                step={1}
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                className="w-full"
              />
              <div className="flex justify-between text-sm mt-2">
                <span>${priceRange[0].toFixed(2)}</span>
                <span>${priceRange[1].toFixed(2)}</span>
              </div>
            </div>

            {/* Brand Filter */}
             <div className="mb-6">
                <h4 className="font-medium mb-2">Marca</h4>
                {brands.map((brand) => (
                   <div key={brand} className="flex items-center mb-2">
                     <Checkbox
                       id={`brand-${brand}`}
                       checked={selectedBrands.includes(brand)}
                       onCheckedChange={(isChecked: boolean) =>
                         handleBrandChange(brand, isChecked)
                       }
                     />
                     <label
                       htmlFor={`brand-${brand}`}
                       className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                     >
                       {brand}
                     </label>
                   </div>
                ))}
             </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Valoración Mínima</h4>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center mb-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={minRating === rating}
                    onCheckedChange={(isChecked: boolean) =>
                      handleRatingChange(rating, isChecked)
                    }
                  />
                  <label
                    htmlFor={`rating-${rating}`}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                  >
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    ))}
                    {[...Array(5 - rating)].map((_, i) => (
                      <Star key={i + rating} className="h-4 w-4 text-gray-300 mr-1" />
                    ))}
                  </label>
                </div>
              ))}
            </div>

            {/* Availability Filter */}
            <div className="mb-6">
               <h4 className="font-medium mb-2">Disponibilidad</h4>
               <div className="flex items-center mb-2">
                 <Checkbox
                   id="in-stock"
                   checked={availabilityFilters.includes('in-stock')}
                   onCheckedChange={(isChecked: boolean) =>
                     handleAvailabilityChange('in-stock', isChecked)
                   }
                 />
                 <label
                   htmlFor="in-stock"
                   className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                 >
                   En stock
                 </label>
               </div>
               <div className="flex items-center mb-2">
                 <Checkbox
                   id="on-offer"
                   checked={availabilityFilters.includes('on-offer')}
                   onCheckedChange={(isChecked: boolean) =>
                     handleAvailabilityChange('on-offer', isChecked)
                   }
                 />
                 <label
                   htmlFor="on-offer"
                   className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                 >
                   En oferta
                 </label>
               </div>
            </div>

            {/* Featured Filter */}
            <div className="mb-6">
               <h4 className="font-medium mb-2">Filtros Adicionales</h4>
               <div className="flex items-center mb-2">
                 <Checkbox
                   id="featured"
                   checked={featuredFilter}
                   onCheckedChange={handleFeaturedChange}
                 />
                 <label
                   htmlFor="featured"
                   className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                 >
                   Destacados
                 </label>
               </div>
            </div>

            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="w-full text-[#0084cc] border-[#0084cc] hover:bg-[#0084cc] hover:text-white"
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>

        {/* Product List/Grid */}
        <div className="flex-1">
          {/* Sort Order */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center">
              <label htmlFor="sort-order" className="text-sm font-medium mr-2">Ordenar por:</label>
              <select
                id="sort-order"
                value={sortOrder}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-md text-sm p-2"
              >
                <option value="relevance">Relevancia</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
                <option value="rating_desc">Valoración: Mayor a Menor</option>
                <option value="newest">Más Recientes</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loadingProducts || isLoadingAuth || loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse bg-gray-200 rounded-lg h-60"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No se encontraron productos con los filtros seleccionados.
            </div>
          ) : (
             <ProductGrid 
                products={products}
                favoriteIds={favoriteIds} // Pass favoriteIds from context
                onToggleFavorite={toggleFavorite} // Pass toggleFavorite from context
             />
          )}

          {/* Pagination Placeholder */}
          {/* Add pagination controls here if needed */}
        </div>
      </div>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <FavoritosProvider>
      <ProductosPageContent />
    </FavoritosProvider>
  );
}
