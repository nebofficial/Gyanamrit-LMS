"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/providers/auth-provider"
import { DASHBOARD_ROUTES } from "@/lib/constants"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()

  const dashboardRoute = user?.role ? DASHBOARD_ROUTES[user.role] ?? "/dashboard" : "/dashboard"

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-red-900 to-red-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-md flex items-center justify-center text-red-900 font-bold text-sm shadow-md">
              GM
            </div>
            <span className="font-serif font-bold text-amber-100 hidden sm:inline text-lg">Gyanamrit</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-amber-100 hover:text-white text-sm font-medium transition">
              Home
            </Link>
            <Link href="/blog" className="text-amber-100 hover:text-white text-sm font-medium transition">
            Blog
            </Link>
            
            <Link href="/about" className="text-amber-100 hover:text-white text-sm font-medium transition">
              About
            </Link>
            <Link href="/contact" className="text-amber-100 hover:text-white text-sm font-medium transition">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  className="bg-amber-400 text-red-900 hover:bg-amber-300 font-semibold"
                  onClick={() => router.push(dashboardRoute)}
                >
                  My Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="text-amber-100 hover:text-white hover:bg-red-800"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
            <Button
              variant="ghost"
              className="text-amber-100 hover:text-white hover:bg-red-800"
                  onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-red-900 font-semibold"
                  onClick={() => router.push("/signup")}
            >
              Sign Up
            </Button>
              </>
            )}
          </div>

          <button className="md:hidden text-amber-100" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-red-700 bg-red-800">
            <Link href="/" className="block py-2 text-amber-100 hover:text-white text-sm font-medium">
              Home
            </Link>
            <Link href="/blog" className="block py-2 text-amber-100 hover:text-white text-sm font-medium">
              Blog
            </Link>
            
            <Link href="/about" className="block py-2 text-amber-100 hover:text-white text-sm font-medium">
              About
            </Link>
            <Link href="/contact" className="block py-2 text-amber-100 hover:text-white text-sm font-medium">
              Contact
            </Link>
            <div className="flex gap-3 mt-4">
              {isAuthenticated ? (
                <>
                  <Button
                    className="flex-1 bg-amber-400 text-red-900 hover:bg-amber-300 font-semibold"
                    onClick={() => {
                      setIsOpen(false)
                      router.push(dashboardRoute)
                    }}
                  >
                    My Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 text-amber-100 hover:bg-red-700"
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="flex-1 text-amber-100" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Button
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-red-900 font-semibold"
                    onClick={() => router.push("/signup")}
              >
                Sign up
              </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
