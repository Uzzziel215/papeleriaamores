import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  rating: number
  precio_descuento?: number | null
  porcentaje_descuento?: number | null
  stock: number
  isFavorited?: boolean
  onToggleFavorite?: (id: string) => void
}

export function ProductCard({ id, name, price, image, rating, precio_descuento, porcentaje_descuento, stock, isFavorited, onToggleFavorite }: ProductCardProps) {
  const displayedPrice = precio_descuento !== null && precio_descuento !== undefined ? precio_descuento : price;
  const { addItem } = useCart() // Use the useCart hook

  const handleAddToCart = () => {
    addItem(id, null, 1) // Call addItem with product id, null variant id, and quantity 1
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group">
      <div className="relative aspect-square">
        <Link href={`/productos/${id}`}>
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-contain p-4 transition-transform group-hover:scale-105"
          />
        </Link>

        {precio_descuento !== null && precio_descuento !== undefined && porcentaje_descuento !== null && porcentaje_descuento !== undefined && porcentaje_descuento > 0 && (
          <div className="absolute top-3 left-3 bg-[#ff6b6b] text-white text-sm font-medium px-2 py-1 rounded">
            -{porcentaje_descuento}%
          </div>
        )}

        <div className="absolute top-3 right-3 opacity-100 transition-opacity">
          <Button
            variant={isFavorited ? "default" : "outline"}
            size="icon"
            className={`h-8 w-8 rounded-full bg-white ${isFavorited ? "text-[#ff6b6b]" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite && onToggleFavorite(id);
            }}
            aria-label={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">
          <Link href={`/productos/${id}`}>{name}</Link>
        </h3>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`} />
          ))}
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xl font-bold text-[#0084cc]">€{displayedPrice}</span>
          {precio_descuento !== null && precio_descuento !== undefined && (
            <span className="text-sm line-through text-gray-400">€{price}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Button size="sm" className="bg-[#0084cc] hover:bg-[#007acc]" onClick={handleAddToCart} disabled={stock === 0}>
            <ShoppingCart className="h-4 w-4 mr-1" />
            Añadir
          </Button>
          <span className={`text-xs font-medium ${stock > 0 ? "text-green-600" : "text-red-600"}`}>{stock > 0 ? "En stock" : "Sin stock"}</span>
        </div>
      </div>
    </div>
  )
}
