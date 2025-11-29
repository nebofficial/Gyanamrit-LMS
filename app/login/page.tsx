"use client"

import { useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowRight, Lock, Mail } from "lucide-react"
import { toast } from "sonner"

import { Navbar } from "@/components/navbar"
import { TopContactBar } from "@/components/top-contact-bar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/providers/auth-provider"
import { DASHBOARD_ROUTES } from "@/lib/constants"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, loading, isAuthenticated, user } = useAuth()

  const defaultValues = useMemo<LoginValues>(
    () => ({
      email: "",
      password: "",
      remember: true,
    }),
    [],
  )

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  })

  const redirectAfterLogin = useMemo(() => {
    if (searchParams?.get("next")) return searchParams.get("next") as string
    if (user?.role) return DASHBOARD_ROUTES[user.role] ?? "/dashboard"
    return "/dashboard"
  }, [searchParams, user?.role])

  const handleSubmit = async (values: LoginValues) => {
    try {
      const profile = await login(values)
      toast.success("Logged in successfully")
      router.push(redirectAfterLogin)
      router.refresh()
      return profile
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to log in. Please try again."
      toast.error(message)
    }
  }

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.replace(redirectAfterLogin)
    }
  }, [isAuthenticated, loading, redirectAfterLogin, router])

  return (
    <main className="min-h-screen bg-background">
      <TopContactBar />
      <Navbar />

      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-foreground/70">Log in to access your dashboard</p>
          </div>

          <div className="bg-white rounded-xl border-2 border-accent/20 p-8 md:p-10 shadow-lg">
            <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...form.register("email")}
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                  <Input id="password" type="password" placeholder="••••••••" {...form.register("password")} className="pl-10" />
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-foreground/70">
                  <input type="checkbox" {...form.register("remember")} className="rounded border-border" />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-accent hover:text-accent/80 transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2 py-2"
              >
                {form.formState.isSubmitting ? "Signing in..." : "Log In"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-foreground/70">
              Need an account?{" "}
              <Link href="/signup" className="text-accent font-semibold hover:text-accent/80 transition-colors">
                Create one
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center text-foreground/60 text-sm">
            <p>By logging in, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
