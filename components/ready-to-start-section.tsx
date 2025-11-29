import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function ReadyToStartSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-r from-red-800 to-red-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-24 xs:w-32 sm:w-40 h-24 xs:h-32 sm:h-40 rounded-full bg-amber-300"></div>
        <div className="absolute bottom-0 right-0 w-32 xs:w-48 sm:w-60 h-32 xs:h-48 sm:h-60 rounded-full bg-amber-300"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-6">
          <Sparkles className="w-4 xs:w-5 sm:w-6 h-4 xs:h-5 sm:h-6 text-amber-300" />
          <span className="text-amber-200 font-semibold text-xs xs:text-sm sm:text-base">Special Offer</span>
          <Sparkles className="w-4 xs:w-5 sm:w-6 h-4 xs:h-5 sm:h-6 text-amber-300" />
        </div>

        <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-amber-50 mb-3 sm:mb-4 text-balance">
          Ready to Get Started?
        </h2>

        <p className="text-base xs:text-lg sm:text-xl text-amber-100 mb-6 sm:mb-8 max-w-2xl mx-auto text-balance">
          Join thousands of students preserving and learning our rich cultural heritage. Begin your journey today!
        </p>

        <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center">
          <Button className="bg-amber-400 hover:bg-amber-500 text-red-900 font-bold py-2 xs:py-3 sm:py-4 px-4 xs:px-6 sm:px-8 rounded-lg text-sm xs:text-base sm:text-lg h-auto">
            Start Free Trial
          </Button>
          <Button
            variant="outline"
            className="border-2 border-amber-300 text-amber-50 hover:bg-red-800 font-bold py-2 xs:py-3 sm:py-4 px-4 xs:px-6 sm:px-8 rounded-lg text-sm xs:text-base sm:text-lg h-auto bg-transparent"
          >
            View Pricing
          </Button>
        </div>
      </div>
    </section>
  )
}
