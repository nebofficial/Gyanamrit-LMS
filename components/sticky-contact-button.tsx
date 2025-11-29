"use client"

import { Phone, Mail, MessageCircle, Heart } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"

export function StickyContactButton() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  
  // Hide contact button on dashboard pages
  if (pathname?.startsWith("/dashboard")) {
    return null
  }

  const contactMethods = [
    {
      id: "phone",
      label: "Call Us",
      icon: Phone,
      value: "+1 (555) 123-4567",
      bgColor: "bg-yellow-400",
      textColor: "text-yellow-900",
      href: "tel:+15551234567",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      value: "+1 (555) 123-4567",
      bgColor: "bg-green-500",
      textColor: "text-white",
      href: "https://wa.me/15551234567",
    },
    {
      id: "email",
      label: "Email",
      icon: Mail,
      value: "contact@gyanamrit.com",
      bgColor: "bg-rose-400",
      textColor: "text-white",
      href: "mailto:contact@gyanamrit.com",
    },
    {
      id: "inquiry",
      label: "Inquiry",
      icon: Heart,
      value: "Send us a message",
      bgColor: "bg-amber-500",
      textColor: "text-amber-900",
      href: "#contact",
    },
  ]

  return (
    <>
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-0">
        {contactMethods.map((method, index) => {
          const Icon = method.icon
          return (
            <a
              key={method.id}
              href={method.href}
              target={method.id === "whatsapp" ? "_blank" : undefined}
              rel={method.id === "whatsapp" ? "noopener noreferrer" : undefined}
              className={`${method.bgColor} ${method.textColor} p-3 md:p-4 transition-all duration-300 hover:translate-x-1 group relative w-16 md:w-20 flex items-center justify-center`}
              title={method.label}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6" />

              {/* Tooltip on hover */}
              <div className="absolute right-full mr-2 bg-primary text-primary-foreground px-3 py-1 rounded text-xs md:text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {method.label}
              </div>
            </a>
          )
        })}
      </div>

      {/* Mobile floating button */}
      <div className="fixed bottom-6 right-4 z-40 sm:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart className="w-6 h-6" />
        </button>

        {/* Mobile menu */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl overflow-hidden border border-border">
            {contactMethods.map((method) => {
              const Icon = method.icon
              return (
                <a
                  key={method.id}
                  href={method.href}
                  target={method.id === "whatsapp" ? "_blank" : undefined}
                  rel={method.id === "whatsapp" ? "noopener noreferrer" : undefined}
                  className={`${method.bgColor} ${method.textColor} px-4 py-3 flex items-center gap-2 border-b border-border last:border-b-0 w-full text-left`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{method.label}</span>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
