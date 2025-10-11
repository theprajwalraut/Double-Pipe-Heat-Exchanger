'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp } from 'lucide-react'

interface TrendData {
  time: string
  value: number
}

interface RealTimeTrendProps {
  title: string
  data: TrendData[]
  color?: string
  autoRefresh?: boolean
  refreshInterval?: number
}

export default function RealTimeTrend({
  title,
  data: initialData,
  color = '#3b82f6',
  autoRefresh = true,
  refreshInterval = 10000
}: RealTimeTrendProps) {
  const [data, setData] = useState<TrendData[]>(initialData)
  const [isLive, setIsLive] = useState(autoRefresh)

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Simulate real-time data update
      const newPoint: TrendData = {
        time: new Date().toLocaleTimeString(),
        value: Math.random() * 0.01 + 0.02 // Simulate fouling resistance growth
      }

      setData(prev => {
        const newData = [...prev, newPoint]
        // Keep only last 20 points
        return newData.slice(-20)
      })
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [isLive, refreshInterval])

  const latestValue = data[data.length - 1]?.value || 0
  const previousValue = data[data.length - 2]?.value || 0
  const trend = latestValue > previousValue ? 'up' : latestValue < previousValue ? 'down' : 'stable'

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {isLive && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          )}
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current value */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {latestValue.toFixed(4)}
              </div>
              <div className="text-xs text-muted-foreground">
                Current fouling resistance (m²K/W)
              </div>
            </div>
            <div className={`text-sm flex items-center ${
              trend === 'up' ? 'text-red-600' : 
              trend === 'down' ? 'text-green-600' : 'text-gray-600'
            }`}>
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
              <span className="ml-1">
                {((latestValue - previousValue) / previousValue * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis 
                  dataKey="time" 
                  hide
                />
                <YAxis hide />
                <Tooltip 
                  labelFormatter={(label) => `Time: ${label}`}
                  formatter={(value: number) => [value.toFixed(4), 'Fouling Resistance']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-2 py-1 rounded ${
                isLive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {isLive ? 'Pause' : 'Resume'}
            </button>
            <span className="text-muted-foreground">
              Updates every {refreshInterval / 1000}s
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}