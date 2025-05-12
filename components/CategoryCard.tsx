import Image from "next/image"
import Link from "next/link"

interface CategoryCardProps {
  id: string
  name: string
  imageUrl: string
}

export function CategoryCard({ id, name, imageUrl }: CategoryCardProps) {
  return (
    <Link href={`/categorias/${id}`}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
        <div className="relative aspect-square">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            fill
            className="object-contain p-4 transition-transform group-hover:scale-105"
          />
        </div>

        <div className="p-3 text-center">
          <h3 className="font-medium group-hover:text-[#0084cc] transition-colors">{name}</h3>
        </div>
      </div>
    </Link>
  )
}
