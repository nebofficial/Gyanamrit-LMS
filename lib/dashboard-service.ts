import { apiFetch } from '@/lib/http'

export type Course = {
  id: string
  title: string
  slug: string
  description?: string
  categoryId?: string
  instructorId?: string
  thumbnail?: string
  level?: string
  language?: string
  duration?: string
  price?: string | number
  discountPrice?: string | number
  learningOutcomes?: string[]
  requirements?: string[]
  status?: string
  isApproved?: boolean
  totalStudents?: number
  rating?: number
  totalRatings?: number
  createdAt?: string
  updatedAt?: string
  category?: { id: string; name: string }
  instructor?: { id: string; name: string; email: string }
}

export type Enrollment = {
  id: string
  userId: string
  courseId: string
  progress?: number
  paymentStatus?: string
  enrolledAt?: string
  completedAt?: string
  course?: Course
  user?: { id: string; name: string; email: string }
}

export async function getPublicCourses() {
  return apiFetch<{ status: string; data: Course[] }>('/course', { method: 'GET' })
}

export async function getInstructorCourses(token: string) {
  return apiFetch<{ status: string; data: Course[] }>('/course/for-instructor', {
    method: 'GET',
    token,
  })
}

export async function getAdminCourses(token: string) {
  return apiFetch<{ status: string; data: Course[] }>('/course/for-admin', {
    method: 'GET',
    token,
  })
}

export async function getEnrollments(token: string) {
  return apiFetch<{ status: string; data: Enrollment[] }>('/enrollment/course', {
    method: 'GET',
    token,
  })
}

export async function deleteCourse(token: string, courseId: string) {
  return apiFetch<{ status: string; message: string; data?: unknown }>(`/course/${courseId}`, {
    method: 'DELETE',
    token,
  })
}

export async function addEnrollment(token: string, payload: { userId: string; courseId: string; paymentStatus?: string }) {
  // Backend endpoint: POST /enrollment (ADMIN only)
  return apiFetch<{ status: string; message: string; data: Enrollment }>('/enrollment', {
    method: 'POST',
    token,
    body: payload,
  })
}

export async function updateEnrollment(token: string, enrollmentId: string, payload: { progress?: number; paymentStatus?: string }) {
  // Backend endpoint: PUT /enrollment/:enrollId
  return apiFetch<{ status: string; message: string }>(`/enrollment/${enrollmentId}`, {
    method: 'PUT',
    token,
    body: payload,
  })
}

export async function deleteEnrollment(token: string, enrollmentId: string) {
  return apiFetch<{ status: string; message: string }>(`/enrollment/${enrollmentId}`, {
    method: 'DELETE',
    token,
  })
}

export async function getEnrollmentsByCourse(token: string, courseId: string) {
  // Backend endpoint: GET /enrollment/:courseId/student
  return apiFetch<{ status: string; message: string; data: Enrollment[] }>(`/enrollment/${courseId}/student`, {
    method: 'GET',
    token,
  })
}

