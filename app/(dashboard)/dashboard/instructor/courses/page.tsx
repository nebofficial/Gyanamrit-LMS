"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Pencil, Trash2, Eye, BookOpen, Plus, Clock } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/components/providers/auth-provider"
import { DASHBOARD_ROUTES } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CreateCourseDialog } from "@/app/(dashboard)/dashboard/admin/courses/create-course-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import * as dashboardService from "@/lib/dashboard-service"
import * as courseService from "@/lib/course-service"
import type { Course } from "@/lib/dashboard-service"

export default function InstructorCoursesPage() {
  const { token, user } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    if (user?.role !== "instructor") {
      router.replace(DASHBOARD_ROUTES[user?.role ?? "student"])
    }
  }, [router, user?.role])

  useEffect(() => {
    if (!token) return
    fetchCourses()
  }, [token])

  const fetchCourses = async () => {
    if (!token || !user?.id) return
    setLoading(true)
    try {
      // Try the instructor-specific endpoint first
      try {
        const response = await dashboardService.getInstructorCourses(token)
        setCourses(response.data ?? [])
      } catch (instructorError) {
        // Fallback: Try using the main course endpoint
        // The backend should filter by instructorId based on the token
        console.warn("Instructor endpoint failed, trying main endpoint:", instructorError)
        try {
          const response = await dashboardService.getAdminCourses(token)
          // Filter courses by current instructor (if backend doesn't do it automatically)
          const allCourses = response.data ?? []
          const myCourses = allCourses.filter((course) => course.instructorId === user.id)
          setCourses(myCourses)
        } catch (fallbackError) {
          console.error("Both endpoints failed:", fallbackError)
          throw instructorError // Throw the original error
        }
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      const errorMessage = error instanceof Error ? error.message : "Unable to load courses."
      toast.error(errorMessage)
      // Set empty array on error so UI doesn't break
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!token) return
    setDeletingCourseId(courseId)
    try {
      const response = await dashboardService.deleteCourse(token, courseId)
      console.log("Delete course response:", response)
      toast.success(response.message || "Course deleted successfully.")
      fetchCourses()
    } catch (error: any) {
      console.error("Delete course error:", error)
      // Extract error message from ApiError
      let errorMessage = "Unable to delete course."
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.data?.error) {
        errorMessage = error.data.error
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      toast.error(errorMessage)
    } finally {
      setDeletingCourseId(null)
    }
  }


  const handleViewCourse = (courseId: string, isApproved: boolean) => {
    if (!isApproved) {
      toast.info("Please wait for admin approval to view course details.")
      return
    }
    router.push(`/dashboard/instructor/courses/${courseId}`)
  }

  const handleEditCourse = (courseId: string) => {
    router.push(`/dashboard/instructor/courses/${courseId}/edit`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-600 mt-2">Manage your courses and their status</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-red-800 hover:bg-red-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" />
            <div>
              <CardTitle>Course List</CardTitle>
              <CardDescription>All courses created by you</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No courses found. Create your first course!</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.category?.name ?? "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {course.level ?? "basic"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {course.price ? `₹${Number(course.price).toLocaleString()}` : "Free"}
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        {course.isApproved ? (
                          <Badge variant="default" className="bg-green-600">
                            Approved
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Waiting
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{course.totalStudents ?? 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {course.isApproved ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewCourse(course.id, true)}
                              className="h-8 w-8 p-0"
                              title="View Course"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled
                              className="h-8 w-8 p-0 cursor-not-allowed opacity-50"
                              title="Wait for approval"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCourse(course.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                disabled={deletingCourseId === course.id}
                              >
                                {deletingCourseId === course.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete course "{course.title}". This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

      {/* Create Course Dialog */}
      <CreateCourseDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          setIsCreateDialogOpen(false)
          fetchCourses()
        }}
      />
    </div>
  )
}

