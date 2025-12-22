"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutDashboard, GraduationCap, BookOpen, Users, Loader2, Zap } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { DASHBOARD_ROUTES } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as dashboardService from "@/lib/dashboard-service"
import * as userService from "@/lib/user-service"
import type { Course, Enrollment } from "@/lib/dashboard-service"
import type { UserProfile } from "@/lib/user-service"

export default function OverviewPage() {
  const { token, user } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [usersData, setUsersData] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        if (user?.role === "admin") {
          const [coursesResult, usersResult] = await Promise.allSettled([
            dashboardService.getAdminCourses(token),
            userService.listUsers(token),
          ])
          
          if (coursesResult.status === "fulfilled") {
            setCourses(coursesResult.value.data ?? [])
          } else {
            console.error("Failed to fetch courses:", coursesResult.reason)
          }
          
          if (usersResult.status === "fulfilled") {
            setUsersData(usersResult.value.data ?? [])
          } else {
            console.error("Failed to fetch users:", usersResult.reason)
            setError("Unable to load some data. Please refresh the page.")
          }
        } else if (user?.role === "instructor") {
          try {
            const coursesRes = await dashboardService.getInstructorCourses(token)
            setCourses(coursesRes.data ?? [])
          } catch (err) {
            console.error("Failed to fetch instructor courses:", err)
            setError("Unable to load courses. Please refresh the page.")
          }
        } else {
          try {
            const enrollmentsRes = await dashboardService.getEnrollments(token)
            setEnrollments(enrollmentsRes.data ?? [])
          } catch (err) {
            console.error("Failed to fetch enrollments:", err)
            setError("Unable to load enrollments. Please refresh the page.")
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setError("Unable to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token, user?.role])

  const stats = useMemo(() => {
    if (user?.role === "admin") {
      return {
        totalUsers: usersData.length,
        instructors: usersData.filter((u) => u.role === "instructor").length,
        students: usersData.filter((u) => u.role === "student").length,
        courses: courses.length,
      }
    } else if (user?.role === "instructor") {
      return {
        totalCourses: courses.length,
        published: courses.filter((c) => c.status === "published").length,
        draft: courses.filter((c) => c.status === "draft" || !c.isApproved).length,
      }
    } else {
      return {
        totalEnrollments: enrollments.length,
        completed: enrollments.filter((e) => (e.progress ?? 0) >= 100).length,
        inProgress: enrollments.filter((e) => (e.progress ?? 0) > 0 && (e.progress ?? 0) < 100).length,
      }
    }
  }, [courses, enrollments, usersData, user?.role])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">Overview</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1 sm:mt-2">Welcome back, {user?.name ?? "User"}</p>
        {error && (
          <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs sm:text-sm text-amber-800">
            {error}
          </div>
        )}
      </div>

      {user?.role === "admin" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
              <CardDescription>All registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-semibold">{stats.totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Instructors</CardTitle>
              <CardDescription>Teaching staff</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{stats.instructors}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>Active learners</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{stats.students}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Courses</CardTitle>
              <CardDescription>Total courses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{stats.courses}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {user?.role === "instructor" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Courses</CardTitle>
              <CardDescription>Your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{stats.totalCourses}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Published</CardTitle>
              <CardDescription>Live courses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{stats.published}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Draft</CardTitle>
              <CardDescription>In progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{stats.draft}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {user?.role === "student" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Enrollments</CardTitle>
              <CardDescription>Courses enrolled</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{stats.totalEnrollments}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>In Progress</CardTitle>
              <CardDescription>Active learning</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{stats.inProgress}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
              <CardDescription>Finished courses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{stats.completed}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Navigate to key sections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => router.push("/dashboard/quick-action")}
              className="p-3 sm:p-4 border rounded-lg hover:bg-slate-50 text-left transition-colors"
            >
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mb-2" />
              <p className="text-sm sm:text-base font-medium">Quick Actions</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Common tasks</p>
            </button>
            {user?.role === "admin" && (
              <>
                <button
                  onClick={() => router.push("/dashboard/admin/courses")}
                  className="p-3 sm:p-4 border rounded-lg hover:bg-slate-50 text-left transition-colors"
                >
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mb-2" />
                  <p className="text-sm sm:text-base font-medium">Course Management</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Manage courses</p>
                </button>
                <button
                  onClick={() => router.push("/dashboard/admin/users")}
                  className="p-3 sm:p-4 border rounded-lg hover:bg-slate-50 text-left transition-colors"
                >
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mb-2" />
                  <p className="text-sm sm:text-base font-medium">User Management</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Manage users</p>
                </button>
              </>
            )}
            {user?.role === "instructor" && (
              <button
                onClick={() => router.push("/dashboard/instructor/courses")}
                className="p-3 sm:p-4 border rounded-lg hover:bg-slate-50 text-left transition-colors"
              >
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mb-2" />
                <p className="text-sm sm:text-base font-medium">Course Management</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Your courses</p>
              </button>
            )}
            {user?.role === "student" && (
              <button
                onClick={() => router.push("/dashboard/student/courses")}
                className="p-3 sm:p-4 border rounded-lg hover:bg-slate-50 text-left transition-colors"
              >
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mb-2" />
                <p className="text-sm sm:text-base font-medium">My Courses</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Your learning</p>
              </button>
            )}
            <button
              onClick={() => router.push("/dashboard/settings")}
              className="p-3 sm:p-4 border rounded-lg hover:bg-slate-50 text-left transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mb-2" />
              <p className="text-sm sm:text-base font-medium">Settings</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Account settings</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

