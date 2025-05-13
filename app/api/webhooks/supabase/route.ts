import { type NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from 'crypto'; // Import crypto for signature verification

// Este webhook puede ser usado para manejar eventos de Supabase Auth
// como nuevos registros, inicios de sesión, etc.
export async function POST(request: NextRequest) {
  console.log("Webhook received!"); // Log the start of the function

  const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
  console.log("Webhook Secret:", webhookSecret ? "Loaded" : "Missing"); // Log if secret is loaded

  const signature = request.headers.get("x-supabase-webhook-signature");
  console.log("Signature Header:", signature); // Log the signature header

  if (!webhookSecret || !signature) {
    console.error("Webhook: Missing secret or signature"); // Log the error reason
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // ** IMPORTANT: Implement Signature Verification **
  // Without this, anyone could potentially call your webhook endpoint.
  try {
    const body = await request.text(); // Read body as text to verify signature

    const [version, signatureHash] = signature.split(',');
    if (version !== 'v1') {
         console.error("Webhook: Unknown signature version:", version);
         return NextResponse.json({ error: "Invalid signature version" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signatureHash !== expectedSignature) {
      console.error("Webhook: Signature mismatch!"); // Log the mismatch
      return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    }

    console.log("Webhook Signature Verified!"); // Log successful verification

    // Now parse the body as JSON after verification
    const payload = JSON.parse(body);
    console.log("Webhook Payload Type:", payload.type); // Log the event type
    console.log("Webhook Payload:", payload); // Log the entire payload (be cautious with sensitive data in logs)


    // Manejar diferentes tipos de eventos
    const eventType = payload.type;

    switch (eventType) {
      case "auth.user.created": // Supabase often uses 'auth.user.created' for new sign-ups
        console.log("Handling auth.user.created event");
        // Crear perfil de usuario cuando se registra
        try {
          const { user } = payload;
          if (!user) {
             console.error("Webhook: User object missing in payload for auth.user.created");
             return NextResponse.json({ error: "Invalid payload structure" }, { status: 400 });
          }
          console.log("Creating profile for user ID:", user.id);

          const { data, error: dbError } = await supabaseAdmin.from("perfiles_usuario").insert({
            id: user.id,
            cliente_desde: new Date().toISOString(),
            // Añade otros campos del perfil si los tienes
          });

          if (dbError) {
            console.error("Webhook DB Error:", dbError); // Log database errors
            // Importantly, do NOT return a 401 here if the DB insert fails. Supabase expects 200 for successful hook *reception*. If the DB fails, log it and potentially alert, but still return 200 to Supabase if the webhook itself was processed.
            // However, for initial debugging, throwing the error to see the 500 in logs is useful.
             throw dbError;
          }

          console.log("User profile created successfully for user ID:", user.id);
          return NextResponse.json({ success: true });

        } catch (error: any) {
          console.error("Error al crear perfil de usuario en webhook:", error); // Log the specific error
          // Returning 500 here is acceptable as it indicates an issue on your server processing the webhook.
          return NextResponse.json({ error: "Error interno del webhook" }, { status: 500 });
        }

      default:
        console.log("Received unhandled webhook event type:", eventType); // Log unhandled events
        // Return 200 for unhandled events to acknowledge receipt.
        return NextResponse.json({ message: "Evento no manejado" });
    }

  } catch (error: any) {
      console.error("Webhook: Error processing request (outside switch):", error); // Catch any errors during parsing, verification, or re-thrown DB errors
      // Returning 500 for unexpected errors during the initial processing phases.
      return NextResponse.json({ error: "Error procesando el webhook" }, { status: 500 });
  }
}