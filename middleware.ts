import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Verificar si el usuario está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ["/cuenta", "/cuenta/pedidos", "/cuenta/favoritos", "/checkout"]

  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Si la ruta está protegida y el usuario no está autenticado, redirigir al login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", req.url)
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Si el usuario ya está autenticado e intenta acceder a login/registro, redirigir a la cuenta
  if ((req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/registro") && session) {
    return NextResponse.redirect(new URL("/cuenta", req.url))
  }

  return res
}

export const config = {
  matcher: ["/cuenta/:path*", "/checkout/:path*", "/login", "/registro"],
}
