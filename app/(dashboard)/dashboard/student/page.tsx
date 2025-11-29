"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { BookOpen, ClipboardCheck, GraduationCap, Loader2, Trash2, UserPen } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import * as dashboardService from "@/lib/dashboard-service"
import type { Course, Enrollment } from "@/lib/dashboard-service"
import { DASHBOARD_ROUTES } from "@/lib/constants"

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  contactNumber: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
})

type ProfileValues = z.infer<typeof profileSchema>

export default function StudentDashboardPage() {
  const { user, token, updateProfile, deleteAccount } = useAuth()
  const router = useRouter()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingEnrollments, setLoadingEnrollments] = useState(true)
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      contactNumber: user?.contactNumber ?? "",
      country: user?.country ?? "",
      bio: user?.bio ?? "",
    },
  })

  useEffect(() => {
    if (!user?.role) return
    if (user.role !== "student") {
      router.replace(DASHBOARD_ROUTES[user.role] ?? "/dashboard")
    }
  }, [router, user?.role])

  useEffect(() => {
    form.reset({
      name: user?.name ?? "",
      contactNumber: user?.contactNumber ?? "",
      country: user?.country ?? "",
      bio: user?.bio ?? "",
    })
  }, [form, user])

  useEffect(() => {
    if (!token) return
    const fetchEnrollments = async () => {
      try {
        const response = await dashboardService.getEnrollments(token)
        setEnrollments(response.data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to fetch enrollments.")
      } finally {
        setLoadingEnrollments(false)
      }
    }

    fetchEnrollments()
  }, [token])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await dashboardService.getPublicCourses()
        setCourses(response.data ?? [])
      } catch {
        // ignore
      } finally {
        setLoadingCourses(false)
      }
    }
    fetchCourses()
  }, [])

  const stats = useMemo(() => {
    const total = enrollments.length
    const completed = enrollments.filter((item) => (item.progress ?? 0) >= 100).length
    const inProgress = enrollments.filter((item) => (item.progress ?? 0) > 0 && (item.progress ?? 0) < 100).length
    return { total, completed, inProgress }
  }, [enrollments])

  const onSubmitProfile = async (values: ProfileValues) => {
    await updateProfile(values)
  }

  const handleDeleteAccount = async () => {
    await deleteAccount()
  }

  return (
    <div className="space-y-6">
    
    </div>
  )
}

