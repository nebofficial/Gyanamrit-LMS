import { API_BASE_URL } from '@/lib/constants'

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  token?: string | null
  body?: unknown
  headers?: HeadersInit
  cache?: RequestCache
  onUploadProgress?: (progress: number) => void
}

export class ApiError extends Error {
  status?: number
  data?: unknown

  constructor(message: string, status?: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url)

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', token, body, headers, cache = 'no-store', onUploadProgress } = options

  const url = isAbsoluteUrl(path) ? path : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  
  const isFormData = body instanceof FormData
  
  const init: RequestInit = {
    method,
    headers: {
      // Browser handles Content-Type for FormData (includes boundary)
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(headers ?? {}),
    },
    cache,
  }

  if (body && method !== 'GET') {
    if (isFormData) {
      init.body = body as FormData
    } else {
    init.body = JSON.stringify(body)
    }
  }

  if (token) {
    ;(init.headers as Record<string, string>).Authorization = `Bearer ${token}`
  }

  // Use XHR for file uploads so we can track progress
  if (isFormData && onUploadProgress) {
    return new Promise<T>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          onUploadProgress(percentComplete)
        }
      })
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const contentType = xhr.getResponseHeader('content-type')
            const isJson = contentType?.includes('application/json')
            const data = isJson ? JSON.parse(xhr.responseText) : xhr.responseText
            resolve(data as T)
          } catch (error) {
            reject(new ApiError('Failed to parse response', xhr.status))
          }
        } else {
          try {
            const contentType = xhr.getResponseHeader('content-type')
            const isJson = contentType?.includes('application/json')
            const data = isJson ? JSON.parse(xhr.responseText) : xhr.responseText
            const message = (isJson && (data?.message ?? data?.error)) || xhr.statusText || 'Request failed'
            reject(new ApiError(message, xhr.status, data))
          } catch {
            reject(new ApiError(xhr.statusText || 'Request failed', xhr.status))
          }
        }
      })
      
      xhr.addEventListener('error', () => {
        reject(new ApiError('Network error', 0))
      })
      
      xhr.addEventListener('abort', () => {
        reject(new ApiError('Request aborted', 0))
      })
      
      xhr.open(method || 'POST', url)
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }
      
      // Don't override Content-Type - browser needs to set boundary
      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          if (key.toLowerCase() !== 'content-type') {
            xhr.setRequestHeader(key, value as string)
          }
        })
      }
      
      xhr.send(body as FormData)
    })
  } else {
  const response = await fetch(url, init)
  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')
  const data = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message = (isJson && (data?.message ?? data?.error)) || response.statusText || 'Request failed'
    throw new ApiError(message, response.status, data)
  }

  return data as T
  }
}

