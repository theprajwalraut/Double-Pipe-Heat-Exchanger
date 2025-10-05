'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import KPICard from '@/components/dashboard/KPICard'
import SystemHealthGauge from '@/components/dashboard/SystemHealthGauge'
import RealTimeTrend from '@/components/dashboard/RealTimeTrend'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Thermometer, 
  Gauge, 
  Zap, 
  Calendar, 
  Activity,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { generateInsights } from '@/lib/utils'
import type { CalculatedMetrics } from '@/types'

export default function DashboardPage() {
  const { currentAnalysis, addNotification, settings } = useAppStore()
  const [refreshing, setRefreshing] = useState(false)
  const [insights, setInsights] = useState<string[]>([])

  // Mock data for demonstration when no analysis is available
  const mockMetrics: CalculatedMetrics = {
    effectiveness: 0.78,
    foulingRate: 0.0025,
    overallHeatTransferCoeff: 850,
    energyEfficiency: 78,
    recommendedCleaningDays: 21,
    systemHealthScore: 75
  }

  const metrics = currentAnalysis?.metrics || mockMetrics

  useEffect(() => {
    if (currentAnalysis?.data) {
      const newInsights = generateInsights(currentAnalysis.data, metrics)
      setInsights(newInsights)
    }
  }, [currentAnalysis, metrics])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    addNotification({
      type: 'success',
      title: 'Data Refreshed',
      message: 'Dashboard data has been updated with latest values',
      read: false
    })
    
    setRefreshing(false)
  }

  // Mock trend data
  const trendData = Array.from({ length: 10 }, (_, i) => ({
    time: new Date(Date.now() - (9 - i) * 60000).toLocaleTimeString(),
    value: 0.02 + Math.random() * 0.01
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of heat exchanger performance
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Effectiveness (ε)"
          value={metrics.effectiveness * 100}
          unit="%"
          icon={Gauge}
          color="blue"
          trend="down"
          trendValue={2.3}
          showProgress
          maxValue={100}
          format="percentage"
        />
        <KPICard
          title="Fouling Rate"
          value={metrics.foulingRate * 1000000}
          unit=" μm²K/W/day"
          icon={Thermometer}
          color="orange"
          trend="up"
          trendValue={5.1}
        />
        <KPICard
          title="Heat Transfer Coeff."
          value={metrics.overallHeatTransferCoeff}
          unit=" W/m²K"
          icon={Zap}
          color="green"
          trend="down"
          trendValue={1.8}
        />
        <KPICard
          title="Energy Efficiency"
          value={metrics.energyEfficiency}
          unit="%"
          icon={Activity}
          color="purple"
          trend="stable"
          trendValue={0.5}
          showProgress
          maxValue={100}
        />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health Gauge */}
        <SystemHealthGauge score={metrics.systemHealthScore} />

        {/* Real-time Trend */}
        <RealTimeTrend
          title="Fouling Resistance Trend"
          data={trendData}
          color="#f59e0b"
          autoRefresh={settings.autoRefresh}
          refreshInterval={settings.refreshInterval}
        />

        {/* Cleaning Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Maintenance Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {metrics.recommendedCleaningDays}
                </div>
                <div className="text-sm text-muted-foreground">
                  Days until cleaning
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Last Cleaning</span>
                  <span className="text-muted-foreground">15 days ago</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Next Scheduled</span>
                  <span className="font-medium">
                    {new Date(Date.now() + metrics.recommendedCleaningDays * 24 * 60 * 60 * 1000)
                      .toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className={`p-3 rounded-lg flex items-center gap-2 ${
                metrics.recommendedCleaningDays > 14 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-orange-50 text-orange-700'
              }`}>
                {metrics.recommendedCleaningDays > 14 ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <span className="text-sm">
                  {metrics.recommendedCleaningDays > 14 
                    ? 'System operating normally' 
                    : 'Cleaning required soon'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-blue-900">{insight}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Upload data to get AI-powered insights and recommendations</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Online</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All sensors operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Data Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm font-medium">Excellent</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              98.5% data integrity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Last Update</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {new Date().toLocaleTimeString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-refresh: {settings.autoRefresh ? 'On' : 'Off'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}