"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import { useState } from "react"

interface ProductCardProps {
  id: string
  name: string
  price: number
  discountPrice?: number | null
  imageUrl: string
}

export function ProductCard({ id, name, price, discountPrice, imageUrl }: ProductCardProps) {
  const { addItem } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      await addItem(id, 1)
    } catch (error) {
      console.error("Error al añadir al carrito:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group">
      <div className="relative aspect-square" style={{ position: 'relative' }}>
        <Link href={`/productos/${id}`}>
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            fill
            className="object-contain p-4 transition-transform group-hover:scale-105"
          />
        </Link>

        {discountPrice && (
          <div className="absolute top-3 left-3 bg-[#ff6b6b] text-white text-sm font-medium px-2 py-1 rounded">
            -{Math.round(((price - discountPrice) / price) * 100)}%
          </div>
        )}

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-white">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Link href={`/productos/${id}`}>
          <h3 className="font-medium mb-1 hover:text-[#0084cc] transition-colors">{name}</h3>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-[#0084cc]">${(discountPrice || price).toFixed(2)}</span>
            {discountPrice && <span className="ml-2 text-sm text-gray-400 line-through">${price.toFixed(2)}</span>}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-[#0084cc] text-[#0084cc] hover:bg-[#0084cc] hover:text-white"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
