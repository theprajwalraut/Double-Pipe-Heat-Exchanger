'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts'
import { 
  BarChart3, 
  Download, 
  Filter,
  TrendingUp,
  Thermometer,
  Gauge
} from 'lucide-react'

export default function AnalysisPage() {
  const { currentAnalysis } = useAppStore()
  const [dateRange, setDateRange] = useState('all')
  const [chartType, setChartType] = useState('line')

  if (!currentAnalysis) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Data Available</h3>
          <p className="text-muted-foreground">Upload data to view analysis charts</p>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const temperatureData = currentAnalysis.data.map((d, index) => ({
    index,
    time: new Date(d.timestamp).toLocaleTimeString(),
    hotInlet: d.inletTempHot,
    hotOutlet: d.outletTempHot,
    coldInlet: d.inletTempCold,
    coldOutlet: d.outletTempCold,
    deltaT: d.inletTempHot - d.outletTempHot
  }))

  const foulingData = currentAnalysis.data.map((d, index) => ({
    index,
    time: new Date(d.timestamp).toLocaleTimeString(),
    foulingResistance: d.foulingResistance,
    pressureDrop: d.pressureDrop
  }))

  const effectivenessData = currentAnalysis.data.map((d, index) => {
    const effectiveness = Math.max(0, Math.min(1, 0.85 - d.foulingResistance * 0.1))
    return {
      index,
      flowRate: d.flowRateHot,
      effectiveness: effectiveness * 100,
      energyEfficiency: effectiveness * 100
    }
  })

  const heatTransferData = currentAnalysis.data.map((d, index) => {
    const U = 1000 / (1 + d.foulingResistance * 100)
    return {
      index,
      foulingFactor: d.foulingResistance,
      heatTransferCoeff: U,
      time: new Date(d.timestamp).toLocaleTimeString()
    }
  })

  const downloadChart = (chartName: string) => {
    // This would implement chart download functionality
    console.log(`Downloading ${chartName} chart`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Graph Analysis</h1>
          <p className="text-muted-foreground">
            Interactive visualization and analysis of heat exchanger performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Data</SelectItem>
              <SelectItem value="last24h">Last 24h</SelectItem>
              <SelectItem value="last7d">Last 7 days</SelectItem>
              <SelectItem value="last30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Data Points</p>
                <p className="text-2xl font-bold">{currentAnalysis.data.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Temperature</p>
                <p className="text-2xl font-bold">
                  {(currentAnalysis.data.reduce((sum, d) => sum + d.inletTempHot, 0) / currentAnalysis.data.length).toFixed(1)}°C
                </p>
              </div>
              <Thermometer className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Max Fouling</p>
                <p className="text-2xl font-bold">
                  {Math.max(...currentAnalysis.data.map(d => d.foulingResistance)).toFixed(4)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Effectiveness</p>
                <p className="text-2xl font-bold">
                  {(currentAnalysis.metrics.effectiveness * 100).toFixed(1)}%
                </p>
              </div>
              <Gauge className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="temperature" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="fouling">Fouling</TabsTrigger>
          <TabsTrigger value="effectiveness">Effectiveness</TabsTrigger>
          <TabsTrigger value="heattransfer">Heat Transfer</TabsTrigger>
        </TabsList>

        <TabsContent value="temperature">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Temperature Analysis</CardTitle>
              <Button variant="outline" size="sm" onClick={() => downloadChart('temperature')}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="index" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => `Point: ${label}`}
                    formatter={(value: number, name: string) => [`${value.toFixed(1)}°C`, name]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="hotInlet" stroke="#ef4444" name="Hot Inlet" strokeWidth={2} />
                  <Line type="monotone" dataKey="hotOutlet" stroke="#f97316" name="Hot Outlet" strokeWidth={2} />
                  <Line type="monotone" dataKey="coldInlet" stroke="#3b82f6" name="Cold Inlet" strokeWidth={2} />
                  <Line type="monotone" dataKey="coldOutlet" stroke="#06b6d4" name="Cold Outlet" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fouling">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Fouling Resistance Trend</CardTitle>
              <Button variant="outline" size="sm" onClick={() => downloadChart('fouling')}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={foulingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="index" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => `Point: ${label}`}
                    formatter={(value: number, name: string) => [
                      name === 'foulingResistance' ? value.toFixed(6) : value.toFixed(1), 
                      name === 'foulingResistance' ? 'Fouling Resistance' : 'Pressure Drop'
                    ]}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="foulingResistance" 
                    stroke="#dc2626" 
                    fill="#dc2626" 
                    fillOpacity={0.3}
                    name="Fouling Resistance"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="effectiveness">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Effectiveness vs Flow Rate</CardTitle>
              <Button variant="outline" size="sm" onClick={() => downloadChart('effectiveness')}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={effectivenessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="flowRate" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
                  />
                  <Legend />
                  <Bar dataKey="effectiveness" fill="#16a34a" name="Effectiveness %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heattransfer">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Heat Transfer Coefficient vs Fouling Factor</CardTitle>
              <Button variant="outline" size="sm" onClick={() => downloadChart('heattransfer')}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={heatTransferData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="foulingFactor" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'heatTransferCoeff' ? `${value.toFixed(0)} W/m²K` : value.toFixed(6),
                      name === 'heatTransferCoeff' ? 'Heat Transfer Coeff.' : 'Fouling Factor'
                    ]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="heatTransferCoeff" 
                    stroke="#7c3aed" 
                    name="U (W/m²K)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}