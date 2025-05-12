import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Papelería Amores</h3>
            <p className="text-gray-400">
              Tu tienda de papelería favorita con productos únicos y coloridos para expresar tu creatividad.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="text-gray-400 hover:text-white">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-gray-400 hover:text-white">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-gray-400 hover:text-white">
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre-nosotros" className="text-gray-400 hover:text-white">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidad" className="text-gray-400 hover:text-white">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Calle Principal 123, Madrid, España</li>
              <li>info@papeleriaamores.com</li>
              <li>+34 912 345 678</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>© 2023 Papelería Amores. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
