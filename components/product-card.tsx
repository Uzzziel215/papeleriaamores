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
  discount?: number
}

export function ProductCard({ id, name, price, image, rating, discount }: ProductCardProps) {
  const discountedPrice = discount ? price * (1 - discount / 100) : price
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

        {discount && (
          <div className="absolute top-3 left-3 bg-[#ff6b6b] text-white text-sm font-medium px-2 py-1 rounded">
            -{discount}%
          </div>
        )}

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-white">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="ml-1 text-xs text-gray-500">{rating}</span>
        </div>

        <Link href={`/productos/${id}`}>
          <h3 className="font-medium mb-1 hover:text-[#0084cc] transition-colors">{name}</h3>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-[#0084cc]">€{discountedPrice.toFixed(2)}</span>
            {discount && <span className="ml-2 text-sm text-gray-400 line-through">€{price.toFixed(2)}</span>}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-[#0084cc] text-[#0084cc] hover:bg-[#0084cc] hover:text-white"
            onClick={handleAddToCart} // Add onClick handler
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
