"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle, Loader2, ShieldAlert } from "lucide-react"
import Link from "next/link"

import * as authService from "@/lib/auth-service"
import { Navbar } from "@/components/navbar"
import { TopContactBar } from "@/components/top-contact-bar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

type Status = "pending" | "success" | "error"

export default function VerifyAccountPage() {
  const params = useParams<{ email: string; token: string }>()
  const router = useRouter()
  const [status, setStatus] = useState<Status>("pending")
  const [message, setMessage] = useState("Verifying your account...")

  useEffect(() => {
    const verify = async () => {
      try {
        const email = decodeURIComponent(params.email)
        const response = await authService.verifyAccount(email, params.token)
        setStatus("success")
        setMessage(response.message ?? "Your account is verified. You can now log in.")
      } catch (error) {
        const info = error instanceof Error ? error.message : "Verification link is invalid or has expired."
        setStatus("error")
        setMessage(info)
      }
    }
    verify()
  }, [params.email, params.token])

  const renderIcon = () => {
    if (status === "pending") return <Loader2 className="h-12 w-12 animate-spin text-accent" />
    if (status === "success") return <CheckCircle className="h-12 w-12 text-green-500" />
    return <ShieldAlert className="h-12 w-12 text-red-500" />
  }

  return (
    <main className="min-h-screen bg-background">
      <TopContactBar />
      <Navbar />
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-lg">
          <div className="bg-white rounded-2xl border-2 border-accent/20 p-10 text-center shadow-lg">
            <div className="flex justify-center mb-4">{renderIcon()}</div>
            <h1 className="text-2xl font-semibold text-primary mb-3">
              {status === "success" ? "Email Verified" : status === "error" ? "Verification failed" : "Hang tight"}
            </h1>
            <p className="text-foreground/70 mb-6">{message}</p>
            {status === "success" ? (
              <Button className="w-full" onClick={() => router.push("/login")}>
                Continue to login
              </Button>
            ) : (
              <div className="space-y-3">
                <Button variant="outline" className="w-full" onClick={() => router.push("/signup")}>
                  Create new account
                </Button>
                <p className="text-sm text-foreground/70">
                  Already verified?{" "}
                  <Link href="/login" className="text-accent font-semibold hover:text-accent/80">
                    Log in here
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

