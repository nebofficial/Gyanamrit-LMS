"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Settings, Trash2, Save, Mail, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/components/providers/auth-provider"
import * as authService from "@/lib/auth-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const settingsSchema = z.object({
  name: z.string().min(2).optional(),
  contactNumber: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
  expertise: z.string().optional(),
  experience: z.string().optional(),
  qualification: z.string().optional(),
})

type SettingsValues = z.infer<typeof settingsSchema>

export default function SettingsPage() {
  const { user, updateProfile, deleteAccount } = useAuth()
  const [showConfirm, setShowConfirm] = useState(false)
  const [sendingVerification, setSendingVerification] = useState(false)

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name ?? "",
      contactNumber: user?.contactNumber ?? "",
      country: user?.country ?? "",
      bio: user?.bio ?? "",
      expertise: user?.expertise ?? "",
      experience: user?.experience ?? "",
      qualification: user?.qualification ?? "",
    },
  })

  useEffect(() => {
    form.reset({
      name: user?.name ?? "",
      contactNumber: user?.contactNumber ?? "",
      country: user?.country ?? "",
      bio: user?.bio ?? "",
      expertise: user?.expertise ?? "",
      experience: user?.experience ?? "",
      qualification: user?.qualification ?? "",
    })
  }, [form, user])

  const onSubmit = async (values: SettingsValues) => {
    try {
      await updateProfile(values)
      toast.success("Settings updated successfully.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update settings."
      toast.error(message)
    }
  }

  const handleSendVerificationEmail = async () => {
    if (!user?.email) {
      toast.error("Email address not found.")
      return
    }
    setSendingVerification(true)
    try {
      await authService.requestVerificationToken(user.email)
      toast.success("Verification email sent! Please check your inbox.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send verification email."
      toast.error(message)
    } finally {
      setSendingVerification(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!showConfirm) {
      setShowConfirm(true)
      return
    }
    try {
      await deleteAccount()
      toast.success("Account deleted successfully.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete account."
      toast.error(message)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1 sm:mt-2">Manage your account preferences and profile information</p>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <div>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="Enter your full name" {...form.register("name")} />
              </div>
              <div>
                <Label htmlFor="contactNumber">Contact number</Label>
                <Input id="contactNumber" placeholder="+1 555 123 4567" {...form.register("contactNumber")} />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="Nepal" {...form.register("country")} />
              </div>
              {user?.role === "instructor" && (
                <>
                  <div>
                    <Label htmlFor="expertise">Expertise</Label>
                    <Input id="expertise" placeholder="e.g. Sanskrit Grammar" {...form.register("expertise")} />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience</Label>
                    <Input id="experience" placeholder="8+ years" {...form.register("experience")} />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input
                      id="qualification"
                      placeholder="Acharya in Sanskrit Literature"
                      {...form.register("qualification")}
                    />
                  </div>
                </>
              )}
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                placeholder={
                  user?.role === "instructor"
                    ? "Explain your approach to teaching."
                    : "Tell us about your Sanskrit journey"
                }
                {...form.register("bio")}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={form.formState.isSubmitting} className="gap-2">
                <Save className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                <span className="hidden sm:inline">{form.formState.isSubmitting ? "Saving..." : "Save changes"}</span>
                <span className="sm:hidden">{form.formState.isSubmitting ? "Saving..." : "Save"}</span>
              </Button>
              <Button className="bg-red-800 hover:bg-red-700 text-amber-100" variant="outline" type="button" onClick={() => form.reset()}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card >
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge variant="outline" className="capitalize">
                {user?.role}
              </Badge>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="flex items-center gap-2">
                <Badge variant={user?.isEmailVerified ? "default" : "secondary"}>
                  {user?.isEmailVerified ? "Verified" : "Pending verification"}
                </Badge>
                {!user?.isEmailVerified && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSendVerificationEmail}
                    disabled={sendingVerification}
                    className="gap-1 text-xs sm:text-sm bg-red-800 hover:bg-red-700 text-amber-100"
                  >
                    {sendingVerification ? (
                      <>
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-green-600" />
                        <span className="hidden sm:inline">Sending...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                        <span className="hidden sm:inline">Send verification link</span>
                        <span className="sm:hidden">Send link</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </div>
            {showConfirm ? (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="destructive" onClick={handleDeleteAccount} className="gap-1">
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                  <span className="hidden sm:inline">Confirm delete</span>
                  <span className="sm:hidden">Confirm</span>
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowConfirm(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="destructive" onClick={handleDeleteAccount} className="gap-1">
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                <span className="hidden sm:inline">Delete account</span>
                <span className="sm:hidden">Delete</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

