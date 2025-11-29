"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { CategoryManagement } from "@/components/dashboard/category-management"
import { useAuth } from "@/components/providers/auth-provider"
import { DASHBOARD_ROUTES } from "@/lib/constants"

export default function AdminCategoriesPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.role && user.role !== "admin") {
      router.replace(DASHBOARD_ROUTES[user.role] ?? "/dashboard")
    }
  }, [router, user?.role])

  return <CategoryManagement title="Admin · Category Management" canManage />
}

