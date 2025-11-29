
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Send } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

import { TopContactBar } from "@/components/top-contact-bar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import * as authService from "@/lib/auth-service"

const schema = z.object({
  email: z.string().email("Enter a valid email"),
})

type ForgotValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)
  const form = useForm<ForgotValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: ForgotValues) => {
    try {
      await authService.requestPasswordReset(values.email)
      setSentTo(values.email)
      setLastError(null)
      toast.success(sentTo ? "Reset link sent again. Please check your inbox." : "Password reset link sent. Please check your email.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send reset email."
      setLastError(message)
      toast.error(message)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <TopContactBar />
      <Navbar />
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-lg">
          <div className="bg-white rounded-2xl border-2 border-accent/20 p-8 md:p-10 shadow-lg">
            <h1 className="text-2xl font-semibold text-primary mb-2">Reset your password</h1>
            <p className="text-sm text-foreground/70 mb-6">
              Enter the email associated with your account and we’ll send you a secure password reset link.
            </p>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                  <Input id="email" type="email" placeholder="you@example.com" className="pl-10" {...form.register("email")} />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full gap-2" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? sentTo
                    ? "Resending..."
                    : "Sending link..."
                  : sentTo
                    ? "Resend reset link"
                    : "Send reset link"}
                <Send className="h-4 w-4" />
              </Button>
            </form>
            {lastError && (
              <p className="mt-3 text-sm text-red-500" role="alert">
                {lastError}
              </p>
            )}
            {sentTo && (
              <p className="mt-4 text-sm text-foreground/70">
                We sent a password reset link to <span className="font-semibold">{sentTo}</span>. It expires after 15 minutes.
              </p>
            )}
            <div className="mt-6 text-center text-sm">
              Remember the password?{" "}
              <Link href="/login" className="text-accent font-semibold hover:text-accent/80">
                Go back to login
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

