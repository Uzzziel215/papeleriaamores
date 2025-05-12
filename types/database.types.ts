export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      productos: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          precio: number
          precio_descuento: number | null
          imagen_url: string | null
          categoria_id: string | null
          destacado: boolean
          stock: number
          created_at: string
        }
      }
      categorias: {
        Row: {
          id: string
          nombre: string
          slug: string
          imagen_url: string | null
        }
      }
      carritos: {
        Row: {
          id: string
          usuario_id: string | null
          session_id: string | null
          created_at: string
        }
      }
      elementos_carrito: {
        Row: {
          id: string
          carrito_id: string
          producto_id: string
          cantidad: number
          created_at: string
        }
      }
    }
  }
}

export type Producto = Database["public"]["Tables"]["productos"]["Row"]
export type Categoria = Database["public"]["Tables"]["categorias"]["Row"]
