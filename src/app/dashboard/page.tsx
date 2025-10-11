'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Activity, TrendingUp, Thermometer, Droplets, CheckCircle } from 'lucide-react'

export default function DashboardPage() {
  const [realTimeData, setRealTimeData] = useState({
    effectiveness: 82.5,
    foulingRate: 2.5,
    energyEfficiency: 78.3,
    cleaningDays: 15,
    systemHealth: 85
  })

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const response = await fetch('/api/realtime')
        const data = await response.json()
        setRealTimeData(data)
      } catch (error) {
        console.error('Failed to fetch real-time data:', error)
      }
    }

    fetchRealTimeData()
    const interval = setInterval(fetchRealTimeData, 3000)

    return () => clearInterval(interval)
  }, [])
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🔥 Smart HX Dashboard
          </h1>
          <p className="text-muted-foreground">
            ⚡ Real-time monitoring and AI-powered analysis of heat exchanger performance 🚀
          </p>
        </div>

      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">🎯 Effectiveness</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{realTimeData.effectiveness.toFixed(1)}%</div>
            <p className="text-xs text-blue-500">
              Heat transfer efficiency
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">⚠️ Fouling Rate</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{realTimeData.foulingRate.toFixed(1)}</div>
            <p className="text-xs text-orange-500">
              μm²K/W per day
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">⚡ Energy Efficiency</CardTitle>
            <Thermometer className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{realTimeData.energyEfficiency.toFixed(1)}%</div>
            <p className="text-xs text-green-500">
              Overall system efficiency
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">🧽 Cleaning Schedule</CardTitle>
            <Droplets className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{Math.round(realTimeData.cleaningDays)}</div>
            <p className="text-xs text-purple-500">
              Days until cleaning
            </p>
          </CardContent>
        </Card>
      </div>



      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-gray-700">🚀 Quick Actions</CardTitle>
          <CardDescription className="text-gray-600">
            ⚡ Common tasks and operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
              📊 Upload New Data
            </Button>
            <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-300">
              📋 Generate Report
            </Button>
            <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:border-purple-300">
              🔮 Run Prediction
            </Button>
            <Button variant="outline" size="sm" className="hover:bg-orange-50 hover:border-orange-300">
              ⚙️ Optimize Operations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}