'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f5f8ff] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">¡Gracias por tu compra!</h1>
        <p className="text-gray-600 mb-6">
          Tu pedido ha sido recibido y está siendo procesado.
        </p>
        {/* Optionally, you could display a link to the order details page if you have one */}
        {/* <p className="text-gray-600 mb-6">Tu número de pedido es: [Número de Pedido]</p> */}
        <Link href="/" passHref>
          <Button className="bg-[#0084cc] hover:bg-[#006ba7] text-white">
            Volver a la página principal
          </Button>
        </Link>
      </div>
    </div>
  );
}
