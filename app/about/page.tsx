import { Navbar } from "@/components/navbar"
import { TopContactBar } from "@/components/top-contact-bar"
import { Footer } from "@/components/footer"
import { Award, Users, Heart, Globe } from "lucide-react"
import { ImageSlider } from "@/components/image-slider"


export const metadata = {
  title: "About Gyanamrit - Our Mission & Vision",
  description: "Learn about Gyanamrit's mission to preserve and share Sanskrit and cultural arts globally.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <TopContactBar />
      <Navbar />

      <section className="bg-gradient-to-r from-primary to-red-900 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">About Gyanamrit</h1>
          <p className="text-lg md:text-xl text-amber-100">Preserving and Celebrating Sanskrit & Cultural Heritage</p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-accent/5">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Mission</h2>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed mb-4">
                Gyanamrit is dedicated to making Sanskrit and traditional cultural arts accessible to learners
                worldwide. We believe that cultural knowledge should not be confined to geography or time, but should
                flourish in the hearts and minds of people across the globe.
              </p>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed">
                Through interactive, gamified learning experiences, we blend ancient wisdom with modern educational
                technology to create an unforgettable learning journey.
              </p>
            </div>
            <div className="relative h-64 xs:h-72 sm:h-80 md:h-96 flex items-center justify-center">
              <div className="w-full h-full">
                <ImageSlider className="h-full w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-accent/5">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Globe, title: "Global Reach", desc: "Teaching Sanskrit to learners worldwide" },
              { icon: Users, title: "Community", desc: "Building a passionate learning community" },
              { icon: Award, title: "Excellence", desc: "Delivering high-quality cultural education" },
              { icon: Heart, title: "Passion", desc: "Driven by love for cultural preservation" },
            ].map((value, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 border-2 border-accent/20 hover:border-accent transition-colors"
              >
                <value.icon className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">{value.title}</h3>
                <p className="text-foreground/70">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">Dedicated to Your Learning</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Expert Teachers", role: "Sanskrit & Cultural Specialists" },
              { name: "Innovative Tech", role: "Modern Learning Platform" },
              { name: "Student Success", role: "Your Growth is Our Mission" },
            ].map((member, i) => (
              <div key={i} className="bg-white rounded-lg p-8 text-center border-l-4 border-accent">
                <h3 className="text-xl font-bold text-primary mb-2">{member.name}</h3>
                <p className="text-foreground/70">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
