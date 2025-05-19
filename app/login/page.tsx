"use client"

import type React from "react"

import { useState, useEffect } from "react"; // Import useEffect
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Image from "next/image"

// Import supabase client and Google icon
import { supabase } from "@/lib/supabase";
import { Chrome } from 'lucide-react'; // Using Chrome icon as a generic Google icon

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, user, isLoading: isLoadingAuth } = useAuth() // Get user and isLoadingAuth
  const router = useRouter()

  // Client-side redirect after successful authentication
  useEffect(() => {
    console.log("Login Page useEffect: user", user, "isLoadingAuth", isLoadingAuth);
    if (!isLoadingAuth && user) { // Check if auth state has settled and user is authenticated
      console.log("Login Page useEffect: User authenticated, redirecting to home.");
      router.push("/"); // Redirect to home page
    }
  }, [user, isLoadingAuth, router]); // Depend on user, isLoadingAuth, and router


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await signIn(email, password)
      // Redirection will now be handled by the useEffect hook
      // router.push("/cuenta")
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setError(null);
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
      console.error("Error during Google Sign-In:", error);
      setError(error.message);
      // setIsLoading(false); // In case the initial call fails before redirection
    }
    // If data is returned, the browser will be redirected by the OAuth flow,
    // so no need for explicit router.push here for success.
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link href="/recuperar-contrasena" className="text-sm text-blue-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-[#0084cc]" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
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

        {/* Google Sign-In Button */}
        <Button
          variant="outline" // Use outline variant for alternative sign-in
          className="w-full border-gray-300 hover:bg-gray-50"
          onClick={handleGoogleSignIn}
          disabled={isLoading} // Disable while email/password is loading
        >
          <Image
            src="/icons/3.png"
            alt="Google Logo"
            width={20} // Adjust size as needed
            height={20} // Adjust size as needed
            className="mr-2"
          />
          Google
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link href="/registro" className="text-blue-600 hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
