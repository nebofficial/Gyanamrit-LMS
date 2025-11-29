import { Navbar } from "@/components/navbar"
import { TopContactBar } from "@/components/top-contact-bar"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Contact Gyanamrit - Get in Touch",
  description: "Reach out to Gyanamrit with your questions and inquiries about our Sanskrit courses.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <TopContactBar />
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-red-900 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Get in Touch</h1>
          <p className="text-lg md:text-xl text-amber-100">We'd love to hear from you. Reach out with any questions.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8">Contact Information</h2>
              <div className="space-y-6">
                {[
                  { icon: Mail, title: "Email", content: "info@gyanamrit.com" },
                  { icon: Phone, title: "Phone", content: "+1 (555) 123-4567" },
                  { icon: MapPin, title: "Address", content: "123 Cultural Lane, Heritage City, HC 12345" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <item.icon className="w-6 h-6 text-accent mt-1" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary mb-1">{item.title}</h3>
                      <p className="text-foreground/70">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-10 pt-8 border-t border-border">
                <h3 className="font-bold text-primary mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {["Facebook", "Instagram", "Twitter", "LinkedIn"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="text-foreground/70 hover:text-accent transition-colors font-medium text-sm"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg border-2 border-accent/20 p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">Send us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="What is this about?"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea
                    placeholder="Your message here..."
                    rows={5}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  />
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
