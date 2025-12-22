"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Loader2, BookOpen, Eye, GraduationCap, Clock, CheckCircle, XCircle, Search, X } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/components/providers/auth-provider"
import { DASHBOARD_ROUTES } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as dashboardService from "@/lib/dashboard-service"
import type { Course, Enrollment } from "@/lib/dashboard-service"

export default function StudentCoursesPage() {
  const { token, user } = useAuth()
  const router = useRouter()
  // const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  // const [loadingCourses, setLoadingCourses] = useState(true)
  const [loadingEnrollments, setLoadingEnrollments] = useState(true)
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null)
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInstructor, setSelectedInstructor] = useState<string>("all")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("all")

  useEffect(() => {
    if (user?.role !== "student") {
      router.replace(DASHBOARD_ROUTES[user?.role ?? "student"])
    }
  }, [router, user?.role])

  useEffect(() => {
    if (!token) return
    fetchEnrollments()
  }, [token])

  // useEffect(() => {
  //   fetchAvailableCourses()
  // }, [])

  // const fetchAvailableCourses = async () => {
  //   setLoadingCourses(true)
  //   try {
  //     const response = await dashboardService.getPublicCourses()
  //     const publishedCourses = (response.data ?? []).filter(
  //       (course) => course.status === "published" && course.isApproved === true
  //     )
  //     setAvailableCourses(publishedCourses)
  //   } catch (error) {
  //     console.error("Failed to fetch courses:", error)
  //     toast.error("Unable to load available courses.")
  //   } finally {
  //     setLoadingCourses(false)
  //   }
  // }

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

  // const enrolledCourseIds = useMemo(() => {
  //   return new Set(enrollments.map((e) => e.courseId))
  // }, [enrollments])

  // Get enrolled courses with enrollment details
  const enrolledCourses = useMemo(() => {
    return enrollments
      .map((enrollment) => ({
        ...enrollment.course!,
        enrollment: enrollment,
      }))
      .filter((item) => item.id) // Filter out any without course data
  }, [enrollments])

  // Get unique instructors and levels for filters
  const instructors = useMemo(() => {
    const unique = new Set<string>()
    enrolledCourses.forEach((course) => {
      if (course.instructor?.name) {
        unique.add(course.instructor.name)
      }
    })
    return Array.from(unique).sort()
  }, [enrolledCourses])

  const levels = useMemo(() => {
    const unique = new Set<string>()
    enrolledCourses.forEach((course) => {
      if (course.level) {
        unique.add(course.level)
      }
    })
    return Array.from(unique).sort()
  }, [enrolledCourses])

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    let filtered = enrolledCourses

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query) ||
          course.instructor?.name?.toLowerCase().includes(query)
      )
    }

    // Instructor filter
    if (selectedInstructor !== "all") {
      filtered = filtered.filter((course) => course.instructor?.name === selectedInstructor)
    }

    // Level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter((course) => course.level === selectedLevel)
    }

    // Date filter
    if (selectedDate !== "all") {
      const now = new Date()
      filtered = filtered.filter((course) => {
        if (!course.enrollment?.enrolledAt) return false
        const enrolledDate = new Date(course.enrollment.enrolledAt)
        
        switch (selectedDate) {
          case "today":
            return enrolledDate.toDateString() === now.toDateString()
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return enrolledDate >= weekAgo
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return enrolledDate >= monthAgo
          case "year":
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
            return enrolledDate >= yearAgo
          default:
            return true
        }
      })
    }

    return filtered
  }, [enrolledCourses, searchQuery, selectedInstructor, selectedLevel, selectedDate])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedInstructor("all")
    setSelectedLevel("all")
    setSelectedDate("all")
  }

  // Filter available courses to exclude already enrolled ones
  // const coursesToEnroll = useMemo(() => {
  //   return availableCourses.filter((course) => !enrolledCourseIds.has(course.id))
  // }, [availableCourses, enrolledCourseIds])

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
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <Clock className="h-3 w-3 mr-1 text-red-600" />
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
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">My Courses</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1 sm:mt-2">Browse available courses and manage your enrollments</p>
      </div>

      <Tabs defaultValue="enrolled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="enrolled">
            <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-600" />
            <span className="hidden sm:inline">Enrolled Courses</span>
            <span className="sm:hidden">Enrolled</span>
            <span className="ml-1">({filteredCourses.length})</span>
          </TabsTrigger>
          {/* <TabsTrigger value="available">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-600" />
            Available Courses ({coursesToEnroll.length})
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="enrolled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Enrolled Courses</CardTitle>
              <CardDescription>Courses you have enrolled in</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Bar */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search courses by title, description, or instructor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {(searchQuery || selectedInstructor !== "all" || selectedLevel !== "all" || selectedDate !== "all") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="gap-2 bg-red-800 hover:bg-red-700 text-amber-100"
                    >
                      <X className="h-4 w-4" />
                      Clear Filters
                    </Button>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="All Instructors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Instructors</SelectItem>
                      {instructors.map((instructor) => (
                        <SelectItem key={instructor} value={instructor}>
                          {instructor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="All Dates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {filteredCourses.length !== enrolledCourses.length && (
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredCourses.length} of {enrolledCourses.length} courses
                  </p>
                )}
              </div>
              {loadingEnrollments ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : enrolledCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  You haven't enrolled in any courses yet. Browse available courses to get started!
                </p>
              ) : filteredCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No courses match your search criteria. Try adjusting your filters.
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
                      {filteredCourses.map((course) => {
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
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                                  <span className="hidden sm:inline">View Course</span>
                                  <span className="sm:hidden">View</span>
                                </Button>
                              ) : (
                                <div className="flex items-center justify-end gap-2 text-xs sm:text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                                  <span className="hidden sm:inline">Waiting for approval</span>
                                  <span className="sm:hidden">Pending</span>
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

        {/* Available Courses Tab - Commented out for second version
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
                              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-green-400" />
                              <span className="hidden sm:inline">Enrolling...</span>
                              <span className="sm:hidden">...</span>
                            </>
                          ) : (
                            <>
                              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                              <span className="hidden sm:inline">Enroll Now</span>
                              <span className="sm:hidden">Enroll</span>
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
        */}
      </Tabs>
    </div>
  )
}

