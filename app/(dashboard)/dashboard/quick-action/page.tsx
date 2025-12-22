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
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">Quick Actions</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1 sm:mt-2">Access frequently used features and tasks</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {actions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg">
                  <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <CardTitle className="text-base sm:text-lg">{action.title}</CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm mt-1 sm:mt-2">{action.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <Button
                className="w-full bg-red-800 hover:bg-red-700 text-amber-100 text-sm sm:text-base"
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

