"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CarouselProps {
  children: ReactNode[]
}

export function Carousel({ children }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  const totalItems = children.length

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  useEffect(() => {
    if (containerRef.current && itemsRef.current) {
      const containerWidth = containerRef.current.offsetWidth
      const itemWidth = containerWidth
      setTranslateX(-currentIndex * itemWidth)
    }
  }, [currentIndex])

  // Added logic to handle 0 or 1 children - prevent rendering buttons/dots
  if (totalItems <= 1) {
    return (
      <div className="relative overflow-hidden">
        <div className="flex" ref={containerRef}>
           {/* Render children directly if 0 or 1 */}
           {children.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={containerRef}>
        <div
          ref={itemsRef}
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Modified button styles for better visibility */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-white border-[#0084cc] text-[#0084cc] shadow-md hover:bg-[#0084cc] hover:text-white transition-colors"
        onClick={handlePrev}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      {/* Modified button styles for better visibility */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-white border-[#0084cc] text-[#0084cc] shadow-md hover:bg-[#0084cc] hover:text-white transition-colors"
        onClick={handleNext}
        disabled={currentIndex === totalItems - 1}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicator dots - also modified styles */}
      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(totalItems)].map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "w-6 bg-[#0084cc]" : "w-2 bg-gray-300 hover:bg-[#0084cc]"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
