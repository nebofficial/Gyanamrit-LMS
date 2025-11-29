"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle, Loader2, Pencil, PlusCircle, Trash, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import * as dashboardService from "@/lib/dashboard-service"
import type { Course } from "@/lib/dashboard-service"
import { DASHBOARD_ROUTES } from "@/lib/constants"

const instructorSchema = z.object({
  expertise: z.string().optional(),
  experience: z.string().optional(),
  qualification: z.string().optional(),
  bio: z.string().optional(),
})

type InstructorValues = z.infer<typeof instructorSchema>

export default function InstructorDashboardPage() {
  const { token, user, updateProfile, deleteAccount } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyCourseId, setBusyCourseId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const form = useForm<InstructorValues>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      expertise: user?.expertise ?? "",
      experience: user?.experience ?? "",
      qualification: user?.qualification ?? "",
      bio: user?.bio ?? "",
    },
  })

  useEffect(() => {
    if (!user?.role) return
    if (user.role !== "instructor") {
      router.replace(DASHBOARD_ROUTES[user.role] ?? "/dashboard")
    }
  }, [router, user?.role])

  useEffect(() => {
    form.reset({
      expertise: user?.expertise ?? "",
      experience: user?.experience ?? "",
      qualification: user?.qualification ?? "",
      bio: user?.bio ?? "",
    })
  }, [form, user])

  useEffect(() => {
    if (!token) return
    const fetchCourses = async () => {
      try {
        const response = await dashboardService.getInstructorCourses(token)
        setCourses(response.data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to fetch courses.")
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [token])

  const stats = useMemo(() => {
    const total = courses.length
    const published = courses.filter((course) => course.status === "published").length
    const draft = courses.filter((course) => course.status === "draft" || !course.isApproved).length
    return { total, published, draft }
  }, [courses])

  const onSubmit = async (values: InstructorValues) => {
    await updateProfile(values)
    toast.success("Instructor profile updated.")
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!token) return
    setBusyCourseId(courseId)
    try {
      await dashboardService.deleteCourse(token, courseId)
      setCourses((prev) => prev.filter((course) => course.id !== courseId))
      toast.success("Course removed successfully.")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete course."
      toast.error(message)
    } finally {
      setBusyCourseId(null)
    }
  }

  const handleDeleteAccount = async () => {
    await deleteAccount()
  }

  return (
    <div className="space-y-6">
      
        
    </div>
  )
}

