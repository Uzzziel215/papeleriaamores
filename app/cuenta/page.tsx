import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Breadcrumb } from "@/components/breadcrumb"
import { User, Package, Heart, CreditCard, LogOut, Edit, MapPin, Phone, X } from "lucide-react"

export default function CuentaPage() {
  return (
    <div className="min-h-screen bg-[#f5f8ff]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: "Inicio", href: "/" },
            { label: "Mi Cuenta", href: "/cuenta", active: true }
          ]} 
        />
        
        <h1 className="text-3xl font-bold mb-8">Mi Cuenta</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="relative w-16 h-16">
                    <Image 
                      src="/avatar-profile.png" 
                      alt="Avatar" 
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h2 className="font-semibold">Laura Martínez</h2>
                    <p className="text-sm text-gray-500">Cliente desde 2022</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <nav className="space-y-1">
                  <Link href="/cuenta" className="flex items-center px-3 py-2 text-[#0084cc] bg-blue-50 rounded-md">
                    <User className="h-5 w-5 mr-3" />
                    <span>Mi Perfil</span>
                  </Link>
                  <Link href="/cuenta/pedidos" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <Package className="h-5 w-5 mr-3" />
                    <span>Mis Pedidos</span>
                  </Link>
                  <Link href="/cuenta/favoritos" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <Heart className="h-5 w-5 mr-3" />
                    <span>Favoritos</span>
                  </Link>
                  <Link href="/cuenta/pagos" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <CreditCard className="h-5 w-5 mr-3" />
                    <span>Métodos de Pago</span>
                  </Link>
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <button className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md w-full text-left">
                      <LogOut className="h-5 w-5 mr-3" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </nav>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold">¿Necesitas Ayuda?</h3>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.
                </p>
                <Button className="bg-[#0084cc] hover:bg-[#006ba7] text-white w-full">
                  Contactar Soporte
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="profile">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="addresses">Direcciones</TabsTrigger>
                <TabsTrigger value="orders">Pedidos Recientes</TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Información Personal</h2>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input id="firstName" value="Laura" className="mt-1" readOnly />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Apellidos</Label>
                        <Input id="lastName" value="Martínez" className="mt-1" readOnly />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value="laura.martinez@email.com" className="mt-1" readOnly />
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input id="phone" value="612 345 678" className="mt-1" readOnly />
                      </div>
                      <div>
                        <Label htmlFor="birthdate">Fecha de Nacimiento</Label>
                        <Input id="birthdate" value="15/04/1990" className="mt-1" readOnly />
                      </div>
                      <div>
                        <Label htmlFor="gender">Género</Label>
                        <Input id="gender" value="Femenino" className="mt-1" readOnly />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Cambiar Contraseña</h2>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Contraseña Actual</Label>
                        <Input id="currentPassword" type="password" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">Nueva Contraseña</Label>
                        <Input id="newPassword" type="password" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                        <Input id="confirmPassword" type="password" className="mt-1" />
                      </div>
                      
                      <Button className="bg-[#0084cc] hover:bg-[#006ba7] text-white">
                        Actualizar Contraseña
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Addresses Tab */}
              <TabsContent value="addresses">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Mis Direcciones</h2>
                      <Button className="bg-[#0084cc] hover:bg-[#006ba7] text-white">
                        Añadir Nueva Dirección
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Address 1 */}
                      <div className="border border-gray-200 rounded-lg p-4 relative">
                        <div className="absolute top-3 right-3 flex space-x-2">
                          <button className="text-gray-500 hover:text-[#0084cc]">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-gray-500 hover:text-red-500">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-start mb-3">
                          <MapPin className="h-5 w-5 text-[#0084cc] mr-2 mt-0.5" />
                          <div>
                            <h3 className="font-medium">Casa</h3>
                            <div className="text-sm text-gray-500">Dirección predeterminada</div>
                          </div>
                        </div>
                        
                        <div className="pl-7">
                          <p className="text-sm mb-1">Laura Martínez</p>
                          <p className="text-sm mb-1">Calle Principal 123, 5º B</p>
                          <p className="text-sm mb-1">28001, Madrid</p>
                          <p className="text-sm mb-3">España</p>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 mr-1" />
                            <span>612 345 678</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Address 2 */}
                      <div className="border border-gray-200 rounded-lg p-4 relative">
                        <div className="absolute top-3 right-3 flex space-x-2">
                          <button className="text-gray-500 hover:text-[#0084cc]">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-gray-500 hover:text-red-500">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-start mb-3">
                          <MapPin className="h-5 w-5 text-[#0084cc] mr-2 mt-0.5" />
                          <div>
                            <h3 className="font-medium">Trabajo</h3>
                          </div>
                        </div>
                        
                        <div className="pl-7">
                          <p className="text-sm mb-1">Laura Martínez</p>
                          <p className="text-sm mb-1">Avenida Empresarial 45, Oficina 302</p>
                          <p className="text-sm mb-1">28003, Madrid</p>
                          <p className="text-sm mb-3">España</p>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 mr-1" />
                            <span>912 345 678</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Orders Tab */}
              <TabsContent value="orders">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Pedidos Recientes</h2>
                      <Link href="/cuenta/pedidos" className="text-[#0084cc] hover:underline flex items-center">
                        Ver Todos
                      &lt;/Link&gt;

\
