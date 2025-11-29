export function BenefitsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose Learn Together?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Build Strong Foundations",
              desc: "Master core concepts through interactive lessons and hands-on exercises",
            },
            {
              title: "Global Community",
              desc: "Connect with learners from around the world and expand your perspective",
            },
            {
              title: "Flexible Learning",
              desc: "Learn at your own pace with content available 24/7 across all devices",
            },
            {
              title: "Track Progress",
              desc: "Detailed analytics help you monitor growth and identify areas for improvement",
            },
          ].map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
