import { BookOpen, Brain, Heart, Zap } from "lucide-react"

const benefits = [
  {
    icon: BookOpen,
    title: "Preserve Heritage",
    description: "Connect with thousands of years of cultural wisdom and ancient traditions",
  },
  {
    icon: Brain,
    title: "Enhance Cognition",
    description: "Studies show Sanskrit learning improves memory, focus, and linguistic abilities",
  },
  {
    icon: Heart,
    title: "Spiritual Growth",
    description: "Deepen your understanding of philosophical and spiritual concepts",
  },
  {
    icon: Zap,
    title: "Career Opportunities",
    description: "Open doors to teaching, research, and cultural preservation careers",
  },
]

export function WhyLearnSanskritSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-serif font-bold text-red-900 mb-2 sm:mb-4 text-balance">
            Why Learn Sanskrit?
          </h2>
          <p className="text-sm xs:text-base sm:text-lg text-gray-700 max-w-2xl mx-auto text-balance">
            Explore the profound benefits of learning Sanskrit and embracing cultural knowledge
          </p>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg bg-gradient-to-br from-amber-50 to-red-50 border border-amber-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-10 xs:w-12 sm:w-14 h-10 xs:h-12 sm:h-14 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center mb-3 sm:mb-4">
                  <Icon className="w-5 xs:w-6 sm:w-7 h-5 xs:h-6 sm:h-7 text-amber-100" />
                </div>
                <h3 className="font-serif font-bold text-base xs:text-lg sm:text-xl text-red-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-xs xs:text-sm sm:text-base text-gray-700 leading-relaxed">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
