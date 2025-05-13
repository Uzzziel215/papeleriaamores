import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  console.log("Middleware running for path:", req.nextUrl.pathname); // Log the path

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Log incoming cookies in middleware
  console.log("Incoming cookies in middleware:", req.headers.get('cookie'));

  // Refresh the session — this will also set the cookie
  // and is important for the server components to receive the authenticated session.
  // This should also process the session from the URL after an OAuth redirect.
  await supabase.auth.getSession();

  // Now, verify if the user is authenticated after ensuring the session is refreshed.
  const { data: { session }, error: sessionError } = await supabase.auth.getSession(); // Capture error as well

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ["/cuenta", "/cuenta/pedidos", "/cuenta/favoritos"]; // Exclude /checkout temporarily

  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  // If the user is trying to access a protected route and is NOT authenticated,
  // AND the current path is NOT the Supabase auth callback route, redirect to login.
  // We explicitly allow the auth callback to pass through so the client-side can handle it.
  // Also, add a check to ensure we are not already on the login page to prevent infinite redirects.
  const isOnAuthPage = req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/registro";
  const isAuthCallback = req.nextUrl.pathname.startsWith('/auth/callback');

  if (isProtectedRoute && !session && !isOnAuthPage && !isAuthCallback) {
    console.log("Middleware: Protected route, no session, redirecting to login."); // Log the redirect
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is authenticated and tries to access login/register, redirect to account
  if (isOnAuthPage && session) {
     console.log("Middleware: Authenticated user on auth page, redirecting to home."); // Log this redirect
    return NextResponse.redirect(new URL("/", req.url)); // Redirect to home page instead of account
  }

  console.log("Middleware: Allowing request to proceed."); // Log when request proceeds
  return res;
}

export const config = {
  matcher: [
    "/cuenta/:path*",
    "/checkout/:path*",
    "/login",
    "/registro",
    "/auth/callback", // Explicitly match the auth callback route
  ],
};
