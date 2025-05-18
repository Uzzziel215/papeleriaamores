// components/layout/header.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Usando Avatar genérico por simplicidad
// Importa los tipos de tu base de datos si los usas con createClientComponentClient
// import { Database } from '@/types/database.types';


const Header = () => {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isAdmin, setIsAdmin] = useState(false); // Estado para el estado de administrador del usuario en el header
  const [checkingAdmin, setCheckingAdmin] = useState(true); // Estado para la carga de verificación de admin

  // Asegúrate de que el cliente Supabase se inicializa solo una vez, idealmente en tu AuthContext
  const supabase = createClientComponentClient(); // Puedes pasar los tipos: createClientComponentClient<Database>()


  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Verificar si el usuario autenticado es administrador (lógica similar a la página de admin)
   useEffect(() => {
       const checkAdminStatus = async () => {
           if (user) {
                console.log('Header useEffect (Admin Check): Checking admin status for user ID:', user.id);
                setCheckingAdmin(true); // Iniciar verificación

                // Usamos maybeSingle() aquí porque esperamos 0 o 1 resultado.
                const { data, error } = await supabase
                    .from('admin_users')
                    .select('user_id')
                    .eq('user_id', user.id)
                    .maybeSingle(); // <-- Usamos maybeSingle

                console.log('Header useEffect (Admin Check): Supabase query returned:');
                console.log('  Data:', data);
                console.log('  Error:', error);


                if (error) {
                    console.error('Header useEffect (Admin Check): Supabase query returned an error.', error);
                     console.error('  Error Code:', error.code);
                     console.error('  Error Message:', error.message);
                     console.error('  Error Details:', error.details);
                     console.error('  Error Hint:', error.hint);
                    setIsAdmin(false);
                } else if (data) {
                     console.log('Header useEffect (Admin Check): User found in admin_users (data received).');
                    setIsAdmin(true);
                } else {
                     // data es null Y error es null - esto es lo que maybeSingle retorna si no encuentra filas
                     console.log('Header useEffect (Admin Check): User not found in admin_users (data is null, error is null).');
                    setIsAdmin(false);
                }
                setCheckingAdmin(false); // Finalizar verificación
           } else {
              // Si no hay usuario, no es admin y terminamos de verificar
              setIsAdmin(false);
              setCheckingAdmin(false);
           }
       };

       // Ejecutar la verificación de admin solo si la carga de auth terminó y el estado del user cambió.
       // Solo verificar si no estamos ya verificando (para evitar bucles infinitos si hay problemas)
       // Añadimos una condición para no re-verificar si ya es admin.
       if (!isLoadingAuth && user && !checkingAdmin && !isAdmin) { // Añadidos user, !checkingAdmin y !isAdmin
           checkAdminStatus();
       } else if (!isLoadingAuth && !user && checkingAdmin) {
           // Si la auth terminó, no hay usuario, y checkingAdmin sigue true, desactívalo.
           setCheckingAdmin(false);
       } else if (isLoadingAuth && checkingAdmin) {
           // Si auth está cargando y checkingAdmin sigue true, déjalo en true.
           // No hacer nada, se resolverá cuando isLoadingAuth cambie.
       } else if (isAdmin && checkingAdmin) {
            // Si ya detectamos que es admin y checkingAdmin sigue true, desactívalo.
            setCheckingAdmin(false);
       }


   }, [user, isLoadingAuth, supabase, isAdmin, checkingAdmin]); // Añadido isAdmin y checkingAdmin a dependencias


  const handleLogout = async () => {
    console.log('Logging out user:', user?.id);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      // Mostrar mensaje de error si es necesario
    } else {
      console.log('User logged out successfully.');
      setIsMenuOpen(false);
      router.push('/login'); // Redirigir al login después de cerrar sesión
    }
  };

  // Opciones del menú, condicionales basadas en si el usuario está autenticado Y si es admin
  const menuOptions = user ? (
    <>
      <li>
        <Link href="/cuenta" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">
          Mi Cuenta
        </Link>
      </li>
      <li>
        <Link href="/cuenta/pedidos" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">
          Mis Pedidos
        </Link>
      </li>
      {/* Mostrar opción "Añadir Producto" SOLO si es administrador */}
      { !checkingAdmin && isAdmin && ( // Mostrar si ya terminó la verificación y es admin
          <li>
              <Link href="/admin/agregar-producto" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">
                  Añadir Producto
              </Link>
          </li>
      )}
      <li>
        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600">
          Cerrar Sesión
        </button>
      </li>
    </>
  ) : (
    // Opciones si no está autenticado (solo link a login, ya manejado por el Link directo)
     null // No renderizar opciones si no está autenticado, ya que hay un Link directo al Login
  );


  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div>
        <Link href="/" className="text-xl font-bold">
          Papelería Mores
        </Link>
      </div>

      <nav>
        <ul className="flex space-x-4">
          <li><Link href="/productos">Productos</Link></li>
          <li><Link href="/categorias">Categorías</Link></li>
          <li><Link href="/ofertas">Ofertas</Link></li>
        </ul>
      </nav>

      <div className="relative" ref={menuRef}>
        {isLoadingAuth || checkingAdmin ? (
             <div>...</div> // Indicador de carga mínimo en el header mientras carga auth o verifica admin
        ) : (
             user ? (
                 <div className="flex items-center cursor-pointer" onClick={toggleMenu}>
                    <Avatar>
                         {/* Puedes usar user.email.charAt(0) o user.user_metadata?.name?.charAt(0) */}
                        <AvatarFallback>{user.email?.charAt(0)?.toUpperCase() || \'?\'}</AvatarFallback>
                    </Avatar>
                    {/* Mostrar email o nombre si hay espacio */}
                 </div>
             ) : (
                // No autenticado: Botón directo a Login
                 <Link href="/login" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">
                    Iniciar Sesión
                 </Link>
             )
        )}

        {isMenuOpen && user && ( // Mostrar menú solo si está abierto Y hay un usuario autenticado
           <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-50">
             {menuOptions}
           </ul>
         )}
      </div>
    </header>
  );
};

export default Header;
