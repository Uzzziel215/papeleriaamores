// contexts/AuthContext.tsx
"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { useRouter } from 'next/navigation'; // Import useRouter

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Start in loading state
  const router = useRouter(); // Get the router instance

  useEffect(() => {
      console.log('AuthContext: Setting up onAuthStateChange listener.');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthContext: onAuthStateChange triggered', _event, session);

      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false); // Auth state is now known, set loading to false

      // Handle redirects based on auth state changes
      if (session) {
        console.log('AuthContext: User is authenticated.', { userId: session.user.id });
        // Optional: Redirect authenticated users away from login/signup pages
        // if (['/login', '/registro'].includes(window.location.pathname)) {
        //   router.replace('/'); // Example: Redirect to home
        // }
      } else {
        console.log('AuthContext: No authenticated user.');
        // Redirect to login if the user is not authenticated and not on an allowed page
        const allowedPages = ['/login', '/registro', '/recuperar-contrasena', '/reset-password'];
        if (!allowedPages.includes(window.location.pathname)) {
           console.log('AuthContext: Redirecting unauthenticated user to login.');
           router.replace('/login');
        }
      }

    });

     // onAuthStateChange fires immediately on mount with the current session state
     // so the initial loading state will be updated shortly after the listener is set up.
     // No need for a separate checkInitialSession function.


    return () => {
      console.log('AuthContext: Unsubscribing from auth state changes.');
      subscription.unsubscribe();
    }
  }, [router]) // Add router to dependencies

  const signIn = async (email: string, password: string) => {
      console.log('AuthContext: Attempting signIn with email:', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
           console.error('AuthContext: signIn error:', error);
           throw error;
      }
       console.log('AuthContext: signIn successful. Data:', data); // Added log
  }

  const signUp = async (email: string, password: string) => {
       console.log('AuthContext: Attempting signUp with email:', email);
    const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
           console.error('AuthContext: signUp error:', error);
           throw error;
      }
       console.log('AuthContext: signUp successful. Data:', data); // Added log
  }

  const signOut = async () => {
       console.log('AuthContext: Attempting signOut.');
    const { error } = await supabase.auth.signOut();
      if (error) {
          console.error('AuthContext: signOut error:', error);
           throw error;
      }
       console.log('AuthContext: signOut successful.');
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
