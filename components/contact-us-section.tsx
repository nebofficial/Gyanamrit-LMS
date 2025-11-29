import { Button } from "@/components/ui/button"

export function ContactUsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-serif font-bold text-red-900 mb-2 sm:mb-4 text-balance">
            Get in Touch
          </h2>
          <p className="text-sm xs:text-base sm:text-lg text-gray-700 text-balance">
            Have questions? We'd love to hear from you. Send us a message.
          </p>
        </div>

        <form className="bg-white rounded-lg shadow-lg p-4 xs:p-6 sm:p-8 border-t-4 border-red-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-3 xs:px-4 py-2 sm:py-3 text-sm xs:text-base border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 bg-amber-50"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-3 xs:px-4 py-2 sm:py-3 text-sm xs:text-base border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 bg-amber-50"
            />
          </div>

          <input
            type="text"
            placeholder="Subject"
            className="w-full px-3 xs:px-4 py-2 sm:py-3 text-sm xs:text-base border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 bg-amber-50 mb-4 sm:mb-6"
          />

          <textarea
            placeholder="Your Message"
            rows={5}
            className="w-full px-3 xs:px-4 py-2 sm:py-3 text-sm xs:text-base border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 bg-amber-50 mb-4 sm:mb-6 resize-none"
          ></textarea>

          <Button className="w-full bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white font-semibold py-2 xs:py-3 sm:py-3 rounded-lg text-sm xs:text-base sm:text-lg h-auto">
            Send Message
          </Button>
        </form>
      </div>
    </section>
  )
}
