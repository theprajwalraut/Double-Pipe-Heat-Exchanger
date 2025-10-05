'use client'

import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BarChart3, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AnalysisPage() {
  const { currentAnalysis } = useAppStore()

  if (!currentAnalysis) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Data Available</h3>
          <p className="text-muted-foreground mb-4">Upload CSV data to view analysis charts</p>
          <Button onClick={() => window.location.href = '/upload'}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Data
          </Button>
        </div>
      </div>
    )
  }

  const chartData = currentAnalysis.data.map((d, index) => ({
    index: index + 1,
    hotInlet: d.inletTempHot,
    hotOutlet: d.outletTempHot,
    coldInlet: d.inletTempCold,
    coldOutlet: d.outletTempCold,
    fouling: d.foulingResistance,
    flowRate: d.flowRateHot,
    pressure: d.pressureDrop
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          📈 Graph Analysis
        </h1>
        <p className="text-muted-foreground">
          🎆 Interactive visualization of heat exchanger performance 🔭
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">📊 Data Points</p>
                <p className="text-2xl font-bold text-blue-700">{currentAnalysis.data.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-red-600">🌡️ Avg Hot Inlet</p>
              <p className="text-2xl font-bold text-red-700">
                {(currentAnalysis.data.reduce((sum, d) => sum + d.inletTempHot, 0) / currentAnalysis.data.length).toFixed(1)}°C
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-yellow-600">⚠️ Max Fouling</p>
              <p className="text-2xl font-bold text-yellow-700">
                {Math.max(...currentAnalysis.data.map(d => d.foulingResistance)).toFixed(4)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-green-600">🎯 Effectiveness</p>
              <p className="text-2xl font-bold text-green-700">{(currentAnalysis.metrics.effectiveness * 100).toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-700">🌡️ Temperature Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hotInlet" stroke="#ef4444" name="Hot Inlet" strokeWidth={2} />
              <Line type="monotone" dataKey="hotOutlet" stroke="#f97316" name="Hot Outlet" strokeWidth={2} />
              <Line type="monotone" dataKey="coldInlet" stroke="#3b82f6" name="Cold Inlet" strokeWidth={2} />
              <Line type="monotone" dataKey="coldOutlet" stroke="#06b6d4" name="Cold Outlet" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-700">📉 Fouling Resistance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="fouling" stroke="#dc2626" name="Fouling Resistance" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}