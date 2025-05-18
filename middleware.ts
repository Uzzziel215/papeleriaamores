// middleware.ts (Logs detallados)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database.types'; // Asegúrate de que esta ruta sea correcta

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  console.log(`[MIDDLEWARE START] Procesando ruta: ${path}`);

  // --- Nuevo Logging Añadido ---
  console.log(`[MIDDLEWARE] Request Headers para ${path}:`);
  req.headers.forEach((value, name) => {
    // Evitar loggear el header 'cookie' completo por seguridad si es muy largo, o loggearlo cuidadosamente.
    // Para depuración, loggeamos todos excepto el Authorization header si estuviera presente.
     if (name.toLowerCase() === 'cookie') {
        console.log(`[MIDDLEWARE]   Cookie: ${value}`);
     } else if (name.toLowerCase() !== 'authorization') {
        console.log(`[MIDDLEWARE]   ${name}: ${value}`);
     }
  });

  console.log(`[MIDDLEWARE] Request Cookies colección para ${path}:`);
  // Corregido: Usar for...of para iterar sobre req.cookies
  for (const [name, value] of req.cookies) {
    console.log(`[MIDDLEWARE]   Cookie - ${name}: ${value}`);
  }
  // --- Fin Nuevo Logging Añadido ---

  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  // Verificar si la cookie de autenticación está presente antes de getSession
  // !!! VERIFICA ESTE NOMBRE DE COOKIE - Cópialo de las herramientas de tu navegador !!!
  const authCookieName = 'sb-qoqchpazcfstknthdizp-auth-token'; // <--- ¡¡¡VERIFICA Y CORRIGE SI ES NECESARIO!!!
  const authCookieBefore = req.cookies.get(authCookieName);
  console.log(`[MIDDLEWARE] Cookie '${authCookieName}' en la solicitud ANTES de getSession: ${authCookieBefore ? 'Presente' : 'Faltante'}`);


  // Esto refresca la sesión y actualiza las cookies en la respuesta
  // Es CRUCIAL para que los Server Components reciban la sesión autenticada.
  console.log(`[MIDDLEWARE] Llamando a supabase.auth.getSession() para ${path}...`);
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log(`[MIDDLEWARE] Resultado de getSession() para ${path}: Sesión presente? ${!!session}, Usuario presente? ${!!session?.user}, Error? ${!!sessionError}`);
  if (sessionError) {
    console.error('[MIDDLEWARE] Error en getSession():', sessionError);
  }
  if (session?.user) {
      console.log(`[MIDDLEWARE] User ID from session for ${path}: ${session.user.id}`);
  }


  // Verificar si la cookie de autenticación está presente en la respuesta DESPUÉS de getSession
  const authCookieAfter = res.cookies.get(authCookieName); // <--- ¡¡¡USA EL MISMO NOMBRE DE COOKIE!!!
  console.log(`[MIDDLEWARE] Cookie '${authCookieName}' en la RESPUESTA DESPUÉS de getSession: ${authCookieAfter ? 'Presente' : 'Faltante'}`);


  console.log(`[MIDDLEWARE END] Ruta procesada: ${path}`);
  return res;
}

export const config = {
  matcher: [
    /*
     * Aplica el middleware a todas las rutas excepto archivos estáticos, optimización de imágenes,
     * favicon y archivos en la carpeta public.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
