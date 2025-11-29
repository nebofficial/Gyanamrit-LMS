import { apiFetch } from '@/lib/http'

export type SignupPayload = {
  name: string
  email: string
  password: string
  confirmPassword: string
  role?: 'student' | 'instructor' | 'admin'
  contactNumber?: string
}

export type SigninPayload = {
  email: string
  password: string
}

export type ResetPasswordPayload = {
  email: string
  token: string
  password: string
  confirmPassword: string
}

export type AuthResponse = {
  status: string
  message?: string
  token: string
}

export async function signup(payload: SignupPayload) {
  return apiFetch<{ status: string; message: string }>('/auth/signup', {
    method: 'POST',
    body: payload,
  })
}

export async function signin(payload: SigninPayload) {
  return apiFetch<AuthResponse>('/auth/signin', {
    method: 'POST',
    body: payload,
  })
}

export async function requestVerificationToken(email: string) {
  return apiFetch<{ status: string; message: string }>('/auth/request-token', {
    method: 'POST',
    body: { email },
  })
}

export async function verifyAccount(email: string, token: string) {
  return apiFetch<{ status: string; message: string }>(`/auth/verify/${encodeURIComponent(email)}/${token}`, {
    method: 'GET',
  })
}

export async function requestPasswordReset(email: string) {
  return apiFetch<{ status: string; message: string }>('/auth/forget-password', {
    method: 'POST',
    body: { email },
  })
}

export async function resetPassword(payload: ResetPasswordPayload) {
  return apiFetch<{ status: string; message: string }>('/auth/reset-password', {
    method: 'POST',
    body: payload,
  })
}

