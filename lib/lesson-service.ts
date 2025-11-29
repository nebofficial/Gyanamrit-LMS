import { apiFetch } from '@/lib/http'

export type Lesson = {
  id: string
  courseId: string
  title: string
  description?: string
  videoUrl?: string
  fileUrl?: string
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

export type AddLessonPayload = {
  title: string
  description?: string
  videoUrl?: string
  fileUrl?: string
  imageUrl?: string
  videoFile?: File
  fileFile?: File
  imageFile?: File
}

export type UpdateLessonPayload = {
  title?: string
  description?: string
  videoUrl?: string
  fileUrl?: string
  imageUrl?: string
}

export async function addLesson(
  token: string,
  courseId: string,
  payload: AddLessonPayload,
  onUploadProgress?: (progress: number) => void
) {
  // Check if we have files to upload (FormData)
  const hasFiles = payload.videoFile || payload.fileFile || payload.imageFile
  
  if (hasFiles) {
    const formData = new FormData()
    // Always include required fields - ensure title is always present
    formData.append('title', payload.title)
    // Include optional fields
    if (payload.description) {
      formData.append('description', payload.description)
    }
    // For URLs, append if provided
    if (payload.videoUrl) {
      formData.append('videoUrl', payload.videoUrl)
    }
    if (payload.fileUrl) {
      formData.append('fileUrl', payload.fileUrl)
    }
    if (payload.imageUrl) {
      formData.append('imageUrl', payload.imageUrl)
    }
    // Append files if they exist - use field names that backend expects
    if (payload.videoFile) {
      formData.append('video', payload.videoFile)
    }
    if (payload.fileFile) {
      formData.append('file', payload.fileFile)
    }
    if (payload.imageFile) {
      formData.append('image', payload.imageFile)
    }
    
    return apiFetch<{ status: string; message: string; data: Lesson }>(`/course/${courseId}/lesson`, {
      method: 'POST',
      token,
      body: formData,
      onUploadProgress,
    })
  } else {
    // Regular JSON payload (URLs only)
    return apiFetch<{ status: string; message: string; data: Lesson }>(`/course/${courseId}/lesson`, {
      method: 'POST',
      token,
      body: {
        title: payload.title,
        description: payload.description,
        videoUrl: payload.videoUrl,
        fileUrl: payload.fileUrl,
        imageUrl: payload.imageUrl,
      },
    })
  }
}

export async function getLessonsByCourse(token: string, courseId: string) {
  return apiFetch<{ status: string; data: Lesson[] }>(`/course/${courseId}`, {
    method: 'GET',
    token,
  })
}

export async function getLessonById(token: string, courseId: string, lessonId: string) {
  return apiFetch<{ status: string; data: Lesson }>(`/course/${courseId}/${lessonId}`, {
    method: 'GET',
    token,
  })
}

export async function updateLesson(token: string, courseId: string, lessonId: string, payload: UpdateLessonPayload) {
  return apiFetch<{ status: string; message: string; data: Lesson }>(`/course/${courseId}/lesson/${lessonId}`, {
    method: 'PATCH',
    token,
    body: payload,
  })
}

export async function deleteLesson(token: string, courseId: string, lessonId: string) {
  return apiFetch<{ status: string; message: string }>(`/course/${courseId}/lesson/${lessonId}`, {
    method: 'DELETE',
    token,
  })
}

