import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

export function TestimonialSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-serif font-bold text-red-900 mb-2 sm:mb-4 text-balance">
            Loved by Learners Worldwide
          </h2>
          <p className="text-sm xs:text-base sm:text-lg text-gray-600 text-balance">
            Join thousands of satisfied students on their learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[
            {
              name: "Sarah Chen",
              role: "Student",
              content:
                "The classes are incredibly well-structured. I've learned so much about our rich cultural heritage.",
              rating: 5,
            },
            {
              name: "Marcus Johnson",
              role: "Parent",
              content: "My kids love this platform. They learn our traditions while having fun. Highly recommended!",
              rating: 5,
            },
            {
              name: "Priya Sharma",
              role: "Educator",
              content: "Excellent platform for preserving and teaching cultural arts. The instructors are amazing.",
              rating: 5,
            },
          ].map((testimonial, index) => (
            <Card
              key={index}
              className="p-4 sm:p-6 lg:p-8 border border-amber-200 bg-gradient-to-br from-amber-50 to-white hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-1 mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">{testimonial.content}</p>
              <div className="border-t border-amber-200 pt-3 sm:pt-4">
                <p className="font-semibold text-red-900 text-sm sm:text-base">{testimonial.name}</p>
                <p className="text-xs sm:text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
