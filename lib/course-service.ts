import { apiFetch } from '@/lib/http'

import type { Lesson } from '@/lib/lesson-service'

export type Course = {
  id: string
  title: string
  slug: string
  description?: string
  categoryId?: string
  instructorId?: string
  thumbnail?: string
  level?: 'basic' | 'intermediate' | 'advanced'
  language?: string
  duration?: string
  price?: string | number
  discountPrice?: string | number
  learningOutcomes?: string[]
  requirements?: string[]
  totalStudents?: number
  rating?: number
  totalRatings?: number
  status?: 'draft' | 'pending' | 'published' | 'archived'
  isApproved?: boolean
  createdAt?: string
  updatedAt?: string
  category?: { id: string; name: string }
  instructor?: { id: string; name: string; email: string }
  lessons?: Lesson[]
}

export type AddCoursePayload = {
  title: string
  description?: string
  categoryId?: string
  thumbnail?: string
  level?: 'basic' | 'intermediate' | 'advanced'
  language?: string
  duration?: string
  price?: string | number
  discountPrice?: string | number
  learningOutcomes?: string[]
  requirements?: string[]
}

export type UpdateCoursePayload = {
  title?: string
  description?: string
  categoryId?: string
  thumbnail?: string
  level?: 'basic' | 'intermediate' | 'advanced'
  language?: string
  duration?: string
  price?: string | number
  discountPrice?: string | number
  learningOutcomes?: string[]
  requirements?: string[]
}

export type UpdateCourseStatusPayload = {
  status?: 'draft' | 'pending' | 'published' | 'archived'
  instructorId?: string
  isApproved?: boolean
}

export async function createCourse(token: string, payload: AddCoursePayload) {
  return apiFetch<{ status: string; message: string; data: Course }>('/course', {
    method: 'POST',
    token,
    body: payload,
  })
}

export async function updateCourse(token: string, courseId: string, payload: UpdateCoursePayload) {
  return apiFetch<{ status: string; message: string; data: Course }>(`/course/${courseId}`, {
    method: 'PATCH',
    token,
    body: payload,
  })
}

export async function updateCourseStatus(token: string, courseId: string, payload: UpdateCourseStatusPayload) {
  return apiFetch<{ status: string; message: string; data: Course }>(`/course/${courseId}`, {
    method: 'PUT',
    token,
    body: payload,
  })
}

export async function getCourseById(token: string, courseId: string) {
  return apiFetch<{ status: string; data: Course }>(`/course/${courseId}`, {
    method: 'GET',
    token,
  })
}

