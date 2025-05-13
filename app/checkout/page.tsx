"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/breadcrumb";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Import necessary hooks and supabase client
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export default function CheckoutPage() {
  // Get cart state and actions, including isLoading from useCart
  const { items, carritoId, clearCart, isLoading: isLoadingCart } = useCart();
  // Get auth state, including isLoading
  const { user, isLoading: isLoadingAuth } = useAuth();
  // Get toast function
  const { toast } = useToast();
  // Get router for navigation
  const router = useRouter();

  // State for local loading (during order placement) and terms acceptance
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Function to handle the simulated order placement
  const handlePlaceOrder = async () => {
    // Safety check: Return early if carritoId is not available yet
    if (!carritoId) {
      console.error("handlePlaceOrder called before carritoId was available.");
      toast({
        title: "Error del Carrito",
        description: "La información del carrito aún no está cargada. Inténtalo de nuevo.",
        variant: "destructive",
      });
      return; // Stop execution if carritoId is null or undefined
    }

    // Return early if auth state is still loading or user is not authenticated
    if (isLoadingAuth || !user) {
      if (!user && !isLoadingAuth) { // Only show toast if loading is finished and user is null
         toast({
           title: "Error de Autenticación",
           description: "Debes iniciar sesión para completar la compra.",
           variant: "destructive",
         });
      }
      return;
    }

    // Check if cart is empty
    if (items.length === 0) {
      toast({
        title: "Carrito Vacío",
        description: "No puedes realizar un pedido con un carrito vacío.",
        variant: "destructive",
      });
      return;
    }

    // Check if terms are accepted
    if (!termsAccepted) {
      toast({
        title: "Términos no aceptados",
        description: "Debes aceptar los términos y condiciones para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call the Supabase RPC function
      // Pass carritoId, and NULL for shipping_address_id_input and order_notes_input for now
      // const { data: newOrderId, error } = await supabase.rpc('place_simulated_order', {
      //   cart_id_input: carritoId,
      //   shipping_address_id_input: null, // Replace with selected address ID when implemented
      //   order_notes_input: null, // Replace with order notes when implemented
      // });

      // --- Reemplazar la llamada a supabase.rpc(...) con esta inserción ---
      const { data: insertData, error: insertError } = await supabase
        .from('ordenes_pendientes_trigger')
        .insert([
          {
            cart_id_input: carritoId, // Usamos el ID del carrito del contexto
            shipping_address_id_input: null, // Usamos la dirección seleccionada - Placeholder por ahora
            order_notes_input: null, // Usamos las notas del pedido - Placeholder por ahora
          },
        ]);
      // --- Fin del reemplazo --- 

      if (insertError) {
        console.error("Error inserting into ordenes_pendientes_trigger:", insertError);
        // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
        toast({
          title: "Error al iniciar el pedido",
          description: insertError.message || "No pudimos procesar tu solicitud. Inténtalo de nuevo.",
          variant: "destructive",
        });
        return; // Detener el proceso si la inserción falla
      } else {
         // Si la inserción fue exitosa, el trigger ya llamó o llamará a place_simulated_order.
         // La lógica para limpiar el carrito y mostrar éxito ahora debería estar dentro
         // de place_simulated_order (que ya tienes), o deberías manejar la confirmación
         // del pedido de otra manera (por ejemplo, verificando si se creó un pedido
         // asociado a este usuario en la tabla 'pedidos' poco después).
         // Para una confirmación inmediata simulada en el frontend, puedes asumir éxito
         // si la inserción en ordenes_pendientes_trigger fue exitosa.

        console.log("Pedido simulado iniciado via trigger. Inserted:", insertData);

        // Show success toast
        toast({
          title: "Pedido Iniciado",
          description: "Tu pedido ha sido recibido y está siendo procesado.",
          // variant: "success", // If you have a success style
        });

        // Redirect to the order success page
        router.push('/checkout/success');

        // Optional: Clear the local cart state immediately after successful initiation
        // The trigger function in the database should also clear the cart items,
        // but clearing locally provides immediate feedback.
        clearCart();
      }

    } catch (error: any) {
      console.error("Caught exception during order placement:", error);
       toast({
          title: "Error Inesperado",
          description: error.message || "Ocurrió un error al procesar tu pedido.",
          variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  };

  console.log("--- Estado de variables para botón deshabilitado ---");
  console.log("isLoading:", isLoading);
  console.log("items.length:", items.length);
  console.log("isLoadingAuth:", isLoadingAuth);
  console.log("user:", user);
  console.log("termsAccepted:", termsAccepted);
  console.log("carritoId:", carritoId);
  console.log("isLoadingCart (from useCart):", isLoadingCart);

  return (
    <div className="min-h-screen bg-[#f5f8ff]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Carrito", href: "/carrito" },
            { label: "Checkout", href: "/checkout", active: true },
          ]}
        />

        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="flex-1">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Dirección de Envío</h2>
                  {/* Placeholder 'Editar' button - replace with actual address management link/modal */}
                  <Button variant="link" className="text-[#0084cc] text-sm p-0">
                    Editar
                  </Button>
                </div>
              </div>

              <div className="p-6">
                 {/*
                   Placeholder for Address form fields.
                   In a real app, you would fetch/select user's saved addresses here
                   and potentially allow adding a new one. The selected address ID
                   would be passed to the place_simulated_order RPC.
                 */}
                <p className="text-gray-600">[Contenido del formulario/selección de dirección]</p>
                 {/* Static Address form fields - remove or replace with controlled components linked to state */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" placeholder="Tu nombre" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellidos</Label>
                    <Input id="lastName" placeholder="Tus apellidos" className="mt-1" />
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" placeholder="Calle y número" className="mt-1" />
                </div>

                <div className="mb-4">
                  <Label htmlFor="addressDetails">Detalles adicionales (opcional)</Label>
                  <Input id="addressDetails" placeholder="Apartamento, piso, etc." className="mt-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="postalCode">Código Postal</Label>
                    <Input id="postalCode" placeholder="28001" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input id="city" placeholder="Madrid" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="province">Provincia</Label>
                    <Input id="province" placeholder="Madrid" className="mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" placeholder="612 345 678" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="tu@email.com" className="mt-1" />
                  </div>
                </div>

                <div className="flex items-center">
                  <Checkbox id="saveAddress" />
                  <label htmlFor="saveAddress" className="ml-2 text-sm">
                    Guardar esta dirección para futuras compras
                  </label>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold">Método de Envío</h2>
              </div>

              <div className="p-6">
                {/* Placeholder for Shipping Method selection */}
                 <p className="text-gray-600">[Selección del método de envío]</p>
                <RadioGroup defaultValue="standard">
                  <div className="flex items-center justify-between border border-gray-200 rounded-md p-4 mb-3">
                    <div className="flex items-center">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="ml-2">
                        <div>
                          <span className="font-medium">Envío Estándar</span>
                          <p className="text-sm text-gray-500">Entrega en 3-5 días laborables</p>
                        </div>
                      </Label>
                    </div>
                    <span className="font-medium">€4.99</span>
                  </div>

                  <div className="flex items-center justify-between border border-gray-200 rounded-md p-4 mb-3">
                    <div className="flex items-center">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="ml-2">
                        <div>
                          <span className="font-medium">Envío Express</span>
                          <p className="text-sm text-gray-500">Entrega en 1-2 días laborables</p>
                        </div>
                      </Label>
                    </div>
                    <span className="font-medium">€9.99</span>
                  </div>

                  <div className="flex items-center justify-between border border-gray-200 rounded-md p-4">
                    <div className="flex items-center">
                      <RadioGroupItem value="store" id="store" />
                      <Label htmlFor="store" className="ml-2">
                        <div>
                          <span className="font-medium">Recogida en Tienda</span>
                          <p className="text-sm text-gray-500">Disponible en 24 horas</p>
                        </div>
                      </Label>
                    </div>
                    <span className="font-medium">Gratis</span>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold">Método de Pago</h2>
              </div>

              <div className="p-6">
                 {/* Placeholder for Payment Method selection */}
                <p className="text-gray-600">[Selección del método de pago (simulado)]</p>
                <RadioGroup defaultValue="card">
                  <div className="flex items-center justify-between border border-gray-200 rounded-md p-4 mb-3">
                    <div className="flex items-center">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="ml-2">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 mr-2" />
                          <span className="font-medium">Tarjeta de Crédito/Débito (Simulado)</span>
                        </div>
                      </Label>
                    </div>
                    {/* Placeholder card icons */}
                    <div className="flex space-x-2">
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>

                  {/* Placeholder for Card details form - remove or make conditional based on payment method */}
                  <div className="border border-gray-200 rounded-md p-4 mb-3 ml-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                        <Input id="cardName" placeholder="Nombre completo" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Fecha de Caducidad</Label>
                        <Input id="expiryDate" placeholder="MM/AA" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" className="mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* Other placeholder payment methods */}
                  <div className="flex items-center justify-between border border-gray-200 rounded-md p-4 mb-3">
                    <div className="flex items-center">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="ml-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
                          <span className="font-medium">PayPal (Simulado)</span>
                        </div>
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border border-gray-200 rounded-md p-4">
                    <div className="flex items-center">
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Label htmlFor="transfer" className="ml-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
                          <span className="font-medium">Transferencia Bancaria (Simulado)</span>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Back to Cart */}
            <div className="flex items-center justify-between">
              <Link href="/carrito" className="text-[#0084cc] hover:underline flex items-center">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Volver al Carrito
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold">Resumen del Pedido</h2>
              </div>

              <div className="p-6">
                {/* Order Items - Display actual cart items */}
                <div className="space-y-4 mb-6">
                  {items.length === 0 ? (
                    <p className="text-gray-600">El carrito está vacío.</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex items-start">
                        <div className="w-16 h-16 relative flex-shrink-0">
                           {/* Display product image if available */}
                          {item.producto?.imagenes_producto && item.producto.imagenes_producto.length > 0 && (
                             <Image
                               src={item.producto.imagenes_producto[0].url}
                               alt={item.producto.nombre || 'Product Image'}
                               fill
                               className="object-contain"
                             />
                           )}
                           {/* Fallback if no image */}
                           {(!item.producto?.imagenes_producto || item.producto.imagenes_producto.length === 0) && (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs text-center">No Image</div>
                           )}
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="text-sm font-medium">{item.producto?.nombre || 'Producto Desconocido'}</h4>
                          <div className="text-xs text-gray-500 mt-1">
                            {/* Display variant info if available */}
                            {item.variante ? (
                              <span>{item.variante.tipo}: {item.variante.valor}</span>
                            ) : (
                               <span>Sin Variante</span>
                            )}{' '}| <span>Qty: {item.cantidad}</span>
                          </div>
                          {/* Display item price (product price + variant price if applicable) */}
                          <div className="text-sm font-medium mt-1">
                            €{((item.producto?.precio || 0) + (item.variante?.precio_adicional || 0)) * item.cantidad.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Placeholder for pricing summary - replace with actual calculations */}
                <div className="space-y-3 mb-6">
                   <p className="text-gray-600">[Resumen de precios dinámico]</p>
                  <div className="flex justify-between">
                    {/* Update item count dynamically */}
                    <span className="text-gray-600">Subtotal ({items.reduce((sum, item) => sum + item.cantidad, 0)} items)</span>
                    {/* Placeholder total - replace with calculated value */}
                    <span>€{items.reduce((sum, item) => sum + ((item.producto?.precio || 0) + (item.variante?.precio_adicional || 0)) * item.cantidad, 0).toFixed(2)}</span>
                  </div>
                  {/* Placeholder for Discount and Shipping - replace with actual calculations */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Descuento</span>
                    <span className="text-green-600">-€0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span>€0.00</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                     {/* Placeholder total - replace with calculated value */} 
                    <span>€{items.reduce((sum, item) => sum + ((item.producto?.precio || 0) + (item.variante?.precio_adicional || 0)) * item.cantidad, 0).toFixed(2)}</span>
                  </div>
                  {/* Placeholder savings */}
                  {/* <div className="text-green-600 text-sm text-right">Ahorras €0.00</div> */}
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    {/* Connect terms checkbox to state */}
                    <Checkbox id="terms" checked={termsAccepted} onCheckedChange={setTermsAccepted} />
                    <label htmlFor="terms" className="ml-2 text-sm">
                      He leído y acepto los{" "}
                      <Link href="/terminos" className="text-[#0084cc] hover:underline">
                        términos y condiciones
                      </Link>
                    </label>
                  </div>

                  {/* Placeholder for newsletter checkbox */}
                  <div className="flex items-center">
                    <Checkbox id="newsletter" />
                    <label htmlFor="newsletter" className="ml-2 text-sm">
                      Suscribirme a la newsletter
                    </label>
                  </div>
                </div>

                {/* Connect button to handler and disabled state */}
                <Button
                  className="bg-[#0084cc] hover:bg-[#006ba7] text-white w-full py-6 rounded-full text-lg mb-4"
                  onClick={handlePlaceOrder}
                  disabled={isLoadingCart || isLoading || items.length === 0 || !termsAccepted}
                >
                  {isLoading ? 'Procesando...' : 'Confirmar Pedido'} 
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <p>
                    Tus datos personales serán utilizados para procesar tu pedido, mejorar tu experiencia en nuestra web
                    y otros propósitos descritos en nuestra política de privacidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}