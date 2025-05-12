"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./AuthContext"
import type { Producto } from "@/types/database.types"

type CartItem = {
  id: string
  producto_id: string
  cantidad: number
  producto?: Producto
}

type CartContextType = {
  items: CartItem[]
  addItem: (producto_id: string, cantidad: number) => Promise<void>
  updateItem: (id: string, cantidad: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearCart: () => Promise<void>
  isLoading: boolean
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string>("")
  const [carritoId, setCarritoId] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const initCart = async () => {
      try {
        setIsLoading(true)

        // Obtener o crear ID de sesión para usuarios no autenticados
        let currentSessionId = sessionStorage.getItem("cart_session_id")
        if (!currentSessionId) {
          currentSessionId = uuidv4()
          sessionStorage.setItem("cart_session_id", currentSessionId)
        }
        setSessionId(currentSessionId)

        // Buscar carrito existente - SOLUCIÓN CORREGIDA
        let query = supabase.from("carritos").select("id")
        if (user?.id) {
          query = query.eq("usuario_id", user.id)
        } else {
          query = query.eq("session_id", currentSessionId)
        }
        const { data: carritoData, error: carritoError } = await query.maybeSingle()

        if (carritoError) {
          console.error("Error al buscar carrito:", carritoError)
          setIsLoading(false)
          return
        }

        // Si no existe carrito, crear uno nuevo
        if (!carritoData) {
          const { data: newCarrito, error: createError } = await supabase
            .from("carritos")
            .insert({
              usuario_id: user?.id || null,
              session_id: user?.id ? null : currentSessionId,
            })
            .select("id")
            .single()

          if (createError) {
            console.error("Error al crear carrito:", createError)
            setIsLoading(false)
            return
          }

          setCarritoId(newCarrito.id)
          await loadCartItems(newCarrito.id)
        } else {
          setCarritoId(carritoData.id)
          await loadCartItems(carritoData.id)
        }
      } catch (error) {
        console.error("Error en initCart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initCart()
  }, [user])

  const loadCartItems = async (id: string | null) => {
    if (!id) return

    try {
      const { data, error } = await supabase
        .from("elementos_carrito")
        .select(`
          id,
          producto_id,
          cantidad,
          productos:producto_id (*)
        `)
        .eq("carrito_id", id)

      if (error) {
        console.error("Error al cargar elementos del carrito:", error)
        return
      }

      // Transformar datos para el estado
      const cartItems: CartItem[] = data.map((item) => ({
        id: item.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        producto: item.productos as Producto,
      }))

      setItems(cartItems)
    } catch (error) {
      console.error("Error al cargar elementos del carrito:", error)
    }
  }

  const addItem = async (producto_id: string, cantidad: number) => {
    if (!carritoId) return

    try {
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = items.findIndex((item) => item.producto_id === producto_id)

      if (existingItemIndex >= 0) {
        // Actualizar cantidad si ya existe
        await updateItem(items[existingItemIndex].id, items[existingItemIndex].cantidad + cantidad)
        return
      }

      // Añadir nuevo item
      const { data, error } = await supabase
        .from("elementos_carrito")
        .insert({
          carrito_id: carritoId,
          producto_id,
          cantidad,
        })
        .select()
        .single()

      if (error) {
        console.error("Error al añadir item al carrito:", error)
        return
      }

      // Recargar elementos del carrito
      await loadCartItems(carritoId)
    } catch (error) {
      console.error("Error al añadir item al carrito:", error)
    }
  }

  const updateItem = async (id: string, cantidad: number) => {
    if (!carritoId) return

    try {
      if (cantidad <= 0) {
        await removeItem(id)
        return
      }

      const { error } = await supabase
        .from("elementos_carrito")
        .update({ cantidad })
        .eq("id", id)
        .eq("carrito_id", carritoId)

      if (error) {
        console.error("Error al actualizar item del carrito:", error)
        return
      }

      // Actualizar estado local
      setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, cantidad } : item)))
    } catch (error) {
      console.error("Error al actualizar item del carrito:", error)
    }
  }

  const removeItem = async (id: string) => {
    if (!carritoId) return

    try {
      const { error } = await supabase.from("elementos_carrito").delete().eq("id", id).eq("carrito_id", carritoId)

      if (error) {
        console.error("Error al eliminar item del carrito:", error)
        return
      }

      // Actualizar estado local
      setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error al eliminar item del carrito:", error)
    }
  }

  const clearCart = async () => {
    if (!carritoId) return

    try {
      const { error } = await supabase.from("elementos_carrito").delete().eq("carrito_id", carritoId)

      if (error) {
        console.error("Error al vaciar el carrito:", error)
        return
      }

      setItems([])
    } catch (error) {
      console.error("Error al vaciar el carrito:", error)
    }
  }

  // Calcular total de items
  const totalItems = items.reduce((total, item) => total + item.cantidad, 0)

  const value = {
    items,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    isLoading,
    totalItems,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
