import { apiFetch } from '@/lib/http'

export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export type AddCategoryPayload = {
  name: string
  description?: string
  slug?: string
  isActive?: boolean
}

export type UpdateCategoryPayload = {
  name?: string
  description?: string
  slug?: string
  isActive?: boolean
}

export async function getAllCategories() {
  return apiFetch<{ status: string; data: Category[] }>('/category', {
    method: 'GET',
  })
}

export async function getCategoryById(categoryId: string) {
  return apiFetch<{ status: string; data: Category }>(`/category/${categoryId}`, {
    method: 'GET',
  })
}

export async function addCategory(token: string, payload: AddCategoryPayload) {
  return apiFetch<{ status: string; message: string; data: Category }>('/category', {
    method: 'POST',
    token,
    body: payload,
  })
}

export async function updateCategory(token: string, categoryId: string, payload: UpdateCategoryPayload) {
  return apiFetch<{ status: string; message: string; data: Category }>(`/category/${categoryId}`, {
    method: 'PATCH',
    token,
    body: payload,
  })
}

export async function deleteCategory(token: string, categoryId: string) {
  return apiFetch<{ status: string; message: string }>(`/category/${categoryId}`, {
    method: 'DELETE',
    token,
  })
}

export async function toggleCategoryStatus(token: string, categoryId: string) {
  return apiFetch<{ status: string; message: string; data: Category }>(`/category/${categoryId}/toggle`, {
    method: 'PATCH',
    token,
  })
}

