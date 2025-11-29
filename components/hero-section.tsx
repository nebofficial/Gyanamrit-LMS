import { Button } from "@/components/ui/button"
import { ImageSlider } from "@/components/image-slider"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50 to-white pt-12 sm:pt-16 md:pt-20 lg:pt-32 pb-8 sm:pb-12 md:pb-20">
      <div className="absolute top-10 sm:top-20 right-2 sm:right-10 opacity-5 sm:opacity-10 text-6xl sm:text-8xl">
        ☸
      </div>
      <div className="absolute bottom-10 sm:bottom-20 left-2 sm:left-10 opacity-5 sm:opacity-10 text-6xl sm:text-8xl">
        ☮
      </div>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="mb-3 sm:mb-4">
              <span className="inline-block px-2 xs:px-3 py-1 bg-red-900 text-amber-100 rounded-full text-xs font-semibold">
                Cultural Learning Platform
              </span>
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-red-900 mb-4 sm:mb-6 leading-tight text-balance">
              Master Traditional
              <br />
              <span className="text-amber-700">Arts & Culture</span>
            </h1>
            <p className="text-base sm:text-lg text-red-800 mb-4 sm:mb-6 font-semibold">Learn from certified masters</p>
            <p className="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8 leading-relaxed">
              Preserve and celebrate cultural heritage through interactive online classes. Connect with expert
              instructors and join a global community of culture enthusiasts.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
              <Button size="sm" className="bg-red-900 hover:bg-red-800 text-amber-100 font-semibold sm:h-11 sm:px-8">
                Explore Classes
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-2 border-red-900 text-red-900 font-semibold hover:bg-red-50 bg-transparent sm:h-11 sm:px-8"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Visual - Image slider showcasing cultural arts */}
          <div className="relative h-64 xs:h-72 sm:h-80 md:h-96 flex items-center justify-center">
            
              {/* Image slider component inserted here */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* The slider is a client component imported below */}
              <div className="w-full h-full">
                {/* dynamic client component */}
                {/* Imported at top of file */}
                <ImageSlider className="h-full w-full" />
              </div>
              
           
          </div>
        </div>
      </div>
    </section>
  )
}
