import { apiFetch } from '@/lib/http'

export type UserRole = 'student' | 'instructor' | 'admin'

export type UserProfile = {
  id: string
  name: string
  email: string
  role: UserRole
  contactNumber?: string
  country?: string
  bio?: string
  expertise?: string
  experience?: string
  qualification?: string
  isEmailVerified?: boolean
  status?: string
  createdAt?: string
}

export type AddUserPayload = {
  name: string
  email: string
  contactNumber?: string
  role: UserRole
}

export type UpdateUserStatusPayload = {
  status?: string
  role?: UserRole
}

export async function getProfile(token: string) {
  return apiFetch<{ status: string; data: UserProfile }>('/user/profile', {
    method: 'GET',
    token,
  })
}

export async function updateProfile(token: string, payload: Partial<UserProfile>) {
  return apiFetch<{ status: string; data: UserProfile }>('/user/profile', {
    method: 'PATCH',
    token,
    body: payload,
  })
}

export async function deleteProfile(token: string) {
  return apiFetch<{ status: string; message: string }>('/user/profile', {
    method: 'DELETE',
    token,
  })
}

export async function listUsers(token: string) {
  return apiFetch<{ status: string; data: UserProfile[] }>('/user', {
    method: 'GET',
    token,
  })
}

export async function addUser(token: string, payload: AddUserPayload) {
  return apiFetch<{ status: string; message: string; data: UserProfile }>('/user', {
    method: 'POST',
    token,
    body: payload,
  })
}

export async function getUserById(token: string, userId: string) {
  return apiFetch<{ status: string; data: UserProfile }>(`/user/${userId}`, {
    method: 'GET',
    token,
  })
}

export async function deleteUser(token: string, userId: string) {
  return apiFetch<{ status: string; message: string }>(`/user/${userId}`, {
    method: 'DELETE',
    token,
  })
}

export async function updateUserStatus(token: string, userId: string, payload: UpdateUserStatusPayload) {
  return apiFetch<{ status: string; message: string; data: UserProfile }>(`/user/${userId}`, {
    method: 'PUT',
    token,
    body: payload,
  })
}

