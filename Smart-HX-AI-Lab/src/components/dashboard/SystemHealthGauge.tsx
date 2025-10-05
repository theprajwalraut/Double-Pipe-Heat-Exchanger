'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SystemHealthGaugeProps {
  score: number
  className?: string
}

export default function SystemHealthGauge({ score, className }: SystemHealthGaugeProps) {
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { status: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-500' }
    if (score >= 60) return { status: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-500' }
    if (score >= 40) return { status: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-500' }
    return { status: 'Poor', color: 'text-red-600', bgColor: 'bg-red-500' }
  }

  const health = getHealthStatus(score)

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">System Health Score</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Circular progress indicator */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
                className={health.color}
                strokeLinecap="round"
              />
            </svg>
            {/* Score text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{score.toFixed(0)}</div>
                <div className="text-xs text-muted-foreground">/ 100</div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className={cn("text-lg font-semibold", health.color)}>
              {health.status}
            </div>
            <div className="text-sm text-muted-foreground">
              Overall system performance
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <Progress value={score} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}