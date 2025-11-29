"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, BookOpen, Users, Settings, Layers } from "lucide-react"
import { useRouter } from "next/navigation"

export default function QuickActionPage() {
  const { user } = useAuth()
  const router = useRouter()

  const getQuickActions = () => {
    if (user?.role === "admin") {
      return [
        {
          title: "Approve Courses",
          description: "Review and approve pending course submissions",
          icon: BookOpen,
          href: "/dashboard/admin/courses",
        },
        {
          title: "Manage Categories",
          description: "Organize and update course categories",
          icon: Layers,
          href: "/dashboard/admin/categories",
        },
        {
          title: "Manage Users",
          description: "View and manage all platform users",
          icon: Users,
          href: "/dashboard/admin/users",
        },
        {
          title: "System Settings",
          description: "Configure platform-wide settings",
          icon: Settings,
          href: "/dashboard/settings",
        },
      ]
    } else if (user?.role === "instructor") {
      return [
        {
          title: "Create Course",
          description: "Start building a new course",
          icon: BookOpen,
          href: "/dashboard/instructor",
        },
        {
          title: "Manage Courses",
          description: "Edit and update your existing courses",
          icon: BookOpen,
          href: "/dashboard/instructor/courses",
        },
        {
          title: "Profile Settings",
          description: "Update your instructor profile",
          icon: Settings,
          href: "/dashboard/settings",
        },
      ]
    } else {
      return [
        {
          title: "Browse Courses",
          description: "Explore available courses to enroll",
          icon: BookOpen,
          href: "/",
        },
        {
          title: "My Courses",
          description: "View your enrolled courses",
          icon: BookOpen,
          href: "/dashboard/student/courses",
        },
        {
          title: "Account Settings",
          description: "Manage your account preferences",
          icon: Settings,
          href: "/dashboard/settings",
        },
      ]
    }
  }

  const actions = getQuickActions()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Quick Actions</h1>
        <p className="text-slate-600 mt-2">Access frequently used features and tasks</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <action.icon className="h-5 w-5 text-amber-600" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </div>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-red-800 hover:bg-red-700 text-amber-100"
                onClick={() => router.push(action.href)}
              >
                Go to {action.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

