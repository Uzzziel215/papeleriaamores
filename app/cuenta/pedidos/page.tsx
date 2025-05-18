// app/cuenta/pedidos/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
// import { Database } from '@/types/database.types'; // Importa tus tipos si los usas

// Define un tipo básico para los pedidos, ajústalo según la estructura exacta de tus datos
// Asegúrate de que estos tipos coinciden con el SELECT que haces
interface OrderDetail {
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    productos: { nombre: string } | null; // Asumiendo que productos es un objeto con nombre
    variantes: { valor: string } | null; // Asumiendo que variantes es un objeto con valor
}

interface Order {
    id: string;
    created_at: string; // O Date si prefieres parsearla
    estado: string; // O el tipo exacto de tu ENUM estado_pedido
    total: number;
    detalles_pedido: OrderDetail[];
    // Añade otras columnas de la tabla 'pedidos' que selecciones
    numero_pedido?: string; // Si seleccionas el numero_pedido
    direccion_envio_id?: string | null; // Si seleccionas la dirección
}


const PedidosPage = () => {
    const { user, isLoading: isLoadingUser } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Estado de carga para los pedidos
    const [error, setError] = useState<string | null>(null);

    // Asegúrate de que el cliente Supabase se inicializa solo una vez, idealmente en tu AuthContext
    const supabase = createClientComponentClient(); // Puedes pasar los tipos: createClientComponentClient<Database>()


    useEffect(() => {
        // Redirigir si el usuario no está autenticado después de que la carga de auth termine
        console.log('PedidosPage useEffect (Auth Check): isLoadingUser', isLoadingUser, 'user', user ? user.id : null);
        if (!isLoadingUser && !user) {
             console.log('PedidosPage useEffect (Auth Check): User not authenticated, redirecting to login.');
            router.push('/login');
        }
    }, [user, isLoadingUser, router]); // Depende del estado del usuario y la carga de auth


    useEffect(() => {
        // Función asíncrona para cargar los pedidos
        const fetchOrders = async () => {
            console.log('PedidosPage useEffect (Fetch Orders): Fetching orders for user ID:', user?.id);
            setIsLoading(true); // Iniciar carga antes de la consulta
            setError(null); // Limpiar errores anteriores

            if (!user) {
                 console.log('PedidosPage useEffect (Fetch Orders): No user available to fetch orders.');
                 setIsLoading(false);
                 setError('Debes iniciar sesión para ver tus pedidos.');
                 return; // No intentar buscar si no hay usuario
            }

            try {
                // Fetch orders for the logged-in user
                const { data: ordersData, error: ordersError } = await supabase
                  .from('pedidos') // Your orders table name
                  // CADENA SELECT CORREGIDA:
                  .select(`
                    id,
                    numero_pedido, -- Incluir numero_pedido si lo tienes y seleccionas
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
                  `) // Select order details and nested order items with product/variant names
                  .eq('usuario_id', user.id) // Filter by the logged-in user's ID
                  .order('created_at', { ascending: false }); // Order by most recent first


                console.log('PedidosPage useEffect (Fetch Orders): Supabase query returned:');
                console.log('  Data:', ordersData);
                console.log('  Error:', ordersError); // Logear el objeto error completo

                if (ordersError) {
                    console.error('PedidosPage useEffect (Fetch Orders): Error fetching orders:', ordersError);
                    // Loguear detalles específicos del error si están disponibles
                    console.error('  Error Code:', ordersError.code);
                    console.error('  Error Message:', ordersError.message);
                    console.error('  Error Details:', ordersError.details);
                    console.error('  Error Hint:', ordersError.hint);

                    setError(ordersError.message || 'Error desconocido al cargar pedidos.');
                    setOrders([]);
                } else {
                    console.log('PedidosPage useEffect (Fetch Orders): Orders data received.');
                    setOrders(ordersData as Order[]);
                }
            } catch (err: any) {
                 console.error('PedidosPage useEffect (Fetch Orders): Caught exception:', err);
                setError('Ocurrió un error inesperado al cargar los pedidos: ' + (err.message || err));
                setOrders([]);
            } finally {
                setIsLoading(false); // Finalizar carga
            }
        }

        // Solo buscar pedidos si la carga de autenticación ha terminado y hay un usuario
        // y la página no está actualmente cargando pedidos.
        // Usamos isLoading como dependencia para permitir reintentos si estaba true y no se completó.
        if (!isLoadingUser && user && isLoading) { // Mantenemos isLoading como dependencia para posibles reintentos
             fetchOrders();
        } else if (!isLoadingUser && !user && isLoading) {
             // Si auth terminó, no hay usuario, y isLoading sigue true, significa que no se pudo buscar.
             setIsLoading(false); // Asegurar que el estado de carga se desactive.
        }


    }, [user, isLoadingUser, supabase, isLoading]); // Depende de user, isLoadingUser, supabase y isLoading (para reintentar si isLoading sigue true)


    // Lógica de Renderizado
    if (isLoadingUser || isLoading) {
        console.log('PedidosPage Render: Showing Loading...');
        return <div>Cargando pedidos...</div>;
    }

    if (error) {
         console.log('PedidosPage Render: Showing Error:', error);
        return <div>Error al cargar pedidos: {error}</div>;
    }

     if (!user) {
        // Este caso debería ser manejado por el primer useEffect para redirigir.
        // Como fallback de render si por alguna razón no redirigió.
        console.log('PedidosPage Render: User not present after loading. Should have redirected.');
         return null; // O un mensaje indicando que inicie sesión
     }


    console.log('PedidosPage Render: Showing Orders.');
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Mis Pedidos</h1>
            {orders.length === 0 ? (
                <p>No tienes pedidos aún.</p>
            ) : (
                <ul>
                    {orders.map(order => (
                        <li key={order.id} className="mb-4 p-4 border rounded-md">
                            <h2 className="text-lg font-semibold">Pedido #{order.numero_pedido || order.id}</h2> {/* Usando numero_pedido si existe */}
                            <p>Estado: {order.estado}</p>
                            <p>Fecha: {new Date(order.created_at).toLocaleDateString()}</p>
                            <p>Total: ${order.total.toFixed(2)}</p>
                            <h3 className="font-medium mt-2">Productos:</h3>
                            <ul>
                                {order.detalles_pedido.map((detail, index) => (
                                    <li key={index} className="ml-4 text-sm">
                                        {detail.cantidad} x {detail.productos?.nombre} ({detail.variantes?.valor || 'N/A'}) - ${(detail.cantidad * detail.precio_unitario).toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PedidosPage;
