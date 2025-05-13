"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Import supabase client and Google icon
import { supabase } from "@/lib/supabase";
import { Chrome } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }
    // Basic password strength check (can be enhanced)
     if (password.length < 6) {
       setError("La contraseña debe tener al menos 6 caracteres.");
       setIsLoading(false);
       return;
     }

    try {
      // signUp function in useAuth calls supabase.auth.signUp
      await signUp(email, password)
      setSuccess("Registro exitoso. Por favor, verifica tu correo electrónico para confirmar tu cuenta.")
      // Limpiar formulario si el registro con email/password fue exitoso (requiere confirmación por email)
      // Si Supabase está configurado para requerir confirmación de email, el usuario NO iniciará sesión inmediatamente.
      // Si no requiere confirmación (configuración menos segura), podrías redirigir aquí.
      // Asumiendo confirmación requerida:
      setEmail("")
      setPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      console.error("Error during email/password sign up:", err);
      setError(err.message || "Error al registrarse")
    } finally {
      setIsLoading(false)
    }
  }

    // Handle Google Sign-Up (uses the same OAuth flow as sign-in)
  const handleGoogleSignUp = async () => {
    setError(null);
    setSuccess(null);
    // setIsLoading(true); // OAuth flow handles loading state externally

    // NOTE: Ensure your Supabase project's Auth -> URL Configuration -> Site URL and Redirect URLs are correct.
    // For local development, Site URL might be http://localhost:3000 and Redirect URL http://localhost:3000/auth/callback
    // For production, use your deployed site URL and the appropriate redirect path.
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
         // The redirect URL should be a page in your app that handles the callback,
        // typically something like /auth/callback which exchanges the auth code for a session.
        // Ensure you have this callback route set up in your Next.js app and configured in Supabase Redirect URLs.
        redirectTo: `${window.location.origin}/api/auth/callback`, // Example redirect URL
      },
    });

    if (error) {
      console.error("Error during Google Sign-Up/Sign-In:", error);
      setError(error.message);
      // setIsLoading(false); // In case the initial call fails before redirection
    }
     // If data is returned, the browser will be redirected by the OAuth flow,
    // so no need for explicit navigation here for success.
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Crear Cuenta</h1>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-800"> {/* Combined classes */}
             {/* Removed AlertCircle here as per common success alert style */}
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6"> {/* Added mb-6 for space below form */}
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

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full bg-[#0084cc]" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrarse con Email"} {/* Changed button text */}
          </Button>
        </form>

         {/* Separator */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">o continuar con</span>
          </div>
        </div>

        {/* Google Sign-Up Button */}
        <Button
          variant="outline" // Use outline variant for alternative sign-in
          className="w-full border-gray-300 hover:bg-gray-50"
          onClick={handleGoogleSignUp}
          disabled={isLoading} // Disable while email/password is loading
        >
          <Chrome className="h-5 w-5 mr-2" /> {/* Google icon */}
          Google
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
