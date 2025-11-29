"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import * as courseService from "@/lib/course-service"
import * as categoryService from "@/lib/category-service"
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

export function CreateCourseDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const { token } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

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
    if (open) {
      fetchCategories()
    }
  }, [open])

  const fetchCategories = async () => {
    setLoadingCategories(true)
    try {
      const response = await categoryService.getAllCategories()
      setCategories(response.data ?? [])
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setLoadingCategories(false)
    }
  }

  const onSubmit = async (values: CourseValues) => {
    if (!token) return

    try {
      const payload: courseService.AddCoursePayload = {
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

      await courseService.createCourse(token, payload)
      toast.success("Course created successfully.")
      form.reset()
      onSuccess()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create course."
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>Add a new course to the platform</DialogDescription>
        </DialogHeader>
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
              {loadingCategories ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading categories...
                </div>
              ) : (
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
              )}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting} className="bg-red-800 hover:bg-red-700">
              {form.formState.isSubmitting ? "Creating..." : "Create Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

