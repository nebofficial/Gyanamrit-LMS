import { Navbar } from "@/components/navbar"
import { TopContactBar } from "@/components/top-contact-bar"
import { HeroSection } from "@/components/hero-section"
import { LatestCoursesSection } from "@/components/latest-courses-section"
import { WhyLearnSanskritSection } from "@/components/why-learn-sanskrit-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { ContactUsSection } from "@/components/contact-us-section"
import { ReadyToStartSection } from "@/components/ready-to-start-section"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Gyanamrit - Learn Sanskrit & Cultural Arts",
  description: "Master Sanskrit, dance, music, and traditional cultural arts through interactive online classes",
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <TopContactBar />
      <Navbar />
      <HeroSection />
      <LatestCoursesSection />
      <WhyLearnSanskritSection />
      <TestimonialSection />
      <ContactUsSection />
      <ReadyToStartSection />
      <Footer />
    </main>
  )
}
