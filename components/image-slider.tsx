"use client"

import { useEffect, useRef, useState } from "react"

const IMAGES = [
  "https://img.jagranjosh.com/images/2023/August/3182023/sanskrit-diwas-2023.webp",
  "https://www.tnpscthervupettagam.com/assets/home/media/general/original_image/26-850.jpg",
  "https://www.oliveboard.in/blog/wp-content/uploads/2024/01/World-Sanskrit-Day-2024-19th-August-Theme-History.webp",
  
]

export function ImageSlider({ className }: { className?: string }) {
  const [index, setIndex] = useState(0)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    // autoplay every 4 seconds
    timeoutRef.current = window.setTimeout(() => setIndex((i) => (i + 1) % IMAGES.length), 4000)
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [index])

  const prev = () => setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length)
  const next = () => setIndex((i) => (i + 1) % IMAGES.length)

  return (
    <div className={`relative ${className ?? ""}`}>
      <div className="rounded-2xl overflow-hidden shadow-lg border border-border h-64 sm:h-80 md:h-96">
        <img
          src={IMAGES[index]}
          alt={`Slide ${index + 1}`}
          className="w-full h-full object-cover object-center block"
        />
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white px-2 py-1 rounded-full shadow"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white px-2 py-1 rounded-full shadow"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2 h-2 rounded-full ${i === index ? "bg-accent" : "bg-white/70"}`}
          />
        ))}
      </div>
    </div>
  )
}
