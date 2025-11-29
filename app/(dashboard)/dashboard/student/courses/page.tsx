"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Loader2, BookOpen, Eye, GraduationCap, Clock, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/components/providers/auth-provider"
import { DASHBOARD_ROUTES } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as dashboardService from "@/lib/dashboard-service"
import type { Course, Enrollment } from "@/lib/dashboard-service"

export default function StudentCoursesPage() {
  const { token, user } = useAuth()
  const router = useRouter()
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [loadingEnrollments, setLoadingEnrollments] = useState(true)
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== "student") {
      router.replace(DASHBOARD_ROUTES[user?.role ?? "student"])
    }
  }, [router, user?.role])

  useEffect(() => {
    if (!token) return
    fetchEnrollments()
  }, [token])

  useEffect(() => {
    fetchAvailableCourses()
  }, [])

  const fetchAvailableCourses = async () => {
    setLoadingCourses(true)
    try {
      const response = await dashboardService.getPublicCourses()
      const publishedCourses = (response.data ?? []).filter(
        (course) => course.status === "published" && course.isApproved === true
      )
      setAvailableCourses(publishedCourses)
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      toast.error("Unable to load available courses.")
    } finally {
      setLoadingCourses(false)
    }
  }

  const fetchEnrollments = async () => {
    if (!token) return
    setLoadingEnrollments(true)
    try {
      const response = await dashboardService.getEnrollments(token)
      setEnrollments(response.data ?? [])
    } catch (error) {
      console.error("Failed to fetch enrollments:", error)
      toast.error("Unable to load enrollments.")
    } finally {
      setLoadingEnrollments(false)
    }
  }

  const handleEnroll = async (courseId: string) => {
    if (!token || !user?.id) return
    setEnrollingCourseId(courseId)
    try {
      await dashboardService.addEnrollment(token, {
        userId: user.id,
        courseId: courseId,
      })
      toast.success("Enrollment request submitted successfully!")
      await fetchEnrollments()
    } catch (error: any) {
      console.error("Enrollment error:", error)
      const message = error?.data?.message || error?.message || "Unable to enroll in course."
      toast.error(message)
    } finally {
      setEnrollingCourseId(null)
    }
  }

  const handleViewCourse = (courseId: string) => {
    router.push(`/dashboard/student/courses/${courseId}`)
  }

  const enrolledCourseIds = useMemo(() => {
    return new Set(enrollments.map((e) => e.courseId))
  }, [enrollments])

  // Get enrolled courses with enrollment details
  const enrolledCourses = useMemo(() => {
    return enrollments
      .map((enrollment) => ({
        ...enrollment.course!,
        enrollment: enrollment,
      }))
      .filter((item) => item.id) // Filter out any without course data
  }, [enrollments])

  // Filter available courses to exclude already enrolled ones
  const coursesToEnroll = useMemo(() => {
    return availableCourses.filter((course) => !enrolledCourseIds.has(course.id))
  }, [availableCourses, enrolledCourseIds])

  const canViewCourse = (enrollment: Enrollment) => {
    // Can view if payment status is "free" or "paid"
    return enrollment.paymentStatus === "free" || enrollment.paymentStatus === "paid"
  }

  const getPaymentStatusBadge = (status?: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-600">Paid</Badge>
      case "free":
        return <Badge className="bg-blue-600">Free</Badge>
      case "pending":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100">
            {status ?? "Unknown"}
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
        <p className="text-slate-600 mt-2">Browse available courses and manage your enrollments</p>
      </div>

      <Tabs defaultValue="enrolled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="enrolled">
            <GraduationCap className="h-4 w-4 mr-2" />
            Enrolled Courses ({enrolledCourses.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            <BookOpen className="h-4 w-4 mr-2" />
            Available Courses ({coursesToEnroll.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Enrolled Courses</CardTitle>
              <CardDescription>Courses you have enrolled in</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingEnrollments ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : enrolledCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  You haven't enrolled in any courses yet. Browse available courses to get started!
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course Title</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Enrolled On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrolledCourses.map((course) => {
                        const enrollment = course.enrollment
                        const canView = canViewCourse(enrollment)
                        return (
                          <TableRow key={enrollment.id || course.id}>
                            <TableCell className="font-medium">{course.title}</TableCell>
                            <TableCell>{course.instructor?.name ?? "—"}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {course.level ?? "basic"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-red-600 h-2 rounded-full"
                                    style={{ width: `${enrollment.progress ?? 0}%` }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground">{enrollment.progress ?? 0}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{getPaymentStatusBadge(enrollment.paymentStatus)}</TableCell>
                            <TableCell>
                              {enrollment.enrolledAt
                                ? new Date(enrollment.enrolledAt).toLocaleDateString()
                                : "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              {canView ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleViewCourse(course.id)}
                                  className="gap-2 bg-red-800 hover:bg-red-700 text-amber-100"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Course
                                </Button>
                              ) : (
                                <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  Waiting for approval
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Courses</CardTitle>
              <CardDescription>Browse and enroll in new courses</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingCourses ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : coursesToEnroll.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No available courses at the moment. Check back later!
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {coursesToEnroll.map((course) => (
                    <Card key={course.id} className="flex flex-col">
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between">
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Instructor:</span>
                            <span className="font-medium">{course.instructor?.name ?? "—"}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Level:</span>
                            <Badge variant="outline" className="capitalize">
                              {course.level ?? "basic"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-semibold">
                              {course.price ? `₹${Number(course.price).toLocaleString()}` : "Free"}
                            </span>
                          </div>
                          {course.discountPrice && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Discount:</span>
                              <span className="font-semibold text-green-600">
                                ₹{Number(course.discountPrice).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => handleEnroll(course.id)}
                          disabled={enrollingCourseId === course.id}
                          className="w-full gap-2 bg-red-800 hover:bg-red-700 text-amber-100"
                        >
                          {enrollingCourseId === course.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Enrolling...
                            </>
                          ) : (
                            <>
                              <GraduationCap className="h-4 w-4" />
                              Enroll Now
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

