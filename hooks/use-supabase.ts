"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database.types"

// Hook genérico para obtener datos de Supabase
export function useSupabaseQuery<T>(
  tableName: keyof Database["public"]["Tables"],
  options?: {
    columns?: string
    filter?: { column: string; value: any; operator?: string }
    orderBy?: { column: string; ascending?: boolean }
    limit?: number
    single?: boolean
  },
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        let query = supabase.from(tableName as string).select(options?.columns || "*")

        if (options?.filter) {
          const { column, value, operator = "eq" } = options.filter
          query = query.filter(column, operator, value)
        }

        if (options?.orderBy) {
          const { column, ascending = true } = options.orderBy
          query = query.order(column, { ascending })
        }

        if (options?.limit) {
          query = query.limit(options.limit)
        }

        const { data: result, error: queryError } = options?.single ? await query.single() : await query

        if (queryError) throw queryError

        setData(result as T)
        setError(null)
      } catch (err: any) {
        setError(err)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [tableName, options?.columns, options?.filter, options?.orderBy, options?.limit, options?.single])

  return { data, error, loading }
}

// Hooks específicos para entidades comunes

// Obtener categorías
export function useCategorias() {
  return useSupabaseQuery<Database["public"]["Tables"]["categorias"]["Row"][]>("categorias", {
    orderBy: { column: "orden" },
  })
}

// Obtener productos
export function useProductos(options?: {
  categoria_id?: string
  destacado?: boolean
  nuevo?: boolean
  limit?: number
}) {
  const [filter, setFilter] = useState<any>(null)

  useEffect(() => {
    if (options?.categoria_id) {
      setFilter({ column: "categoria_id", value: options.categoria_id })
    } else if (options?.destacado) {
      setFilter({ column: "destacado", value: true })
    } else if (options?.nuevo) {
      setFilter({ column: "nuevo", value: true })
    } else {
      setFilter(null)
    }
  }, [options?.categoria_id, options?.destacado, options?.nuevo])

  return useSupabaseQuery<Database["public"]["Tables"]["productos"]["Row"][]>("productos", {
    columns: "*, imagenes_producto(*), categorias(nombre)",
    filter,
    limit: options?.limit,
    orderBy: { column: "created_at", ascending: false },
  })
}

// Obtener un producto por ID
export function useProducto(id: string) {
  return useSupabaseQuery<Database["public"]["Tables"]["productos"]["Row"]>("productos", {
    columns: "*, imagenes_producto(*), categorias(nombre), variantes_producto(*)",
    filter: { column: "id", value: id },
    single: true,
  })
}
