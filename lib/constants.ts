export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'https://gyanamritlms.onrender.com/v1/api'

export const AUTH_STORAGE_KEY = 'gyanamrit_auth'

export const DASHBOARD_ROUTES: Record<string, string> = {
  // After login, always go to the unified overview dashboard
  student: '/dashboard/overview',
  instructor: '/dashboard/overview',
  admin: '/dashboard/overview',
}

export const PUBLIC_ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  verify: '/verify',
  forgotPassword: '/forgot-password',
}

