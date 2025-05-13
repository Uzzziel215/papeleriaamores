'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Breadcrumb } from '@/components/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Assuming you need Spanish locale for dates
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

// Define types for Order and OrderItem based on your database schema
// Assuming 'pedidos' table with id, created_at, estado, total
// Assuming 'detalles_pedido' table with pedido_id, cantidad, precio_unitario, subtotal, producto_id, variante_id
// Assuming 'productos' table with id, nombre
// Assuming 'variantes_producto' table with id, valor (e.g., color, size)

interface OrderItem {
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  productos: { // Assuming products relationship is named 'productos'
    nombre: string;
  } | null; // Product details might be null if product was deleted
  variantes: { // Assuming variants relationship is named 'variantes'
    valor: string | null;
  } | null; // Variant details might be null
}

interface Order {
  id: string;
  created_at: string; // Supabase returns timestamp strings
  estado: string; // Should match your estado_pedido ENUM values
  total: number;
  detalles_pedido: OrderItem[]; // Assuming the relationship is named 'detalles_pedido'
}

export default function OrdersPage() {
  const { user, isLoading: isLoadingUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      setError(null);

      if (!user) {
         // If user is not loaded and not loading, it means they are not logged in
         if (!isLoadingUser) {
           setError('Debes iniciar sesión para ver tus pedidos.');
         }
         setIsLoading(false);
         setOrders([]); // Ensure orders are empty if no user
         return;
      }

      try {
        // Fetch orders for the logged-in user
        const { data: ordersData, error: ordersError } = await supabase
          .from('pedidos') // Your orders table name
          .select(\`
            id,
            created_at,
            estado,
            total,
            detalles_pedido (
              cantidad,
              precio_unitario,
              subtotal,
              productos ( nombre ),
              variantes ( valor )
            )
          \`) // Select order details and nested order items with product/variant names
          .eq('usuario_id', user.id) // Filter by the logged-in user's ID
          .order('created_at', { ascending: false }); // Order by most recent first

        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
          setError(ordersError.message);
          setOrders([]);
        } else {
          setOrders(ordersData as Order[]);
        }
      } catch (err: any) {
        console.error('Caught exception fetching orders:', err);
        setError('Ocurrió un error inesperado al cargar los pedidos.');
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    }

    // Only fetch if user data is available (not loading and not null)
    if (!isLoadingUser && user) {
      fetchOrders();
    } else if (!isLoadingUser && !user) {
       // Handle case where user is not logged in after auth loading is complete
       setIsLoading(false);
       setError('Debes iniciar sesión para ver tus pedidos.');
    }

  }, [user, isLoadingUser]); // Depend on user and isLoadingUser to refetch when auth state changes

  // Format date for display
  const formatOrderDate = (dateString: string) => {
    try {
       // Parse date string and format it in Spanish
       return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: es });
    } catch (e) {
       console.error('Error formatting date:', e);
       return dateString; // Return original string if formatting fails
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8ff]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Cuenta', href: '/cuenta' },
            { label: 'Pedidos', href: '/cuenta/pedidos', active: true },
          ]}
        />

        <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>

        {isLoading || isLoadingUser && <p className="text-center">Cargando pedidos...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!isLoading && !error && orders.length === 0 && (
          <div className="text-center">
             <p className="text-gray-600 mb-4">No has realizado ningún pedido todavía.</p>
             <Link href="/productos" passHref>
                <Button className="bg-[#0084cc] hover:bg-[#006ba7]">Explorar Productos</Button>
             </Link>
          </div>
        )}

        <div className="space-y-6">
          {!isLoading && !error && orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-100/50 flex-row items-center justify-between space-y-0 py-4 px-6">
                <div>
                  <CardTitle className="text-lg font-semibold">Pedido #{order.id.substring(0, 8)}</CardTitle> {/* Display truncated ID */}
                  <CardDescription className="text-sm text-gray-600">{formatOrderDate(order.created_at)}</CardDescription>
                </div>
                <div className="text-lg font-bold text-[#0084cc]">€{order.total.toFixed(2)}</div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4">
                   <h3 className="text-md font-semibold mb-2">Estado: <span className="font-normal text-gray-700">{order.estado}</span></h3>
                </div>
                <Separator className="mb-4" />
                <div className="space-y-4">
                  {order.detalles_pedido.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start">
                       {/* You would typically join with product/variant to show image here */}
                       {/* Placeholder for item image */}
                        <div className="w-12 h-12 bg-gray-200 rounded mr-4 flex-shrink-0"></div>
                       <div className="flex-1">
                         <p className="text-sm font-medium">{item.productos?.nombre || 'Producto Desconocido'}</p>
                          {item.variantes?.valor && (
                              <p className="text-xs text-gray-600">Variante: {item.variantes.valor}</p>
                          )}
                         <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                          <p className="text-sm font-semibold">€{(item.precio_unitario * item.cantidad).toFixed(2)}</p>
                       </div>
                    </div>
                  ))}
                </div>
                {/* Optional: Button to view order details page */}
                 {/* <div className="mt-6 text-right">
                     <Link href={`/cuenta/pedidos/${order.id}`} passHref>
                         <Button variant="outline">Ver Detalles</Button>
                     </Link>
                 </div> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
