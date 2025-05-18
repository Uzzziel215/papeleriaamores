import Image from "next/image"
import Link from "next/link"

interface CategoryCardProps {
  name: string
  image: string
  count?: number // Made count optional
  href: string
}

export function CategoryCard({ name, image, count, href }: CategoryCardProps) {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
        <div className="relative aspect-square">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-contain p-4 transition-transform group-hover:scale-105"
          />
        </div>

        <div className="p-3 text-center">
          <h3 className="font-medium group-hover:text-[#0084cc] transition-colors">{name}</h3>
          {/* Conditionally display count only if it exists */}
          {count !== undefined && <p className="text-sm text-gray-500">{count} productos</p>}
        </div>
      </div>
    </Link>
  )
}
