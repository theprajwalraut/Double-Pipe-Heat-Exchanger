import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import { cn } from '@/lib/utils'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart HX AI Lab',
  description: 'Fouling Prediction and Performance Optimization of Double-Pipe Heat Exchanger using AI/ML',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <AuthWrapper>
          {children}
        </AuthWrapper>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto pt-20 lg:pl-64">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}