'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Breadcrumb } from '@/components/breadcrumb';
import { User, ShoppingBag, MapPin, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AccountPage() {
  const { user, isLoading } = useAuth();

  // Redirect to login if not authenticated and loading is complete
  // This assumes AuthContext handles redirection or user state appropriately
  // For a direct redirect here:
  // const router = useRouter();
  // useEffect(() => {
  //   if (!user && !isLoading) {
  //     router.push('/login');
  //   }
  // }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="min-h-screen bg-[#f5f8ff] flex items-center justify-center"><p>Cargando usuario...</p></div>;
  }

  if (!user) {
     // This case should ideally be handled by a top-level auth wrapper
     // but as a fallback, you might show a message or redirect
      return (
         <div className="min-h-screen bg-[#f5f8ff] flex items-center justify-center">
            <Card className="w-[350px] text-center">
               <CardHeader>
                  <CardTitle>Acceso Requerido</CardTitle>
                  <CardDescription>Debes iniciar sesión para ver tu cuenta.</CardDescription>
               </CardHeader>
               <CardContent>
                  <Link href="/login" passHref>
                     <Button className="w-full bg-[#0084cc] hover:bg-[#006ba7]">Iniciar Sesión</Button>
                  </Link>
               </CardContent>
            </Card>
         </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#f5f8ff]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Cuenta', href: '/cuenta', active: true },
          ]}
        />

        <h1 className="text-3xl font-bold mb-8">Mi Cuenta</h1>

        {/* Welcome Message */}
        {user?.email && (
           <div className="mb-8 text-lg text-gray-700">
              <p>Bienvenido, <span className="font-semibold">{user.email}</span>!</p>
           </div>
        )}


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Section Link: Pedidos */}
          <Link href="/cuenta/pedidos" passHref>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <ShoppingBag className="h-8 w-8 text-[#0084cc] mb-2" />
                <CardTitle>Mis Pedidos</CardTitle>
                <CardDescription>Ver historial de pedidos y estado.</CardDescription>
              </CardHeader>
              {/* <CardContent>
                <p>Show order summary here?</p>
              </CardContent> */}
            </Card>
          </Link>

          {/* Section Link: Profile (Placeholder) */}
           {/* Assuming /cuenta/perfil route exists or will be created */}
          <Link href="/cuenta/perfil" passHref>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <User className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Perfil</CardTitle>
                <CardDescription>Gestionar información personal.</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Section Link: Addresses (Placeholder) */}
          {/* Assuming /cuenta/direcciones route exists or will be created */}
           <Link href="/cuenta/direcciones" passHref>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <MapPin className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Direcciones</CardTitle>
                <CardDescription>Guardar y gestionar direcciones de envío.</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Section Link: Payment Methods (Placeholder) */}
           {/* Assuming /cuenta/metodos-pago route exists or will be created */}
           <Link href="/cuenta/metodos-pago" passHref>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CreditCard className="h-8 w-8 text-yellow-600 mb-2" />
                <CardTitle>Métodos de Pago</CardTitle>
                <CardDescription>Añadir o actualizar métodos de pago.</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Add more account sections as needed (e.g., Wishlist, Notifications) */}

        </div>
      </div>
    </div>
  );
}
