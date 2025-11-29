"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import * as courseService from "@/lib/course-service"
import * as categoryService from "@/lib/category-service"
import * as dashboardService from "@/lib/dashboard-service"
import type { Category } from "@/lib/category-service"

const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  thumbnail: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  level: z.enum(["basic", "intermediate", "advanced"]).optional(),
  language: z.string().optional(),
  duration: z.string().optional(),
  price: z.string().optional(),
  discountPrice: z.string().optional(),
  learningOutcomes: z.string().optional(),
  requirements: z.string().optional(),
})

type CourseValues = z.infer<typeof courseSchema>

export default function EditCoursePage() {
  const params = useParams<{ courseId: string }>()
  const router = useRouter()
  const { token, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])

  const form = useForm<CourseValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      thumbnail: "",
      level: "basic",
      language: "English",
      duration: "",
      price: "",
      discountPrice: "",
      learningOutcomes: "",
      requirements: "",
    },
  })

  useEffect(() => {
    if (!token || !params.courseId) return
    fetchCourseData()
    fetchCategories()
  }, [token, params.courseId])

  const fetchCourseData = async () => {
    if (!token || !params.courseId) return
    setLoading(true)
    try {
      const allCoursesRes = await dashboardService.getAdminCourses(token)
      const course = allCoursesRes.data?.find((c) => c.id === params.courseId)

      if (course) {
        form.reset({
          title: course.title ?? "",
          description: course.description ?? "",
          categoryId: course.categoryId ?? "",
          thumbnail: course.thumbnail ?? "",
          level: (course.level as "basic" | "intermediate" | "advanced") ?? "basic",
          language: course.language ?? "English",
          duration: course.duration ?? "",
          price: course.price ? String(course.price) : "",
          discountPrice: course.discountPrice ? String(course.discountPrice) : "",
          learningOutcomes: Array.isArray(course.learningOutcomes)
            ? course.learningOutcomes.join("\n")
            : typeof course.learningOutcomes === "string"
              ? course.learningOutcomes
              : "",
          requirements: Array.isArray(course.requirements)
            ? course.requirements.join("\n")
            : typeof course.requirements === "string"
              ? course.requirements
              : "",
        })
      } else {
        toast.error("Course not found")
        router.back()
      }
    } catch (error) {
      console.error("Failed to fetch course:", error)
      toast.error("Unable to load course data.")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories()
      setCategories(response.data ?? [])
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const onSubmit = async (values: CourseValues) => {
    if (!token || !params.courseId) return

    try {
      const payload: courseService.UpdateCoursePayload = {
        title: values.title,
        description: values.description || undefined,
        categoryId: values.categoryId || undefined,
        thumbnail: values.thumbnail || undefined,
        level: values.level,
        language: values.language || undefined,
        duration: values.duration || undefined,
        price: values.price ? Number(values.price) : undefined,
        discountPrice: values.discountPrice ? Number(values.discountPrice) : undefined,
        learningOutcomes: values.learningOutcomes
          ? values.learningOutcomes.split("\n").filter((item) => item.trim())
          : undefined,
        requirements: values.requirements
          ? values.requirements.split("\n").filter((item) => item.trim())
          : undefined,
      }

      await courseService.updateCourse(token, params.courseId, payload)
      toast.success("Course updated successfully.")
      router.push(`/dashboard/admin/courses/${params.courseId}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update course."
      toast.error(message)
    }
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Course</h1>
          <p className="text-slate-600 mt-1">Update course information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Update the course information below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                placeholder="Classical Sanskrit Mastery Program"
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Immersive pathway through Sanskrit grammar, literature, and chanting."
                {...form.register("description")}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="categoryId">Category</Label>
                <select
                  id="categoryId"
                  className="w-full rounded-md border border-amber-900/40 bg-amber-50/95 px-3 py-2 text-sm text-black shadow-[0_4px_18px_rgba(120,53,15,0.25)] outline-none transition-[color,box-shadow] focus-visible:border-amber-800 focus-visible:ring-amber-800/40 focus-visible:ring-[3px]"
                  {...form.register("categoryId")}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="level">Level</Label>
                <select
                  id="level"
                  className="w-full rounded-md border border-amber-900/40 bg-amber-50/95 px-3 py-2 text-sm text-black shadow-[0_4px_18px_rgba(120,53,15,0.25)] outline-none transition-[color,box-shadow] focus-visible:border-amber-800 focus-visible:ring-amber-800/40 focus-visible:ring-[3px]"
                  {...form.register("level")}
                >
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <Input id="language" placeholder="Sanskrit & English" {...form.register("language")} />
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" placeholder="12 weeks" {...form.register("duration")} />
              </div>

              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" placeholder="4999" {...form.register("price")} />
              </div>

              <div>
                <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                <Input id="discountPrice" type="number" placeholder="2999" {...form.register("discountPrice")} />
              </div>
            </div>

            <div>
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                type="url"
                placeholder="https://assets.gyanamrit.org/images/sanskrit-course.jpg"
                {...form.register("thumbnail")}
              />
              {form.formState.errors.thumbnail && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.thumbnail.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="learningOutcomes">Learning Outcomes (one per line)</Label>
              <Textarea
                id="learningOutcomes"
                rows={3}
                placeholder="Master Panini's sutras&#10;Refine Vedic chanting pronunciation"
                {...form.register("learningOutcomes")}
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements (one per line)</Label>
              <Textarea
                id="requirements"
                rows={3}
                placeholder="Read Devanagari script&#10;Commit to daily recitation practice"
                {...form.register("requirements")}
              />
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="bg-red-800 hover:bg-red-700">
                {form.formState.isSubmitting ? "Updating..." : "Update Course"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

