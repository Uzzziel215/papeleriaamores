import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Este webhook puede ser usado para manejar eventos de Supabase Auth
// como nuevos registros, inicios de sesión, etc.
export async function POST(request: NextRequest) {
  const payload = await request.json()
  const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET

  // Verificar que el webhook es legítimo
  const signature = request.headers.get("x-supabase-webhook-signature")
  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  // Aquí deberías verificar la firma con crypto
  // Por simplicidad, omitimos ese paso en este ejemplo

  // Manejar diferentes tipos de eventos
  const eventType = payload.type

  switch (eventType) {
    case "auth.signup":
      // Crear perfil de usuario cuando se registra
      try {
        const { user } = payload

        await supabaseAdmin.from("perfiles_usuario").insert({
          id: user.id,
          cliente_desde: new Date().toISOString(),
        })

        return NextResponse.json({ success: true })
      } catch (error) {
        console.error("Error al crear perfil de usuario:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
      }

    default:
      return NextResponse.json({ message: "Evento no manejado" })
  }
}
