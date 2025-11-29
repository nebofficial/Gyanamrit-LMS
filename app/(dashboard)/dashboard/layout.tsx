"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  BookOpenCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Shield,
  Users,
  Zap,
  BookOpen,
  Settings,
  UserCog,
  Layers,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import { DASHBOARD_ROUTES } from "@/lib/constants"

const navItems = [
  {
    href: "/dashboard/overview",
    label: "Overview",
    icon: LayoutDashboard,
    roles: ["student", "instructor", "admin"],
  },
  {
    href: "/dashboard/quick-action",
    label: "Quick Action",
    icon: Zap,
    roles: ["student", "instructor", "admin"],
  },
  {
    href: "/dashboard/student/courses",
    label: "My Course",
    icon: GraduationCap,
    roles: ["student"],
  },
  {
    href: "/dashboard/instructor/courses",
    label: "Course Management",
    icon: BookOpenCheck,
    roles: ["instructor"],
  },
  {
    href: "/dashboard/instructor/categories",
    label: "Category Management",
    icon: Layers,
    roles: ["instructor"],
  },
  {
    href: "/dashboard/admin/courses",
    label: "Course Management",
    icon: BookOpen,
    roles: ["admin"],
  },
  {
    href: "/dashboard/admin/categories",
    label: "Category Management",
    icon: Layers,
    roles: ["admin"],
  },
  {
    href: "/dashboard/admin/users",
    label: "User Management",
    icon: UserCog,
    roles: ["admin"],
  },
  {
    href: "/dashboard/settings",
    label: "Setting",
    icon: Settings,
    roles: ["student", "instructor", "admin"],
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : ""
      router.replace(`/login${next}`)
    }
  }, [isAuthenticated, loading, pathname, router])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <p className="text-muted-foreground">Preparing your dashboard...</p>
      </div>
    )
  }

  const initials = user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U"

  return (
    <SidebarProvider className="bg-slate-50">
      <div className="flex min-h-screen bg-slate-50 w-full">
        <Sidebar className="border-r border-red-900/20 text-amber-100 shadow-[0_20px_60px_rgba(0,0,0,0.25)] [&_[data-slot='sidebar-inner']]:bg-gradient-to-b [&_[data-slot='sidebar-inner']]:from-red-900 [&_[data-slot='sidebar-inner']]:to-red-950 [&_[data-slot='sidebar-inner']]:text-amber-100">
          <SidebarHeader className="border-b border-red-800/40 bg-red-950/60">
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar className="h-12 w-12 border border-amber-500/40 bg-red-900/40 text-amber-200">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-amber-50">{user?.name ?? "Gyanamrit Member"}</p>
                <p className="text-xs capitalize text-amber-200/80">{user?.role}</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="bg-transparent">
            <SidebarGroup>
              <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wide text-amber-300">
                Navigation
              </SidebarGroupLabel>
              <SidebarMenu>
                {navItems
                  .filter((item) => item.roles.includes(user?.role ?? "student"))
                  .map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href || (item.href !== "/dashboard/overview" && pathname?.startsWith(item.href))}
                        className="text-amber-100 transition-colors hover:bg-red-800/60 data-[active=true]:bg-amber-500/20 data-[active=true]:text-amber-100"
                      >
                        <Link href={item.href} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-red-900/30 bg-red-950/60">
            <Button variant="ghost" className="w-full justify-start gap-2 text-amber-100 hover:bg-red-800/60" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="bg-transparent">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-red-900/30 bg-gradient-to-r from-red-900 to-red-950 px-4 py-3 text-amber-100 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-amber-200 hover:bg-red-800/60" />
              <div>
                <p className="text-sm text-amber-200/80">Welcome back</p>
                <p className="text-lg font-semibold text-white">{user?.name ?? "Learner"}</p>
              </div>
            </div>
            <div className="hidden md:flex gap-2">
              <Button
                size="sm"
                className="bg-amber-300 text-red-950 hover:bg-amber-200 border border-amber-100/60"
                onClick={() => router.push(DASHBOARD_ROUTES[user?.role ?? "student"])}
              >
                My dashboard
              </Button>
              <Button
                size="sm"
                className="bg-red-800 text-amber-100 hover:bg-red-700 border border-red-900/40"
                onClick={() => router.push("/")}
              >
                Visit site
              </Button>
            </div>
          </header>
          <main className="flex-1 space-y-6 bg-white/95 p-6 text-slate-800 shadow-[0_25px_70px_rgba(0,0,0,0.08)]">
            {children}
          </main>
          <footer className="border-t border-red-900/10 bg-gradient-to-r from-red-900 to-red-950 px-6 py-4 text-sm text-amber-100">
            © {new Date().getFullYear()} Gyanamrit LMS · Empowering Sanskrit learning
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

