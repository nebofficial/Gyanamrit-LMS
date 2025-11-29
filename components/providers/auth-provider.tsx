"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

import type { SigninPayload } from "@/lib/auth-service"
import * as authService from "@/lib/auth-service"
import type { UserProfile, UserRole } from "@/lib/user-service"
import * as userService from "@/lib/user-service"
import { AUTH_STORAGE_KEY } from "@/lib/constants"
import { decodeJwt } from "@/lib/jwt"

type StoredSession = {
  token: string
  user: UserProfile | null
}

type AuthContextValue = {
  user: UserProfile | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (payload: SigninPayload & { remember?: boolean }) => Promise<UserProfile | null>
  logout: () => void
  refreshProfile: () => Promise<UserProfile | null>
  updateProfile: (payload: Partial<UserProfile>) => Promise<UserProfile | null>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// Build user object from JWT token when profile fetch fails
const buildUserFromToken = (token: string, overrides?: Partial<UserProfile>): UserProfile | null => {
  const decoded = decodeJwt<{ id?: string; role?: UserRole }>(token)
  if (!decoded?.id) return null

  return {
    id: decoded.id,
    role: decoded.role ?? "student",
    email: overrides?.email ?? "",
    name: overrides?.name ?? overrides?.email ?? "Gyanamrit Learner",
    ...overrides,
  }
}

const persistSession = (session: StoredSession | null) => {
  if (typeof window === "undefined") return
  if (!session) {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) {
      setLoading(false)
      return
    }
    try {
      const parsed = JSON.parse(raw) as StoredSession
      setToken(parsed.token)
      setUser(parsed.user)
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (!token) return null
    try {
      const response = await userService.getProfile(token)
      const nextUser = response.data
      setUser(nextUser)
      persistSession({ token, user: nextUser })
      return nextUser
    } catch {
      if (!user) {
        const fallback = buildUserFromToken(token)
        setUser(fallback)
        persistSession({ token, user: fallback })
        return fallback
      }
      return user
    }
  }, [token, user])

  useEffect(() => {
    if (!token || user) {
      setLoading(false)
      return
    }
    refreshProfile().finally(() => setLoading(false))
  }, [refreshProfile, token, user])

  const login = useCallback(
    async (payload: SigninPayload & { remember?: boolean }) => {
      const response = await authService.signin({ email: payload.email, password: payload.password })
      const accessToken = response.token
      setToken(accessToken)

      let nextUser: UserProfile | null = null
      try {
        const profile = await userService.getProfile(accessToken)
        nextUser = profile.data
      } catch {
        nextUser = buildUserFromToken(accessToken, { email: payload.email }) ?? {
          id: "",
          email: payload.email,
          role: "student",
          name: payload.email,
        }
      }

      setUser(nextUser)
      persistSession({ token: accessToken, user: nextUser })

      // Clear session on page close if "remember me" wasn't checked
      if (!payload.remember) {
        if (typeof window !== "undefined") {
          window.addEventListener(
            "beforeunload",
            () => {
              persistSession(null)
            },
            { once: true },
          )
        }
      }

      return nextUser
    },
    [],
  )

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    persistSession(null)
  }, [])

  const updateProfile = useCallback(
    async (payload: Partial<UserProfile>) => {
      if (!token) return null
      try {
        const response = await userService.updateProfile(token, payload)
        const updated = response.data
        setUser(updated)
        persistSession({ token, user: updated })
        return updated
      } catch {
        // Update locally if API call fails
        const merged = { ...(user ?? buildUserFromToken(token, { email: payload.email ?? user?.email })), ...payload }
        setUser(merged || null)
        persistSession({ token, user: merged || null })
        return merged || null
      }
    },
    [token, user],
  )

  const deleteAccount = useCallback(async () => {
    if (!token) return
    try {
      await userService.deleteProfile(token)
    } catch {
      // Still log out even if API call fails
    } finally {
      logout()
    }
  }, [logout, token])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout,
      refreshProfile,
      updateProfile,
      deleteAccount,
    }),
    [deleteAccount, loading, login, logout, refreshProfile, token, updateProfile, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

