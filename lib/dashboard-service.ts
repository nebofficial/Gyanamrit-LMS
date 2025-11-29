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

export async function addEnrollment(token: string, payload: { userId: string; courseId: string }) {
  return apiFetch<{ status: string; message: string; data: Enrollment }>('/enrollment', {
    method: 'POST',
    token,
    body: payload,
  })
}

export async function updateEnrollment(token: string, enrollmentId: string, payload: { progress?: number; paymentStatus?: string }) {
  return apiFetch<{ status: string; message: string; data: Enrollment }>(`/enrollment/${enrollmentId}`, {
    method: 'PATCH',
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
  // Backend doesn't have course-specific endpoint, so get all enrollments and filter by courseId
  const allEnrollments = await apiFetch<{ status: string; data: Enrollment[] }>('/enrollment/course', {
    method: 'GET',
    token,
  })
  
  // Normalize courseId for comparison (handle UUID string variations)
  const normalizedCourseId = String(courseId).toLowerCase().trim()
  
  // Filter enrollments by courseId (case-insensitive comparison)
  const filtered = allEnrollments.data?.filter((e) => {
    const enrollmentCourseId = String(e.courseId || '').toLowerCase().trim()
    return enrollmentCourseId === normalizedCourseId
  }) ?? []
  
  console.log('getEnrollmentsByCourse:', {
    courseId,
    normalizedCourseId,
    totalEnrollments: allEnrollments.data?.length ?? 0,
    filteredCount: filtered.length,
    sampleEnrollment: allEnrollments.data?.[0],
  })
  
  return {
    ...allEnrollments,
    data: filtered,
  }
}

