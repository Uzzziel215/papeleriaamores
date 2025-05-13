"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from 'next/navigation'; // Import useSearchParams and useRouter
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

// Import supabase client
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Effect to read the access_token and refresh_token from the URL and set the session
  useEffect(() => {
    // This runs when the page is loaded via the redirect from the password reset email link
    const handleTokens = async () => {
      const access_token = searchParams.get('access_token');
      const refresh_token = searchParams.get('refresh_token');

      if (access_token && refresh_token) {
        // Set the session using the tokens from the URL
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          console.error("Error setting session from URL tokens:", error);
          setError("Error al procesar el enlace de recuperación. Por favor, solicita uno nuevo.");
          // Clear tokens from URL after attempting to set session, especially on error
           router.replace('/reset-password', undefined); // Use replace to avoid adding to history
        } else {
           console.log("Session set successfully from URL tokens.", data);
           // Optionally clear tokens from URL on success too, or let the form submit handle it.
           // Keeping them might be useful if the user refreshes the page, but could also be a security concern.
           // Let's clear them after a successful attempt to set the session.
           router.replace('/reset-password', undefined); // Clear URL parameters
        }
      } else {
        // If tokens are not in the URL, maybe the user landed here incorrectly or the link expired/is invalid
         // Only show error if we expected tokens (e.g., if window.location.search has query params)
         if (window.location.search) {
              setError("Enlace de recuperación inválido o expirado. Por favor, solicita uno nuevo.");
         }
      }
    };

    handleTokens();

     // Cleanup function - though not strictly needed for this effect due to router.replace
     // return () => { /* cleanup if needed */ };

  }, [searchParams, router]); // Depend on searchParams and router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic password validation
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (newPassword.length < 6) {
       setError("La nueva contraseña debe tener al menos 6 caracteres.");
       return;
     }

    setIsLoading(true);

    try {
      // Update the user's password using the session that was set from URL tokens
      const { data: updatedUser, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error("Error updating password:", updateError);
        setError(updateError.message || "Error al restablecer la contraseña.");
      } else {
        console.log("Password updated successfully:", updatedUser);
        setSuccess("Contraseña restablecida con éxito. Ahora puedes iniciar sesión con tu nueva contraseña.");
        // Optionally clear the form
        setNewPassword("");
        setConfirmPassword("");
        // Redirect to login after a short delay to allow user to read the success message
        setTimeout(() => {
             router.push('/login');
        }, 3000); // Redirect after 3 seconds
      }

    } catch (err: any) {
      console.error("Caught exception updating password:", err);
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Restablecer Contraseña</h1>

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

         {!success && !error && (
             <p className="text-sm text-gray-600 mb-4 text-center">
               Introduce tu nueva contraseña.
            </p>
         )}

        {/* Only show the form if not success and not explicitly errored (based on URL tokens) */}
        {!success && !(error && error.includes("enlace de recuperación")) && (
             <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="newPassword">Nueva Contraseña</Label>
                 <Input
                   id="newPassword"
                   type="password"
                   value={newPassword}
                   onChange={(e) => setNewPassword(e.target.value)}
                   placeholder="••••••••"
                   required
                   minLength={6}
                 />
               </div>

               <div className="space-y-2">
                 <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
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
                 {isLoading ? "Guardando..." : "Restablecer Contraseña"}
               </Button>
             </form>
        )}

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
