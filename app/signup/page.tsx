"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowRight, CheckCircle, Lock, Mail, Phone, User } from "lucide-react"
import { toast } from "sonner"

import { Navbar } from "@/components/navbar"
import { TopContactBar } from "@/components/top-contact-bar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as authService from "@/lib/auth-service"

const signupSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    contactNumber: z.string().optional(),
    role: z.enum(["student", "instructor"], { required_error: "Select a role" }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
    terms: z.boolean().refine((value) => value === true, "Please accept the terms"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignupValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      role: "student",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  const handleSubmit = async (values: SignupValues) => {
    try {
      await authService.signup({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: values.role,
        contactNumber: values.contactNumber,
      })

      setSubmittedEmail(values.email)
      toast.success("Account created! Check your email for verification link.")
      try {
        await authService.requestVerificationToken(values.email)
      } catch {
        // ignore resend failure, signup already succeeded
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create account right now."
      toast.error(message)
    }
  }

  const handleResend = async () => {
    if (!submittedEmail) return
    try {
      await authService.requestVerificationToken(submittedEmail)
      toast.success("Verification email sent again.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to resend verification email."
      toast.error(message)
    }
  }

  if (submittedEmail) {
    return (
      <main className="min-h-screen bg-background">
        <TopContactBar />
        <Navbar />
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-lg">
            <div className="bg-white rounded-2xl border-2 border-accent/20 p-10 text-center shadow-xl">
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="text-3xl font-semibold text-primary mb-3">Welcome to Gyanamrit!</h2>
              <p className="text-foreground/70 mb-6">
                We sent a verification link to <span className="font-semibold text-foreground">{submittedEmail}</span>.
                Please check your inbox (and spam folder) to activate your account.
              </p>
              <div className="space-y-3">
                <Button className="w-full" onClick={() => router.push("/login")}>
                  Go to Login
                </Button>
                <Button variant="outline" className="w-full" onClick={handleResend}>
                  Resend Verification Email
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <TopContactBar />
      <Navbar />
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Join Gyanamrit</h1>
            <p className="text-foreground/70">Create your account to access curated Sanskrit courses.</p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-accent/20 p-8 md:p-10 shadow-lg">
            <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                  <Input id="name" placeholder="Your full name" className="pl-10" {...form.register("name")} />
                </div>
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                  <Input
                    id="contactNumber"
                    type="tel"
                    placeholder="+1 555 123 4567"
                    className="pl-10"
                    {...form.register("contactNumber")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">I am joining as</Label>
                <select
                  id="role"
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  {...form.register("role")}
                >
                  <option value="student">Student / Learner</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                  <Input id="password" type="password" placeholder="Create a strong password" className="pl-10" {...form.register("password")} />
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    className="pl-10"
                    {...form.register("confirmPassword")}
                  />
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <label className="flex items-start gap-3 text-sm text-foreground/70">
                <input type="checkbox" className="mt-1 rounded border-border" {...form.register("terms")} />
                <span>
                  I agree to the{" "}
                  <Link href="#" className="text-accent hover:text-accent/80 underline-offset-4 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-accent hover:text-accent/80 underline-offset-4 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {form.formState.errors.terms && (
                <p className="text-sm text-red-500">{form.formState.errors.terms.message}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2 py-3"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Creating account..." : "Create Account"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-foreground/70">
              Already have an account?{" "}
              <Link href="/login" className="text-accent font-semibold hover:text-accent/80 transition-colors">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

