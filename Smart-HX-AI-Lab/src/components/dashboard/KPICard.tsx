'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: number
  unit?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple'
  showProgress?: boolean
  maxValue?: number
  format?: 'number' | 'percentage' | 'currency'
}

const colorClasses = {
  blue: 'text-blue-600 bg-blue-50 border-blue-200',
  green: 'text-green-600 bg-green-50 border-green-200',
  orange: 'text-orange-600 bg-orange-50 border-orange-200',
  red: 'text-red-600 bg-red-50 border-red-200',
  purple: 'text-purple-600 bg-purple-50 border-purple-200'
}

export default function KPICard({
  title,
  value,
  unit = '',
  icon: Icon,
  trend,
  trendValue,
  color = 'blue',
  showProgress = false,
  maxValue = 100,
  format = 'number'
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value)
    }, 100)
    return () => clearTimeout(timer)
  }, [value])

  const formatValue = (val: number) => {
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`
      case 'currency':
        return `$${val.toLocaleString()}`
      default:
        return val.toLocaleString()
    }
  }

  const progressValue = showProgress ? (value / maxValue) * 100 : 0

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-lg",
          colorClasses[color]
        )}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatValue(displayValue)}{unit}
        </div>
        
        {trend && trendValue && (
          <p className={cn(
            "text-xs flex items-center mt-1",
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 'text-gray-600'
          )}>
            <span className="mr-1">
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
            </span>
            {Math.abs(trendValue).toFixed(1)}% from last period
          </p>
        )}

        {showProgress && (
          <div className="mt-3">
            <Progress value={progressValue} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {progressValue.toFixed(0)}% of maximum
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}