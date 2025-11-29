"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/providers/auth-provider"
import { DASHBOARD_ROUTES } from "@/lib/constants"

export default function DashboardIndexPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || loading) return
    router.replace("/dashboard/overview")
  }, [isAuthenticated, loading, router])

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center text-muted-foreground">
        <p className="text-sm">Loading your personalized dashboard...</p>
      </div>
    </div>
  )
}

