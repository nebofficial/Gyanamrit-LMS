import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-orange-500 to-orange-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-balance">
          Ready to Transform Your Learning?
        </h2>
        <p className="text-lg text-orange-50 mb-8 leading-relaxed">
          Join millions of learners discovering the joy of interactive, gamified education
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white hover:bg-gray-100 text-orange-600 font-semibold">
            Start Free Trial
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-orange-700 font-semibold bg-transparent"
          >
            View Pricing
          </Button>
        </div>
        <p className="text-white text-sm mt-6">
          <span className="sr-only">Benefits: </span>No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  )
}
