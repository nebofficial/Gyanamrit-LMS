"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WaitlistModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if modal was dismissed in this session
    const modalDismissed = sessionStorage.getItem("waitlistModalDismissed")
    if (!modalDismissed) {
      // Show modal after a brief delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    // Store dismissal in session storage
    sessionStorage.setItem("waitlistModalDismissed", "true")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary hover:bg-primary/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6 text-primary" />
        </button>

        <div className="grid gap-0 lg:grid-cols-2">
          {/* Left Section - Purple/Maroon Background */}
          <div className="flex flex-col justify-center bg-gradient-to-b from-[#2c1a3a] to-[#1a0e1f] px-6 py-8 sm:px-8 sm:py-12 lg:py-16">
            {/* Logo */}
              <div className="mb-8 flex items-center gap-2 lg:mb-12">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <span className="text-xl font-bold text-accent">ग</span>
              </div>
              <span className="text-sm font-semibold text-white">Gyanamrit</span>
            </div>

            {/* Main Heading */}
            <div className="mb-6 lg:mb-8">
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl mb-2">Gyanamrit Presents:</h2>
              <h3 className="text-3xl font-bold text-accent sm:text-4xl lg:text-5xl">The World's First Sanskrit LMS</h3>
            </div>

            {/* Subtitle */}
            <p className="text-lg font-semibold text-white sm:text-xl mb-4">Interactive. Gamified. Global.</p>

            {/* Description */}
            <p className="text-sm text-gray-200 sm:text-base leading-relaxed mb-8">
              Would you like to explore and learn more?
            </p>

            {/* Decorative elements */}
            <div className="mt-auto hidden gap-2 pt-8 lg:flex">
              <div className="h-1 w-12 rounded-full bg-accent/30"></div>
              <div className="h-1 w-8 rounded-full bg-accent/50"></div>
            </div>
          </div>

          {/* Right Section - Cream/White Background */}
          <div className="flex flex-col justify-center bg-gradient-to-b from-amber-50/50 to-white px-6 py-8 sm:px-8 sm:py-12 lg:py-16">
            {/* Heading */}
            <h4 className="mb-4 text-center text-xl font-bold text-primary sm:text-2xl lg:text-3xl text-balance">
              Experience the World's First Sanskrit LMS by Gyanamrit
            </h4>

            {/* Subtitle */}
            <p className="mb-8 text-center text-sm text-gray-700 sm:text-base leading-relaxed text-balance">
              A global platform that blends tradition with innovation for modern learners.
            </p>

            {/* CTA Button */}
            <Button
              onClick={handleClose}
              className="mb-8 bg-accent hover:bg-accent/90 text-primary font-bold py-3 px-6 rounded-lg shadow-md transition-all text-sm sm:text-base"
            >
              JOIN THE WAITLIST
            </Button>

            {/* Decorative Sanskrit text and icons */}
            <div className="space-y-3 pt-4">
              <div className="flex flex-wrap justify-center gap-3 text-2xl">
                <span className="text-gray-400">पु</span>
                <span className="text-gray-400">ह</span>
                <span className="text-accent">ई</span>
                <span className="text-gray-400">य</span>
              </div>
              <div className="flex justify-end gap-2 opacity-30">
                <div className="h-8 w-8 rounded-full bg-accent/30"></div>
                <div className="h-6 w-6 rounded-full bg-primary/30"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative top accent line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
      </div>
    </div>
  )
}
