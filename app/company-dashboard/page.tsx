"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Building2, LogOut, Sparkles, Clock, AlertCircle } from "lucide-react"

export default function CompanyDashboard() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const userRole = localStorage.getItem("userRole")

    if (!isLoggedIn || userRole !== "Company") {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userRole")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-900 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 dark:bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:bg-none dark:text-white">
                  Company Management
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Your company dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-lg mx-auto bg-white/90 dark:bg-gray-900 backdrop-blur-sm border-white/20 dark:border-gray-800 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Building2 className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:bg-none dark:text-white">
                No Company Data Available
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Coming Soon</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                No company data available yet. Our team is working hard to bring you comprehensive company management
                features. Please check back later or contact your administrator for more information.
              </p>
              <div className="pt-4">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Clock className="h-4 w-4" />
                  Check Back Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
