"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PromoSliderProps {
  bannerImages?: string[]; // Hacemos la prop opcional con '?'
}

export function PromoSlider({ bannerImages }: PromoSliderProps) { // Aceptamos la prop
  const [currentSlide, setCurrentSlide] = useState(0);

  // Usamos las URLs de las imágenes pasadas como prop, o un array vacío si bannerImages es undefined o null
  const slides = (bannerImages || []).map(url => ({
    image: url,
    alt: "Banner Promocional",
  }));


  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1))
  }

  useEffect(() => {
    if (slides.length > 1) { // Solo iniciar el carrusel automático si hay más de una imagen
      const timer = setTimeout(nextSlide, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, slides.length]); // Añadir slides.length como dependencia

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* Renderizamos las imágenes de los banners */}
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0 relative h-64 md:h-80"> {/* Ajusta la altura según necesites */}
              <Image
                src={slide.image}
                alt={slide.alt}
                fill // Usamos fill para que la imagen cubra el contenedor
                style={{ objectFit: 'cover' }} // Asegura que la imagen cubra el área sin distorsionarse
              />
               <div className="absolute inset-0 flex items-center justify-center">
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mostramos botones de navegación solo si hay más de una imagen */}
      {slides.length > 1 && (
        <>
          <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10">
            <Button variant="outline" size="icon" className="rounded-full" onClick={prevSlide}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10">
            <Button variant="outline" size="icon" className="rounded-full" onClick={nextSlide}>
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
