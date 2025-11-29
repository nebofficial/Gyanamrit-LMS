"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, BookOpen, ArrowLeft, Play, FileText, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
    <div className="space-y-6">
      <Button onClick={() => router.back()} variant="outline" className="mb-4 gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Courses
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" /> {course.title}
          </CardTitle>
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        <TabsList>
          <TabsTrigger value="lessons">
            <BookOpen className="h-4 w-4 mr-2" />
            Lessons ({lessons.length})
          </TabsTrigger>
        </TabsList>

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
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 text-red-800 flex items-center justify-center font-semibold">
                            {index + 1}
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
                                  className="gap-2"
                                >
                                  <Play className="h-4 w-4" />
                                  Watch Video
                                </Button>
                              )}
                              {lesson.fileUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(lesson.fileUrl, "_blank")}
                                  className="gap-2"
                                >
                                  <FileText className="h-4 w-4" />
                                  Download File
                                </Button>
                              )}
                              {lesson.imageUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(lesson.imageUrl, "_blank")}
                                  className="gap-2"
                                >
                                  <ImageIcon className="h-4 w-4" />
                                  View Image
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
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

