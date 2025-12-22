import React, { Suspense } from "react"
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
  generator: "codecraftnepal.com",
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
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
          <Suspense fallback={null}>
            <WaitlistModal />
            {children}
          </Suspense>
          <StickyContactButton />
          <Analytics />
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  )
}
