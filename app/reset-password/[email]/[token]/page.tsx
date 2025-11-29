"use client"

import { useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lock, RefreshCcw } from "lucide-react"
import { toast } from "sonner"

import { TopContactBar } from "@/components/top-contact-bar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import * as authService from "@/lib/auth-service"

const passwordMessage = "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character."

const schema = z
  .object({
    password: z
      .string()
      .min(8, passwordMessage)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/, passwordMessage),
    confirmPassword: z.string().min(8),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ResetValues = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const params = useParams<{ email: string; token: string }>()
  const router = useRouter()
  const [completed, setCompleted] = useState(false)

  const email = useMemo(() => decodeURIComponent(params.email), [params.email])
  const token = useMemo(() => params.token, [params.token])

  const form = useForm<ResetValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: ResetValues) => {
    try {
      await authService.resetPassword({
        email,
        token,
        password: values.password,
        confirmPassword: values.confirmPassword,
      })
      setCompleted(true)
      toast.success("Password updated successfully. You can now log in.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reset password."
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
            <h1 className="text-2xl font-semibold text-primary mb-4">Choose a new password</h1>
            <p className="text-sm text-foreground/70 mb-6">
              Resetting password for <span className="font-semibold">{email}</span>
            </p>
            {completed ? (
              <div className="space-y-4 text-center">
                <p className="text-foreground/70">Your password has been reset.</p>
                <Button onClick={() => router.push("/login")} className="w-full">
                  Go to login
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-foreground/40" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      className="pl-10"
                      {...form.register("password")}
                    />
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

                <Button type="submit" className="w-full gap-2" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Updating..." : "Update password"}
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

