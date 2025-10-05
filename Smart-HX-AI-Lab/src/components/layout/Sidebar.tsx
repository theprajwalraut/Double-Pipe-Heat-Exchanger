'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  FileSpreadsheet
} from 'lucide-react'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Smart Input',
    href: '/smart-input',
    icon: Calculator
  },
  {
    title: 'Data Upload',
    href: '/upload',
    icon: Upload
  },
  {
    title: 'CSV Upload',
    href: '/csv-upload',
    icon: FileSpreadsheet
  },
  {
    title: 'AI Predictions',
    href: '/predictions',
    icon: Brain
  },
  {
    title: 'Graph Analysis',
    href: '/analysis',
    icon: BarChart3
  },
  {
    title: 'Optimization Tools',
    href: '/optimization',
    icon: Settings2
  },
  {
    title: 'Report Generator',
    href: '/reports',
    icon: FileText
  },
  {
    title: 'History & Logs',
    href: '/history',
    icon: History
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings
  }
]

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
        "fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            {!sidebarCollapsed && (
              <h2 className="text-lg font-semibold">Smart HX AI Lab</h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    sidebarCollapsed && "justify-center px-2"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <div className={cn(
              "text-xs text-muted-foreground",
              sidebarCollapsed ? "text-center" : ""
            )}>
              {sidebarCollapsed ? "v1.0" : "Version 1.0.0"}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}