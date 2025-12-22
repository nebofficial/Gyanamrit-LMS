"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Pencil, Trash2, Eye, BookOpen, CheckCircle, Search, X } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/components/providers/auth-provider"
import { DASHBOARD_ROUTES } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import * as categoryService from "@/lib/category-service"
import * as userService from "@/lib/user-service"
import type { Course } from "@/lib/dashboard-service"
import { CreateCourseDialog } from "./create-course-dialog"

export default function AdminCoursesPage() {
  const { token, user } = useAuth()
  const router = useRouter()
  const [adminCourses, setAdminCourses] = useState<Course[]>([])
  const [instructorCourses, setInstructorCourses] = useState<Course[]>([])
  const [loadingAdmin, setLoadingAdmin] = useState(true)
  const [loadingInstructor, setLoadingInstructor] = useState(true)
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [updatingCourseId, setUpdatingCourseId] = useState<string | null>(null)
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInstructor, setSelectedInstructor] = useState<string>("all")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("all")

  useEffect(() => {
    if (user?.role !== "admin") {
      router.replace(DASHBOARD_ROUTES[user?.role ?? "student"])
    }
  }, [router, user?.role])

  useEffect(() => {
    if (!token) return
    fetchAllCourses()
  }, [token])

  const fetchAllCourses = async () => {
    if (!token || !user?.id) return
    setLoadingAdmin(true)
    setLoadingInstructor(true)
    try {
      const [coursesResponse, categoriesResponse] = await Promise.allSettled([
        dashboardService.getAdminCourses(token),
        categoryService.getAllCategories(),
      ])
      
      const allCourses = coursesResponse.status === "fulfilled" ? (coursesResponse.value.data ?? []) : []
      const allCategories = categoriesResponse.status === "fulfilled" ? (categoriesResponse.value.data ?? []) : []
      
      const uniqueInstructorIds = [...new Set(allCourses.map(c => c.instructorId).filter((id): id is string => Boolean(id)))]
      const instructorPromises = uniqueInstructorIds.map(id => 
        userService.getUserById(token, id).catch(() => null)
      )
      const instructorResponses = await Promise.allSettled(instructorPromises)
      const instructorsMap = new Map<string, { id: string; name: string; email: string }>()
      
      instructorResponses.forEach((response, index) => {
        if (response.status === "fulfilled" && response.value?.data) {
          const instructor = response.value.data
          instructorsMap.set(uniqueInstructorIds[index], {
            id: instructor.id,
            name: instructor.name,
            email: instructor.email,
          })
        }
      })
      
      // Create categories map
      const categoriesMap = new Map<string, { id: string; name: string }>()
      allCategories.forEach(cat => {
        categoriesMap.set(cat.id, { id: cat.id, name: cat.name })
      })
      
      // Enrich courses with category and instructor data
      const enrichedCourses: Course[] = allCourses.map(course => ({
        ...course,
        category: course.categoryId ? (categoriesMap.get(course.categoryId) ?? undefined) : undefined,
        instructor: course.instructorId ? (instructorsMap.get(course.instructorId) ?? undefined) : undefined,
      }))
      
      console.log("All courses fetched:", enrichedCourses.length)
      console.log("Current admin user ID:", user.id)
      
      // Separate courses into admin-created and instructor-created
      // Admin-created courses: courses where instructorId matches the current admin user
      const adminCreatedCourses = enrichedCourses.filter((course) => {
        // Check if instructorId exists and matches current admin
        if (!course.instructorId) return false
        // Use string comparison to handle UUID strings
        const isAdminCourse = String(course.instructorId) === String(user.id)
        return isAdminCourse
      })
      
      // Instructor-created courses: ALL courses where instructorId exists and does NOT match the current admin user
      // This includes ALL courses created by instructors, regardless of status (draft, pending, published, archived)
      const instructorCreatedCourses = enrichedCourses.filter((course) => {
        // Must have an instructorId
        if (!course.instructorId) return false
        // Must not be created by current admin - show ALL instructor-created courses
        const isInstructorCourse = String(course.instructorId) !== String(user.id)
        return isInstructorCourse
      })
      
      console.log("Total courses:", enrichedCourses.length)
      console.log("Admin courses:", adminCreatedCourses.length)
      console.log("Instructor courses:", instructorCreatedCourses.length)
      
      setAdminCourses(adminCreatedCourses)
      setInstructorCourses(instructorCreatedCourses)
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      toast.error("Unable to load courses.")
    } finally {
      setLoadingAdmin(false)
      setLoadingInstructor(false)
    }
  }

  const fetchAdminCourses = fetchAllCourses
  const fetchInstructorCourses = fetchAllCourses

  // Get unique instructors and levels for filters
  const allCoursesForFilters = useMemo(() => {
    return [...adminCourses, ...instructorCourses]
  }, [adminCourses, instructorCourses])

  const instructors = useMemo(() => {
    const unique = new Set<string>()
    allCoursesForFilters.forEach((course) => {
      if (course.instructor?.name) {
        unique.add(course.instructor.name)
      }
    })
    return Array.from(unique).sort()
  }, [allCoursesForFilters])

  const levels = useMemo(() => {
    const unique = new Set<string>()
    allCoursesForFilters.forEach((course) => {
      if (course.level) {
        unique.add(course.level)
      }
    })
    return Array.from(unique).sort()
  }, [allCoursesForFilters])

  // Filter courses based on search and filters
  const filterCourses = (courses: Course[]) => {
    let filtered = courses

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
  }

  const filteredAdminCourses = useMemo(() => filterCourses(adminCourses), [adminCourses, searchQuery, selectedInstructor, selectedLevel, selectedDate])
  const filteredInstructorCourses = useMemo(() => filterCourses(instructorCourses), [instructorCourses, searchQuery, selectedInstructor, selectedLevel, selectedDate])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedInstructor("all")
    setSelectedLevel("all")
    setSelectedDate("all")
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!token) return
    setDeletingCourseId(courseId)
    try {
      const response = await dashboardService.deleteCourse(token, courseId)
      console.log("Delete course response:", response)
      toast.success(response.message || "Course deleted successfully.")
      fetchAdminCourses()
      fetchInstructorCourses()
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

  const handleViewCourse = (courseId: string) => {
    // Pass course data via query param or state if needed
    router.push(`/dashboard/admin/courses/${courseId}`)
  }

  const handleEditCourse = (courseId: string) => {
    router.push(`/dashboard/admin/courses/${courseId}/edit`)
  }

  const openStatusDialog = (course: Course) => {
    setSelectedCourse(course)
    setSelectedStatus(course.status ?? "draft")
    setIsStatusDialogOpen(true)
  }

  const handleUpdateStatus = async () => {
    if (!token || !selectedCourse || !selectedStatus) return
    setUpdatingCourseId(selectedCourse.id)
    try {
      await courseService.updateCourseStatus(token, selectedCourse.id, {
        status: selectedStatus as "draft" | "pending" | "published" | "archived",
        isApproved: selectedStatus === "published" ? true : selectedCourse.isApproved,
      })
      toast.success("Course status updated successfully.")
      setIsStatusDialogOpen(false)
      setSelectedCourse(null)
      setSelectedStatus("")
      fetchAllCourses()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update course status."
      toast.error(message)
    } finally {
      setUpdatingCourseId(null)
    }
  }

  const renderCourseTable = (courses: Course[], filteredCourses: Course[], isLoading: boolean, isAdminTab: boolean) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      )
    }

    if (courses.length === 0) {
      return <p className="text-sm text-muted-foreground py-8 text-center">No courses found.</p>
    }

    if (filteredCourses.length === 0) {
      return <p className="text-sm text-muted-foreground py-8 text-center">No courses match your search criteria. Try adjusting your filters.</p>
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Instructor</TableHead>
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
                <TableCell>{course.instructor?.name ?? "—"}</TableCell>
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
                  <Badge variant={course.isApproved ? "default" : "secondary"}>
                    {course.isApproved ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>{course.totalStudents ?? 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewCourse(course.id)}
                      className="h-8 w-8 p-0"
                      title="View Course"
                    >
                      <Eye className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openStatusDialog(course)}
                      className="h-8 w-8 p-0"
                      title="Update Status"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditCourse(course.id)}
                      className="h-8 w-8 p-0"
                      title="Edit Course"
                    >
                      <Pencil className="h-4 w-4 text-green-600" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={deletingCourseId === course.id}
                        >
                          {deletingCourseId === course.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-green-600" />
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
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">Course Management</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 sm:mt-2">Manage all courses on the platform</p>
        </div>
      </div>

      <Tabs defaultValue="admin" className="space-y-4">
        <TabsList>
          <TabsTrigger value="admin">Admin Courses</TabsTrigger>
          <TabsTrigger value="instructor">Instructor Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Courses</CardTitle>
                  <CardDescription>Manage all courses across the platform</CardDescription>
                </div>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="gap-2 bg-red-800 hover:bg-red-700 text-amber-100"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <span className="hidden sm:inline">Create Course</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </div>
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
                {filteredAdminCourses.length !== adminCourses.length && (
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredAdminCourses.length} of {adminCourses.length} courses
                  </p>
                )}
              </div>
              {renderCourseTable(adminCourses, filteredAdminCourses, loadingAdmin, true)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructor" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <div>
                  <CardTitle>Instructor Courses</CardTitle>
                  <CardDescription>All courses created by instructors</CardDescription>
                </div>
              </div>
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
                {filteredInstructorCourses.length !== instructorCourses.length && (
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredInstructorCourses.length} of {instructorCourses.length} courses
                  </p>
                )}
              </div>
              {renderCourseTable(instructorCourses, filteredInstructorCourses, loadingInstructor, false)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateCourseDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          fetchAdminCourses()
          setIsCreateDialogOpen(false)
        }}
      />

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Course Status</DialogTitle>
            <DialogDescription>Change the status of "{selectedCourse?.title}"</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedStatus === "published" && !selectedCourse?.isApproved && (
              <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                Note: Publishing this course will automatically approve it.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updatingCourseId === selectedCourse?.id || !selectedStatus}
              className="bg-red-800 hover:bg-red-700"
            >
              {updatingCourseId === selectedCourse?.id ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

