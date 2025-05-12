import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    // Intercambiar el código por una sesión
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirigir a la página principal o a donde el usuario estaba antes
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
