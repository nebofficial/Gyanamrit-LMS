import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Analytics from "@/components/analytics"
import "./globals.css"
import { StickyContactButton } from "@/components/sticky-contact-button"
import { WaitlistModal } from "@/components/waitlist-modal"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Toaster } from "@/components/ui/sonner"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gyanamrit - Learn Sanskrit & Cultural Arts",
  description: "Master Sanskrit, dance, music, and traditional cultural arts through interactive online classes",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <WaitlistModal />
          {children}
          <StickyContactButton />
          <Analytics />
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  )
}
