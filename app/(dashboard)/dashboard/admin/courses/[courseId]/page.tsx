"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, BookOpen, Users, GraduationCap, ArrowLeft, Plus, UserPlus, CreditCard, Trash2, Pencil } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import * as courseService from "@/lib/course-service"
import * as lessonService from "@/lib/lesson-service"
import * as dashboardService from "@/lib/dashboard-service"
import * as userService from "@/lib/user-service"
import type { Course as CourseServiceCourse } from "@/lib/course-service"
import type { Course as DashboardCourse } from "@/lib/dashboard-service"
import type { Lesson } from "@/lib/lesson-service"
import type { Enrollment } from "@/lib/dashboard-service"
import type { UserProfile } from "@/lib/user-service"
import { Checkbox } from "@/components/ui/checkbox"

type Course = (CourseServiceCourse | DashboardCourse) & { lessons?: Lesson[] }

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>()
  const router = useRouter()
  const { token, user } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddLessonDialogOpen, setIsAddLessonDialogOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [fileFile, setFileFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isAddEnrollmentDialogOpen, setIsAddEnrollmentDialogOpen] = useState(false)
  const [allUsers, setAllUsers] = useState<UserProfile[]>([])
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [enrollingUsers, setEnrollingUsers] = useState(false)
  const [isEditPaymentDialogOpen, setIsEditPaymentDialogOpen] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)
  const [updatePaymentStatus, setUpdatePaymentStatus] = useState<string>("pending")
  const [updatingPayment, setUpdatingPayment] = useState(false)
  const [deletingEnrollment, setDeletingEnrollment] = useState<string | null>(null)

  const lessonSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    videoUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    fileUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    imageUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  })

  type LessonValues = z.infer<typeof lessonSchema>

  const lessonForm = useForm<LessonValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      fileUrl: "",
      imageUrl: "",
    },
  })

  useEffect(() => {
    if (!token || !params.courseId) return
    fetchCourseData()
  }, [token, params.courseId])

  const fetchCourseData = async () => {
    if (!token || !params.courseId) return
    setLoading(true)
    try {
      // Admin needs to see all courses, but the detail endpoint requires enrollment
      // So we fetch from the admin courses list instead
      let courseData: Course | null = null
      
      try {
        const allCoursesRes = await dashboardService.getAdminCourses(token)
        const foundCourse = allCoursesRes.data?.find((c) => c.id === params.courseId)
        
        if (foundCourse) {
          courseData = foundCourse as Course
          setCourse(courseData)
          
          // Can't fetch lessons here since the endpoint requires enrollment
          setLessons([])
        } else {
          // Try the detail endpoint as a fallback
          try {
            const courseRes = await courseService.getCourseById(token, params.courseId)
            courseData = courseRes.data as Course
            setCourse(courseData)
            
            if (courseData.lessons && Array.isArray(courseData.lessons)) {
              setLessons(courseData.lessons)
            }
          } catch (detailError: any) {
            // Expected error - detail endpoint needs enrollment, but we already have the course
            if (detailError?.message?.includes("enrolled") || detailError?.message?.includes("enrollment")) {
              console.log("Detail endpoint requires enrollment - using course from list instead")
            } else {
              throw new Error("Course not found.")
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch course:", error)
        const errorMessage = error instanceof Error ? error.message : "Unable to load course details."
        toast.error(errorMessage)
        return
      }

      // Lessons endpoint needs enrollment, so we skip it for now
      // Admin can still view course details without the lessons list
      if (courseData && (!courseData.lessons || courseData.lessons.length === 0)) {
        setLessons([])
      }

      // Fetch enrollments for this course
      try {
        const enrollmentsRes = await dashboardService.getEnrollmentsByCourse(token, params.courseId)
        console.log('Admin enrollments response:', enrollmentsRes)
        const enrollmentData = enrollmentsRes.data ?? []
        console.log('Setting enrollments:', enrollmentData.length, enrollmentData)
        setEnrollments(enrollmentData)
      } catch (err: any) {
        // Enrollment endpoint might have restrictions, so try a fallback
        console.error("Failed to fetch enrollments:", err)
        if (err?.message?.includes("enrolled") || err?.message?.includes("enrollment")) {
          console.log("Enrollments endpoint has restrictions - trying fallback")
        }
        // Get all enrollments and filter manually
        try {
          const allEnrollmentsRes = await dashboardService.getEnrollments(token)
          const filtered = allEnrollmentsRes.data?.filter(
            (e) => String(e.courseId).toLowerCase() === String(params.courseId).toLowerCase()
          ) ?? []
          console.log('Fallback: Filtered enrollments:', filtered.length)
          setEnrollments(filtered)
        } catch (fallbackErr) {
          console.error("Fallback enrollment fetch also failed:", fallbackErr)
          setEnrollments([])
        }
      }
    } catch (error) {
      console.error("Failed to fetch course data:", error)
      toast.error("Unable to load course details.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddLesson = async (values: LessonValues) => {
    if (!token || !params.courseId) return
    setUploadProgress(0)
    try {
      const payload: lessonService.AddLessonPayload = {
        title: values.title,
        description: values.description || undefined,
        videoUrl: values.videoUrl || undefined,
        fileUrl: values.fileUrl || undefined,
        imageUrl: values.imageUrl || undefined,
        videoFile: videoFile || undefined,
        fileFile: fileFile || undefined,
        imageFile: imageFile || undefined,
      }

      await lessonService.addLesson(
        token,
        params.courseId,
        payload,
        (progress) => setUploadProgress(progress)
      )
      toast.success("Lesson added successfully.")
      lessonForm.reset()
      setVideoFile(null)
      setFileFile(null)
      setImageFile(null)
      setUploadProgress(0)
      setIsAddLessonDialogOpen(false)
      
      // Refresh the lessons list
      try {
        const lessonsRes = await lessonService.getLessonsByCourse(token, params.courseId)
        if (Array.isArray(lessonsRes.data)) {
          setLessons(lessonsRes.data)
        }
      } catch (err) {
        // If that fails, try refreshing the full course data
        try {
          const courseRes = await courseService.getCourseById(token, params.courseId)
          if (courseRes.data?.lessons && Array.isArray(courseRes.data.lessons)) {
            setLessons(courseRes.data.lessons)
          } else {
            fetchCourseData()
          }
        } catch (courseErr) {
          fetchCourseData()
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to add lesson."
      toast.error(message)
      setUploadProgress(0)
    }
  }

  const fetchUsers = async () => {
    if (!token) return
    setLoadingUsers(true)
    try {
      const response = await userService.listUsers(token)
      // Only show students who aren't already enrolled
      const enrolledUserIds = new Set(enrollments.map((e) => e.userId))
      const students = (response.data ?? []).filter(
        (user) => user.role === "student" && !enrolledUserIds.has(user.id)
      )
      setAllUsers(students)
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast.error("Unable to load users.")
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleToggleUser = (userId: string) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }

  const handleSaveEnrollments = async () => {
    if (!token || !params.courseId || selectedUserIds.size === 0) return
    setEnrollingUsers(true)
    try {
      const enrollmentPromises = Array.from(selectedUserIds).map((userId) =>
        dashboardService.addEnrollment(token, {
          userId,
          courseId: params.courseId,
        })
      )

      await Promise.all(enrollmentPromises)
      toast.success(`Successfully enrolled ${selectedUserIds.size} user(s) in this course.`)
      setIsAddEnrollmentDialogOpen(false)
      setSelectedUserIds(new Set())
      // Refresh the enrollments list
      try {
        const enrollmentsRes = await dashboardService.getEnrollmentsByCourse(token, params.courseId)
        console.log('Refreshed enrollments after adding:', enrollmentsRes)
        setEnrollments(enrollmentsRes.data ?? [])
      } catch (err) {
        console.error("Failed to refresh enrollments, trying fallback:", err)
        // Fallback: get all enrollments and filter
        try {
          const allEnrollmentsRes = await dashboardService.getEnrollments(token)
          const filtered = allEnrollmentsRes.data?.filter(
            (e) => String(e.courseId).toLowerCase() === String(params.courseId).toLowerCase()
          ) ?? []
          console.log('Fallback refresh: Filtered enrollments:', filtered.length)
          setEnrollments(filtered)
        } catch (fallbackErr) {
          console.error("Fallback enrollment refresh also failed:", fallbackErr)
        }
      }
    } catch (error: any) {
      console.error("Enrollment error:", error)
      const message = error?.data?.message || error?.message || "Unable to enroll users."
      toast.error(message)
    } finally {
      setEnrollingUsers(false)
    }
  }

  const handleUpdatePaymentStatus = async () => {
    if (!token || !selectedEnrollment) return
    setUpdatingPayment(true)
    try {
      await dashboardService.updateEnrollment(token, selectedEnrollment.id, {
        paymentStatus: updatePaymentStatus,
      })
      toast.success("Payment status updated successfully.")
      setIsEditPaymentDialogOpen(false)
      setSelectedEnrollment(null)
      setUpdatePaymentStatus("pending")
      
      // Refresh the enrollments list
      try {
        const enrollmentsRes = await dashboardService.getEnrollmentsByCourse(token, params.courseId)
        setEnrollments(enrollmentsRes.data ?? [])
      } catch (err) {
        console.error("Failed to refresh enrollments, trying fallback:", err)
        try {
          const allEnrollmentsRes = await dashboardService.getEnrollments(token)
          const filtered = allEnrollmentsRes.data?.filter(
            (e) => String(e.courseId).toLowerCase() === String(params.courseId).toLowerCase()
          ) ?? []
          setEnrollments(filtered)
        } catch (fallbackErr) {
          console.error("Fallback enrollment refresh also failed:", fallbackErr)
        }
      }
    } catch (error: any) {
      console.error("Update payment error:", error)
      const message = error?.data?.message || error?.message || "Unable to update payment status."
      toast.error(message)
    } finally {
      setUpdatingPayment(false)
    }
  }

  const handleDeleteEnrollment = async (enrollmentId: string) => {
    if (!token || !confirm("Are you sure you want to delete this enrollment? This action cannot be undone.")) {
      return
    }
    setDeletingEnrollment(enrollmentId)
    try {
      await dashboardService.deleteEnrollment(token, enrollmentId)
      toast.success("Enrollment deleted successfully.")
      
      // Refresh the enrollments list
      try {
        const enrollmentsRes = await dashboardService.getEnrollmentsByCourse(token, params.courseId)
        setEnrollments(enrollmentsRes.data ?? [])
      } catch (err) {
        console.error("Failed to refresh enrollments, trying fallback:", err)
        try {
          const allEnrollmentsRes = await dashboardService.getEnrollments(token)
          const filtered = allEnrollmentsRes.data?.filter(
            (e) => String(e.courseId).toLowerCase() === String(params.courseId).toLowerCase()
          ) ?? []
          setEnrollments(filtered)
        } catch (fallbackErr) {
          console.error("Fallback enrollment refresh also failed:", fallbackErr)
        }
      }
    } catch (error: any) {
      console.error("Delete enrollment error:", error)
      const message = error?.data?.message || error?.message || "Unable to delete enrollment."
      toast.error(message)
    } finally {
      setDeletingEnrollment(null)
    }
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
        <p className="text-muted-foreground">Course not found.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
          <p className="text-slate-600 mt-1">{course.description}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                course.status === "published"
                  ? "default"
                  : course.status === "draft"
                    ? "secondary"
                    : "outline"
              }
              className="capitalize"
            >
              {course.status ?? "draft"}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={course.isApproved ? "default" : "secondary"}>
              {course.isApproved ? "Yes" : "No"}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{course.totalStudents ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{lessons.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lessons" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lessons">
            <BookOpen className="h-4 w-4 mr-2" />
            Lessons ({lessons.length})
          </TabsTrigger>
          <TabsTrigger value="enrollments">
            <GraduationCap className="h-4 w-4 mr-2" />
            Enrollments ({enrollments.length})
          </TabsTrigger>
          <TabsTrigger value="students">
            <Users className="h-4 w-4 mr-2" />
            Enrolled Students ({enrollments.length})
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment ({enrollments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Course Lessons</CardTitle>
                  <CardDescription>All lessons in this course</CardDescription>
                </div>
                <Button
                  onClick={() => setIsAddLessonDialogOpen(true)}
                  className="gap-2 bg-red-800 hover:bg-red-700 text-amber-100"
                >
                  <Plus className="h-4 w-4" />
                  Add Lesson
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {lessons.length === 0 ? (
                <p className="text-sm text-muted-foreground">No lessons added yet.</p>
              ) : (
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-800 flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{lesson.title}</h4>
                        {lesson.description && (
                          <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                        )}
                      </div>
                      {lesson.videoUrl && (
                        <Badge variant="outline" className="gap-1">
                          <BookOpen className="h-3 w-3" />
                          Video
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Enrollment Statistics</CardTitle>
                  <CardDescription>Overview of course enrollments</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setIsAddEnrollmentDialogOpen(true)
                    fetchUsers()
                  }}
                  className="gap-2 bg-red-800 hover:bg-red-700 text-amber-100"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Enrollment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Total Enrollments</p>
                  <p className="text-2xl font-semibold">{enrollments.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid</p>
                  <p className="text-2xl font-semibold">
                    {enrollments.filter((e) => e.paymentStatus === "paid").length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Free</p>
                  <p className="text-2xl font-semibold">
                    {enrollments.filter((e) => e.paymentStatus === "free").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>List of all students enrolled in this course</CardDescription>
            </CardHeader>
            <CardContent>
              {enrollments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No students enrolled yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Enrolled Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell className="font-medium">{enrollment.user?.name ?? "—"}</TableCell>
                          <TableCell>{enrollment.user?.email ?? "—"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-red-600 h-2 rounded-full"
                                  style={{ width: `${enrollment.progress ?? 0}%` }}
                                />
                              </div>
                              <span className="text-sm">{Math.round(enrollment.progress ?? 0)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                enrollment.paymentStatus === "paid"
                                  ? "default"
                                  : enrollment.paymentStatus === "free"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="capitalize"
                            >
                              {enrollment.paymentStatus ?? "pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {enrollment.enrolledAt
                              ? new Date(enrollment.enrolledAt).toLocaleDateString()
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Management</CardTitle>
              <CardDescription>Manage payment status and enrollments for this course</CardDescription>
            </CardHeader>
            <CardContent>
              {enrollments.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No enrollments found for this course.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Enrolled Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell className="font-medium">
                            {enrollment.user?.name ?? enrollment.userId ?? "—"}
                          </TableCell>
                          <TableCell>{enrollment.user?.email ?? "—"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-red-600 h-2 rounded-full"
                                  style={{ width: `${enrollment.progress ?? 0}%` }}
                                />
                              </div>
                              <span className="text-sm">{Math.round(enrollment.progress ?? 0)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                enrollment.paymentStatus === "paid"
                                  ? "default"
                                  : enrollment.paymentStatus === "free"
                                    ? "secondary"
                                    : enrollment.paymentStatus === "refund"
                                      ? "destructive"
                                      : "outline"
                              }
                              className="capitalize"
                            >
                              {enrollment.paymentStatus ?? "pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {enrollment.enrolledAt
                              ? new Date(enrollment.enrolledAt).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedEnrollment(enrollment)
                                  setUpdatePaymentStatus(enrollment.paymentStatus || "pending")
                                  setIsEditPaymentDialogOpen(true)
                                }}
                                className="h-8 w-8 p-0"
                                title="Update Payment Status"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteEnrollment(enrollment.id)}
                                disabled={deletingEnrollment === enrollment.id}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Delete Enrollment"
                              >
                                {deletingEnrollment === enrollment.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Lesson Dialog */}
      <Dialog
        open={isAddLessonDialogOpen}
        onOpenChange={(open) => {
          if (!open && uploadProgress === 0) {
            setIsAddLessonDialogOpen(false)
            lessonForm.reset()
            setVideoFile(null)
            setFileFile(null)
            setImageFile(null)
            setUploadProgress(0)
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Lesson</DialogTitle>
            <DialogDescription>Add a new lesson to this course</DialogDescription>
          </DialogHeader>
          <form onSubmit={lessonForm.handleSubmit(handleAddLesson)} className="space-y-4">
            <div>
              <Label htmlFor="lesson-title">Lesson Title *</Label>
              <Input
                id="lesson-title"
                placeholder="Introduction to Sandhi Rules"
                {...lessonForm.register("title")}
              />
              {lessonForm.formState.errors.title && (
                <p className="text-sm text-red-500 mt-1">{lessonForm.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lesson-description">Description</Label>
              <Textarea
                id="lesson-description"
                rows={3}
                placeholder="Explore the foundational sandhi transformations used in Vedic texts."
                {...lessonForm.register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label>Video</Label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setVideoFile(file)
                      lessonForm.setValue("videoUrl", "")
                    }
                  }}
                />
                {videoFile && (
                  <div className="text-sm text-muted-foreground">
                    Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
                <div className="text-sm text-muted-foreground">OR</div>
                <Input
                  id="lesson-videoUrl"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=sanskrit-lesson (Video URL)"
                  {...lessonForm.register("videoUrl")}
                  onChange={(e) => {
                    lessonForm.setValue("videoUrl", e.target.value)
                    if (e.target.value) setVideoFile(null)
                  }}
                />
                {lessonForm.formState.errors.videoUrl && (
                  <p className="text-sm text-red-500 mt-1">{lessonForm.formState.errors.videoUrl.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>File/Resource (PDF, DOC, etc.)</Label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setFileFile(file)
                      lessonForm.setValue("fileUrl", "")
                    }
                  }}
                />
                {fileFile && (
                  <div className="text-sm text-muted-foreground">
                    Selected: {fileFile.name} ({(fileFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
                <div className="text-sm text-muted-foreground">OR</div>
                <Input
                  id="lesson-fileUrl"
                  type="url"
                  placeholder="https://resources.gyanamrit.org/files/sandhi-notes.pdf (Resource URL)"
                  {...lessonForm.register("fileUrl")}
                  onChange={(e) => {
                    lessonForm.setValue("fileUrl", e.target.value)
                    if (e.target.value) setFileFile(null)
                  }}
                />
                {lessonForm.formState.errors.fileUrl && (
                  <p className="text-sm text-red-500 mt-1">{lessonForm.formState.errors.fileUrl.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Image</Label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setImageFile(file)
                      lessonForm.setValue("imageUrl", "")
                    }
                  }}
                />
                {imageFile && (
                  <div className="text-sm text-muted-foreground">
                    Selected: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
                <div className="text-sm text-muted-foreground">OR</div>
                <Input
                  id="lesson-imageUrl"
                  type="url"
                  placeholder="https://resources.gyanamrit.org/images/sandhi-chart.jpg (Image URL)"
                  {...lessonForm.register("imageUrl")}
                  onChange={(e) => {
                    lessonForm.setValue("imageUrl", e.target.value)
                    if (e.target.value) setImageFile(null)
                  }}
                />
                {lessonForm.formState.errors.imageUrl && (
                  <p className="text-sm text-red-500 mt-1">{lessonForm.formState.errors.imageUrl.message}</p>
                )}
              </div>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading files...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddLessonDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={lessonForm.formState.isSubmitting}
                className="bg-red-800 hover:bg-red-700"
              >
                {lessonForm.formState.isSubmitting ? "Adding..." : "Add Lesson"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Enrollment Dialog */}
      <Dialog open={isAddEnrollmentDialogOpen} onOpenChange={setIsAddEnrollmentDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Enrollment</DialogTitle>
            <DialogDescription>Select users to enroll in this course</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {loadingUsers ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : allUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No available users to enroll. All students may already be enrolled.
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-4">
                {allUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUserIds.has(user.id)}
                      onCheckedChange={() => handleToggleUser(user.id)}
                    />
                    <label
                      htmlFor={`user-${user.id}`}
                      className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <div className="flex items-center justify-between">
                        <span>{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
            {selectedUserIds.size > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedUserIds.size} user(s) selected
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddEnrollmentDialogOpen(false)
                setSelectedUserIds(new Set())
              }}
              disabled={enrollingUsers}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveEnrollments}
              disabled={enrollingUsers || selectedUserIds.size === 0}
              className="bg-red-800 hover:bg-red-700"
            >
              {enrollingUsers ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enrolling...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Save Enrollment ({selectedUserIds.size})
                </>
              )}
            </Button>
          </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Payment Status Dialog */}
        <Dialog open={isEditPaymentDialogOpen} onOpenChange={setIsEditPaymentDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Payment Status</DialogTitle>
              <DialogDescription>
                Update payment status for {selectedEnrollment?.user?.name || selectedEnrollment?.userId || "this enrollment"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="updatePaymentStatus">Payment Status</Label>
                <select
                  id="updatePaymentStatus"
                  value={updatePaymentStatus}
                  onChange={(e) => setUpdatePaymentStatus(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-amber-900/40 bg-amber-50/95 px-3 py-2 text-sm text-black shadow-[0_4px_18px_rgba(120,53,15,0.25)] outline-none transition-[color,box-shadow] focus-visible:border-amber-800 focus-visible:ring-amber-800/40 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="pending">Pending</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                  <option value="refund">Refund</option>
                </select>
              </div>
              {selectedEnrollment && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Current Status: <span className="font-medium capitalize">{selectedEnrollment.paymentStatus || "pending"}</span></p>
                  <p>Student: {selectedEnrollment.user?.name || selectedEnrollment.userId}</p>
                  <p>Email: {selectedEnrollment.user?.email || "—"}</p>
                  <p>Progress: {Math.round(selectedEnrollment.progress ?? 0)}%</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditPaymentDialogOpen(false)
                  setSelectedEnrollment(null)
                  setUpdatePaymentStatus("pending")
                }}
                disabled={updatingPayment}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpdatePaymentStatus}
                disabled={updatingPayment || !selectedEnrollment}
                className="bg-red-800 hover:bg-red-700"
              >
                {updatingPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Update Status
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

