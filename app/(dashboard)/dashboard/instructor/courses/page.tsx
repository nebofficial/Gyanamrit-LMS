"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Pencil, Trash2, Eye, BookOpen, Plus, Clock, Search, X } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/components/providers/auth-provider"
import { DASHBOARD_ROUTES } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("all")

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
      try {
        const response = await dashboardService.getInstructorCourses(token)
        setCourses(response.data ?? [])
      } catch (instructorError) {
        // Fallback to admin endpoint if instructor endpoint fails
        console.warn("Instructor endpoint failed, trying main endpoint:", instructorError)
        try {
          const response = await dashboardService.getAdminCourses(token)
          const allCourses = response.data ?? []
          const myCourses = allCourses.filter((course) => course.instructorId === user.id)
          setCourses(myCourses)
        } catch (fallbackError) {
          console.error("Both endpoints failed:", fallbackError)
          throw instructorError
        }
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      const errorMessage = error instanceof Error ? error.message : "Unable to load courses."
      toast.error(errorMessage)
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

  // Get unique levels for filters
  const levels = useMemo(() => {
    const unique = new Set<string>()
    courses.forEach((course) => {
      if (course.level) {
        unique.add(course.level)
      }
    })
    return Array.from(unique).sort()
  }, [courses])

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    let filtered = courses

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query) ||
          course.category?.name?.toLowerCase().includes(query)
      )
    }

    // Level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter((course) => course.level === selectedLevel)
    }

    // Date filter (course creation date)
    if (selectedDate !== "all") {
      const now = new Date()
      filtered = filtered.filter((course) => {
        if (!course.createdAt) return false
        const courseDate = new Date(course.createdAt)
        
        switch (selectedDate) {
          case "today":
            return courseDate.toDateString() === now.toDateString()
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return courseDate >= weekAgo
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return courseDate >= monthAgo
          case "year":
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
            return courseDate >= yearAgo
          default:
            return true
        }
      })
    }

    return filtered
  }, [courses, searchQuery, selectedLevel, selectedDate])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedLevel("all")
    setSelectedDate("all")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">My Courses</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 sm:mt-2">Manage your courses and their status</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-red-800 hover:bg-red-700 text-white text-sm sm:text-base"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-400" />
          <span className="hidden sm:inline">Create Course</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
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
            <>
              {/* Search and Filter Bar */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search courses by title, description, or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {(searchQuery || selectedLevel !== "all" || selectedDate !== "all") && (
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
                {filteredCourses.length !== courses.length && (
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredCourses.length} of {courses.length} courses
                  </p>
                )}
              </div>
              {filteredCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No courses match your search criteria. Try adjusting your filters.
                </p>
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
                      {filteredCourses.map((course) => (
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
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            <Clock className="h-3 w-3 mr-1 text-red-600" />
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
                              <Eye className="h-4 w-4 text-green-600" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled
                              className="h-8 w-8 p-0 cursor-not-allowed opacity-50"
                              title="Wait for approval"
                            >
                              <Clock className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCourse(course.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4 text-green-600" />
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
                                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                                ) : (
                                  <Trash2 className="h-4 w-4 text-red-600" />
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
            </>
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

