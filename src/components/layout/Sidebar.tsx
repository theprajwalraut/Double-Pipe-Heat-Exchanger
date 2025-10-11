'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Upload,
  Brain,
  BarChart3,
  Settings2,
  FileText,
  History,
  Settings,
  Menu,
  X,
  Calculator,
  FileSpreadsheet,
  BookOpen,
  Zap,
  LogIn,
  User,
  LogOut
} from 'lucide-react'
import toast from 'react-hot-toast'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    color: 'text-blue-500'
  },
  {
    title: 'Smart Input',
    href: '/smart-input',
    icon: Calculator,
    color: 'text-green-500'
  },
  {
    title: 'Data Upload',
    href: '/upload',
    icon: Upload,
    color: 'text-purple-500'
  },
  {
    title: 'CSV Upload',
    href: '/csv-upload',
    icon: FileSpreadsheet,
    color: 'text-orange-500'
  },
  {
    title: 'Learning Hub',
    href: '/learning-hub',
    icon: BookOpen,
    color: 'text-indigo-500'
  },
  {
    title: 'AI Predictions',
    href: '/predictions',
    icon: Brain,
    color: 'text-pink-500'
  },
  {
    title: 'Graph Analysis',
    href: '/analysis',
    icon: BarChart3,
    color: 'text-cyan-500'
  },
  {
    title: 'Optimization Tools',
    href: '/optimization',
    icon: Settings2,
    color: 'text-yellow-500'
  },
  {
    title: 'Report Generator',
    href: '/reports',
    icon: FileText,
    color: 'text-red-500'
  },

  {
    title: 'Profile',
    href: '/profile',
    icon: User,
    color: 'text-green-500'
  }
]

function UserProfile({ collapsed }: { collapsed: boolean }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    toast.success('Logged out successfully')
    router.push('/login')
  }

  if (!user) return null

  return (
    <div className={cn("space-y-2", collapsed ? "text-center" : "")}>
      {collapsed ? (
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <button onClick={handleLogout} className="p-1 hover:bg-slate-200 rounded">
            <LogOut className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-3 p-2 bg-white rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">
                {user.username}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </>
      )}
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 transition-all duration-300 shadow-lg",
        sidebarCollapsed ? "w-16" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Header with Logo */}
          <div className="flex h-20 items-center justify-center px-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-purple-600">
            {!sidebarCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-white">
                  <h2 className="text-lg font-bold">Smart HX</h2>
                  <p className="text-xs opacity-90">AI Lab</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-3 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 hover:scale-105",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                      : "text-slate-600 hover:bg-white hover:shadow-md",
                    sidebarCollapsed && "justify-center px-2"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors duration-200",
                    isActive ? "text-white" : item.color,
                    "group-hover:scale-110"
                  )} />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Collapse Toggle */}
          <div className="border-t border-slate-200 p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center hover:bg-white"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2">Collapse</span>}
            </Button>
          </div>

          {/* User Profile Section */}
          <div className="border-t border-slate-200 p-3 bg-slate-50">
            <UserProfile collapsed={sidebarCollapsed} />
          </div>
        </div>
      </aside>
    </>
  )
}