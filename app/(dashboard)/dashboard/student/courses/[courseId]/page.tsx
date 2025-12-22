"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, BookOpen, ArrowLeft, Play, FileText, Image as ImageIcon, Search, X } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as courseService from "@/lib/course-service"
import * as lessonService from "@/lib/lesson-service"
import * as dashboardService from "@/lib/dashboard-service"
import type { Course } from "@/lib/course-service"
import type { Lesson } from "@/lib/lesson-service"
import type { Enrollment } from "@/lib/dashboard-service"

export default function StudentCourseDetailPage() {
  const params = useParams<{ courseId: string }>()
  const router = useRouter()
  const { token, user } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<string>("all")

  useEffect(() => {
    if (!token || !params.courseId) return
    fetchCourseData()
  }, [token, params.courseId])

  const fetchCourseData = async () => {
    if (!token || !params.courseId) return
    setLoading(true)
    try {
      const courseRes = await courseService.getCourseById(token, params.courseId)
      const courseData = courseRes.data
      setCourse(courseData)

      // Get lessons from the course response if available
      if (courseData.lessons && Array.isArray(courseData.lessons)) {
        setLessons(courseData.lessons)
      } else {
        // Otherwise fetch them separately
        try {
          const lessonsRes = await lessonService.getLessonsByCourse(token, params.courseId)
          setLessons(lessonsRes.data ?? [])
        } catch (err) {
          console.error("Failed to fetch lessons:", err)
        }
      }

      // Check enrollment status to see if student can access content
      try {
        const enrollmentsRes = await dashboardService.getEnrollments(token)
        const studentEnrollment = enrollmentsRes.data?.find(
          (e) => e.courseId === params.courseId && e.userId === user?.id
        )
        setEnrollment(studentEnrollment ?? null)
      } catch (err) {
        console.error("Failed to fetch enrollment:", err)
      }
    } catch (error: any) {
      console.error("Failed to fetch course data:", error)
      const errorMessage = error?.data?.message || error?.message || "Unable to load course details."
      if (errorMessage.includes("enrolled") || errorMessage.includes("enrollment")) {
        toast.error("You must be enrolled in this course to view it.")
        router.push("/dashboard/student/courses")
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const canViewContent = () => {
    if (!enrollment) return false
    // Student can view content if payment is approved (free or paid)
    return enrollment.paymentStatus === "free" || enrollment.paymentStatus === "paid"
  }

  // Filter lessons based on search and date
  const filteredLessons = useMemo(() => {
    let filtered = lessons

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (lesson) =>
          lesson.title?.toLowerCase().includes(query) ||
          lesson.description?.toLowerCase().includes(query)
      )
    }

    // Date filter
    if (selectedDate !== "all") {
      const now = new Date()
      filtered = filtered.filter((lesson) => {
        if (!lesson.createdAt) return false
        const lessonDate = new Date(lesson.createdAt)
        
        switch (selectedDate) {
          case "today":
            return lessonDate.toDateString() === now.toDateString()
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return lessonDate >= weekAgo
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return lessonDate >= monthAgo
          case "year":
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
            return lessonDate >= yearAgo
          default:
            return true
        }
      })
    }

    return filtered
  }, [lessons, searchQuery, selectedDate])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedDate("all")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Course not found or you are not enrolled.</p>
        <Button onClick={() => router.push("/dashboard/student/courses")} className="mt-4">
          Back to Courses
        </Button>
      </div>
    )
  }

  if (!canViewContent()) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-2">
          Your enrollment is pending approval. Please wait for admin approval to access course content.
        </p>
        <Button onClick={() => router.push("/dashboard/student/courses")} className="mt-4">
          Back to Courses
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <Button onClick={() => router.back()} variant="outline" className="mb-2 sm:mb-4 gap-2 bg-red-800 hover:bg-red-700 text-amber-100">
        <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
        <span className="hidden sm:inline">Back to Courses</span>
        <span className="sm:hidden">Back</span>
      </Button>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            {course.title}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm mt-1 sm:mt-2">{course.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Category</p>
            <p className="font-semibold">{course.category?.name ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Instructor</p>
            <p className="font-semibold">{course.instructor?.name ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Level</p>
            <Badge variant="outline" className="capitalize">
              {course.level ?? "Basic"}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Language</p>
            <p className="font-semibold">{course.language ?? "English"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Duration</p>
            <p className="font-semibold">{course.duration ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Created Date</p>
            <p className="font-semibold">
              {course.createdAt
                ? new Date(course.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Progress</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${enrollment?.progress ?? 0}%` }}
                />
              </div>
              <span className="text-sm font-semibold">{enrollment?.progress ?? 0}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="lessons" className="space-y-4">
        <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
          <TabsList className="inline-flex min-w-full sm:min-w-0 bg-red-800 hover:bg-red-700 text-amber-100">
            <TabsTrigger value="lessons" className="">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-600" />
              <span className="hidden sm:inline">Lessons</span>
              <span className="sm:hidden">Lessons</span>
              <span className="ml-1">({filteredLessons.length})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="lessons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Lessons</CardTitle>
              <CardDescription>All lessons in this course</CardDescription>
            </CardHeader>
            <CardContent>
              {lessons.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No lessons available yet.</p>
              ) : (
                <>
                  {/* Search and Filter Bar */}
                  <div className="mb-6 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search lessons by title or description..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
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
                      {(searchQuery || selectedDate !== "all") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                          className="gap-2 bg-red-800 hover:bg-red-700 text-amber-100"
                        >
                          <X className="h-4 w-4" />
                          Clear
                        </Button>
                      )}
                    </div>
                    {filteredLessons.length !== lessons.length && (
                      <p className="text-sm text-muted-foreground">
                        Showing {filteredLessons.length} of {lessons.length} lessons
                      </p>
                    )}
                  </div>
                  {filteredLessons.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No lessons match your search criteria. Try adjusting your filters.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {filteredLessons.map((lesson, index) => {
                        // Find original index for numbering
                        const originalIndex = lessons.findIndex((l) => l.id === lesson.id)
                        return (
                    <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 text-red-800 flex items-center justify-center font-semibold">
                            {originalIndex >= 0 ? originalIndex + 1 : index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{lesson.title}</h4>
                            {lesson.description && (
                              <p className="text-sm text-muted-foreground mb-3">{lesson.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {lesson.videoUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(lesson.videoUrl, "_blank")}
                                  className="gap-2 bg-red-800 hover:bg-red-700 text-amber-100"
                                >
                                  <Play className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                  <span className="hidden sm:inline">Watch Video</span>
                                  <span className="sm:hidden">Video</span>
                                </Button>
                              )}
                              {lesson.fileUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(lesson.fileUrl, "_blank")}
                                  className="gap-2 bg-red-800 hover:bg-red-700 text-amber-100"
                                >
                                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                  <span className="hidden sm:inline">Download File</span>
                                  <span className="sm:hidden">File</span>
                                </Button>
                              )}
                              {lesson.imageUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(lesson.imageUrl, "_blank")}
                                  className="gap-2 bg-red-800 hover:bg-red-700 text-amber-100"
                                >
                                  <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                  <span className="hidden sm:inline">View Image</span>
                                  <span className="sm:hidden">Image</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                          )
                        })}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

