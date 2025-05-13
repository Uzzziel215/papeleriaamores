"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

// Import supabase client
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      // Call Supabase function to send password reset email
      // The redirectTo URL is where the user will land after clicking the link in the email.
      // This page (/reset-password) needs to exist in your app and be configured
      // in Supabase Auth -> URL Configuration -> Redirect URLs.
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
         redirectTo: `${window.location.origin}/reset-password`, // URL for the password reset page in your app
      });

      if (error) {
        console.error("Error sending password reset email:", error);
        setError(error.message || "Ocurrió un error al enviar el correo.");
      } else {
        setSuccess("Si la dirección de correo electrónico está en nuestra base de datos, recibirás un enlace para restablecer tu contraseña.");
        // Optionally clear the email input after success
        // setEmail("");
      }

    } catch (err: any) {
      console.error("Caught exception sending password reset email:", err);
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Recuperar Contraseña</h1>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
           <Alert className="mb-4 bg-green-50 border-green-200 text-green-800"> {/* Consistent success alert style */}
            <CheckCircle className="h-4 w-4" /> {/* Use CheckCircle for success */}
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-gray-600 mb-4 text-center">
           Introduce tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-[#0084cc]" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar Enlace de Recuperación"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <Link href="/login" className="text-blue-600 hover:underline">
              Volver a Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
