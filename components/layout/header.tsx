import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingCart, Heart, User, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      {/* Top Bar - Subtle and informative */}
      {/* Further refined background and text color */}
      <div className="bg-gray-50 text-gray-600 py-2 text-sm">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="hidden md:block">Envío gratis en pedidos superiores a €30</div>
          <div className="flex items-center space-x-4">
            {/* Added explicit text color and hover effect */}
            <Link href="/contacto" className="text-gray-600 hover:text-[#0084cc] hover:underline">
              Contacto
            </Link>
            {/* Added explicit text color and hover effect */}
            <Link href="/ayuda" className="text-gray-600 hover:text-[#0084cc] hover:underline">
              Ayuda
            </Link>
            {/* Language Selector - Interactive element */}
            {/* Added explicit text color and hover effect */}
            <div className="flex items-center cursor-pointer text-gray-600 hover:text-[#0084cc]">
              <span>ES</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Recreated with enhanced UI/UX */}
      {/* Increased vertical padding significantly */}
      <div className="py-8 lg:py-10 border-b border-gray-200">
        {/* Increased gap for better separation of main elements */}
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 lg:gap-20"> {/* Increased gaps */}
          {/* Logo - More prominent and well-aligned */}
          {/* Further increased logo size */}
          <Link href="/" className="flex-shrink-0 mb-4 md:mb-0">
            <Image src="/logo.png" alt="Papelería Amores" width={250} height={90} className="object-contain" />
          </Link>

          {/* Search Bar - Central, expansive, and refined input style */}
          {/* Adjusted max-width, horizontal padding, and vertical padding for the input */}
          <div className="flex-1 w-full max-w-screen-sm md:w-auto md:px-4 lg:px-16"> {/* Increased horizontal padding on lg+ */}
            <div className="relative">
              {/* Refined input padding, border color, and focus ring */}
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full border border-gray-300 rounded-full py-4 px-6 pl-14 focus:outline-none focus:ring-2 focus:ring-[#0084cc] focus:border-transparent text-base pr-10 transition-colors placeholder:text-gray-500"
              />
              {/* Adjusted icon position and color */}
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>
          </div>

          {/* Action Icons - Clean, spaced, and interactive */}
          {/* Increased space between icons on larger screens */}
          <div className="flex items-center space-x-8 lg:space-x-10 flex-shrink-0 mt-4 md:mt-0">
            {/* Favorites - Clear icon and count */}
            {/* Refined icon size, text color, and hover effects */}
            <Link href="/cuenta/favoritos" className="flex flex-col items-center text-gray-700 hover:text-[#ff6b6b] transition-colors group">
              <div className="relative">
                <Heart className="h-6 w-6 group-hover:fill-[#ff6b6b] transition-colors" />
                {/* Placeholder count - Refined badge size, position, and ring color */}
                <span className="absolute -top-1 -right-1 bg-[#ff6b6b] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
                  3
                </span>
              </div>
              <span className="text-xs mt-1 hidden md:block">Favoritos</span>
            </Link>

            {/* Account Dropdown Menu - Integrated and accessible */}
            {/* Ensure trigger area is clearly interactive */}
            {/* Adjusted text color and hover effects for consistency */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* Using a div as the trigger for better control over padding/margins */}
                <div className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-[#0084cc] transition-colors px-2 py-1 -mx-2 rounded">
                   <User className="h-6 w-6" />
                   <span className="text-xs mt-1 hidden md:block">Cuenta</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                 {user ? (
                   <>
                     <DropdownMenuItem asChild>
                       <Link href="/cuenta" className="flex items-center text-gray-700 hover:text-[#0084cc]">Perfil</Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                       <Link href="/cuenta/pedidos" className="flex items-center text-gray-700 hover:text-[#0084cc]">Pedidos</Link>
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={() => signOut()} className="flex items-center cursor-pointer text-gray-700 hover:text-[#0084cc]">
                       Cerrar sesión
                     </DropdownMenuItem>
                   </>
                 ) : (
                   <>
                     <DropdownMenuItem asChild>
                       <Link href="/login" className="flex items-center text-gray-700 hover:text-[#0084cc]">Iniciar sesión</Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                       <Link href="/registro" className="flex items-center text-gray-700 hover:text-[#0084cc]">Registrarse</Link>
                     </DropdownMenuItem>
                   </>
                 )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart - Clear icon and count */}
            {/* Refined icon size, text color, and hover effects */}
            <Link href="/carrito" className="flex flex-col items-center text-gray-700 hover:text-[#0084cc] transition-colors group">
              <div className="relative">
                <ShoppingCart className="h-6 w-6 group-hover:fill-[#0084cc] transition-colors" />
                <span className="absolute -top-1 -right-1 bg-[#0084cc] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
                  2
                </span>
              </div>
              <span className="text-xs mt-1 hidden md:block">Carrito</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation - Hidden on mobile, centered and well-spaced on desktop */}
      {/* Adjusted top border color for consistency */}
      <nav className="border-t border-gray-200 hidden md:block">
        <div className="max-w-6xl mx-auto px-4">
          {/* Increased space-x for navigation links */}
          {/* Adjusted text color and hover effects for consistency */}
          <div className="flex items-center justify-center space-x-10 lg:space-x-12 py-3 text-sm">
            <Link href="/productos" className="font-medium text-gray-700 hover:text-[#0084cc] transition-colors">
              Todos los Productos
            </Link>
            <Link href="/productos?categoria=cuadernos" className="font-medium text-gray-700 hover:text-[#0084cc] transition-colors">
              Cuadernos
            </Link>
            <Link href="/productos?categoria=boligrafos" className="font-medium text-gray-700 hover:text-[#0084cc] transition-colors">
              Bolígrafos
            </Link>
            <Link href="/productos?categoria=arte" className="font-medium text-gray-700 hover:text-[#0084cc] transition-colors">
              Arte
            </Link>
            <Link href="/productos?categoria=organizacion" className="font-medium text-gray-700 hover:text-[#0084cc] transition-colors">
              Organización
            </Link>
            {/* Adjusted text color and hover for Offers link */}
            <Link href="/ofertas" className="font-medium text-[#ff6b6b] hover:text-[#ff5252] transition-colors">
              Ofertas
            </Link>
          </div>
        </div>
      </nav>

       {/* Mobile Menu Button */}
       {/* Adjusted top border color for consistency */}
       <div className="md:hidden border-t border-gray-200 flex justify-center py-3">
         <Button variant="ghost">
           <Menu className="h-6 w-6" />
         </Button>
       </div>

    </header>
  )
}
