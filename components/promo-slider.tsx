"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PromoSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    {
      image: "/promo-slider.png",
      alt: "Promoción 1",
      title: "Descuentos Especiales en Cuadernos",
      description: "Aprovecha nuestras ofertas en cuadernos de todas las marcas.",
      link: "/ofertas",
    },
    {
      image: "/promo-slider.png",
      alt: "Promoción 2",
      title: "Nuevos Bolígrafos Pastel",
      description: "Descubre los nuevos colores pastel para tus bolígrafos favoritos.",
      link: "/nuevos",
    },
    {
      image: "/promo-slider.png",
      alt: "Promoción 3",
      title: "Organiza tu Escritorio",
      description: "Encuentra los mejores organizadores para mantener tu espacio de trabajo ordenado.",
      link: "/productos?categoria=organizacion",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1))
  }

  useEffect(() => {
    const timer = setTimeout(nextSlide, 5000)
    return () => clearTimeout(timer)
  }, [currentSlide])

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.alt}
                width={1200}
                height={400}
                className="object-cover w-full h-64 md:h-80"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{slide.title}</h3>
                <p className="text-white text-lg mb-4">{slide.description}</p>
                <Button className="bg-[#ffaa00] hover:bg-[#e69900] text-white rounded-full px-6 py-3">
                  <a href={slide.link}>Ver Más</a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
        <Button variant="outline" size="icon" className="rounded-full" onClick={prevSlide}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
        <Button variant="outline" size="icon" className="rounded-full" onClick={nextSlide}>
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
