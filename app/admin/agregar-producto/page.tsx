// app/admin/agregar-producto/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
// Remove the local creation of createClientComponentClient
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import AddProductForm from '@/components/admin/agregar-producto-form';
import React from 'react';
import { supabase } from '@/lib/supabase'; // Import the shared Supabase client

// import { Database } from '@/types/database.types'; // Importa tus tipos si los usas

// Remove the local creation of the client
// const supabase = createClientComponentClient(); // Puedes pasar los tipos: createClientComponentClient<Database>()


const AgregarProductoPage = () => {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true); // Estado para saber si estamos verificando admin

  useEffect(() => {
    console.log('Admin Page useEffect (Auth Check): isLoadingAuth', isLoadingAuth, 'user', user ? user.id : null);
    if (!isLoadingAuth && !user) {
      console.log('Admin Page useEffect (Auth Check): Not authenticated, redirecting to login.');
      router.push('/login');
    }
  }, [user, isLoadingAuth, router]); // Depende del estado del usuario y la carga de auth

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        console.log('Admin Page useEffect (Admin Check): Checking admin status for user ID:', user.id);
        setCheckingAdmin(true); // Iniciar verificación

        // Usamos maybeSingle() aquí porque esperamos 0 o 1 resultado.
        // Retorna { data: null, error: null } si no encuentra filas,
        // lo que es un manejo más limpio que el error PGRST116 de .single().
        const { data, error } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', user.id)
          .maybeSingle(); // <-- Usamos maybeSingle

        console.log('Admin Page useEffect (Admin Check): Supabase query returned:');
        console.log('  Data:', data);
        console.log('  Error:', error);

        if (error) {
             console.error('Admin Page useEffect (Admin Check): Supabase query returned an error.', error);
             console.error('  Error Code:', error.code);
             console.error('  Error Message:', error.message);
             console.error('  Error Details:', error.details);
             console.error('  Error Hint:', error.hint);
             setIsAdmin(false);
        } else if (data) {
            console.log('Admin Page useEffect (Admin Check): User found in admin_users (data received).');
            setIsAdmin(true);
        } else {
             // data es null Y error es null - esto es lo que maybeSingle retorna si no encuentra filas
             console.log('Admin Page useEffect (Admin Check): User not found in admin_users (data is null, error is null).');
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
    // Eliminamos checkingAdmin de las dependencias para evitar bucles.
    // Añadimos una condición para no re-verificar si ya es admin.
    if (!isLoadingAuth && user && !isAdmin && checkingAdmin) { // Añadido !isAdmin y checkingAdmin
        checkAdminStatus();
    } else if (!isLoadingAuth && !user && checkingAdmin) {
        // Si la auth terminó, no hay usuario, y checkingAdmin sigue true, desactívalo.
        setCheckingAdmin(false);
    } else if (isAdmin && checkingAdmin) {
        // Si ya detectamos que es admin y checkingAdmin sigue true (no debería pasar), desactívalo.
         setCheckingAdmin(false);
    }


  }, [user, isLoadingAuth, isAdmin, checkingAdmin]); // Supabase dependency removed


   useEffect(() => {
       console.log('Admin Page useEffect (Redirect Check): isLoadingAuth', isLoadingAuth, 'checkingAdmin', checkingAdmin, 'isAdmin', isAdmin, 'user', user ? user.id : null);
       // Solo redirigir si NO está cargando la auth, NO está verificando admin, HAY usuario, y NO es admin
       if (!isLoadingAuth && !checkingAdmin && user && !isAdmin) {
           console.log('Admin Page useEffect (Redirect Check): User authenticated but not admin. Redirecting to home.');
           router.push('/');
       }
       // Si !user y !isLoadingAuth, el primer useEffect maneja la redirección al login.
   }, [isLoadingAuth, checkingAdmin, isAdmin, user, router]);


  if (isLoadingAuth || checkingAdmin) {
    console.log('Admin Page Render: Showing Loading...');
    return <div>Cargando...</div>;
  }

   if (!isAdmin) {
       console.log('Admin Page Render: Not admin after checks. Will be redirected by effect.');
       return null; // El useEffect de redirección manejará esto
   }

  // Si llegamos aquí, auth no está cargando, verificación de admin no está cargando, hay usuario, y el usuario es admin
  console.log('Admin Page Render: User is admin. Showing content.');
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Agregar Nuevo Producto</h1>
      <AddProductForm />
    </div>
  );
};

export default AgregarProductoPage;
