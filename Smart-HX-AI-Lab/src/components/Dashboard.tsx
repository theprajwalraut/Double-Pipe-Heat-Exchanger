'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Thermometer, Gauge, Zap, Calendar } from 'lucide-react'
import type { CalculatedMetrics } from '@/types'

interface DashboardProps {
  metrics: CalculatedMetrics
}

export default function Dashboard({ metrics }: DashboardProps) {
  const cards = [
    {
      title: 'Effectiveness (ε)',
      value: `${(metrics.effectiveness * 100).toFixed(1)}%`,
      icon: Gauge,
      description: 'Heat exchanger effectiveness',
      color: 'text-blue-600'
    },
    {
      title: 'Fouling Rate',
      value: `${metrics.foulingRate.toFixed(6)}`,
      icon: Thermometer,
      description: 'Rate of fouling accumulation',
      color: 'text-orange-600'
    },
    {
      title: 'Overall U',
      value: `${metrics.overallHeatTransferCoeff.toFixed(0)} W/m²K`,
      icon: Zap,
      description: 'Heat transfer coefficient',
      color: 'text-green-600'
    },
    {
      title: 'Energy Efficiency',
      value: `${metrics.energyEfficiency.toFixed(1)}%`,
      icon: Zap,
      description: 'Overall energy efficiency',
      color: 'text-purple-600'
    },
    {
      title: 'Cleaning Schedule',
      value: `${metrics.recommendedCleaningDays} days`,
      icon: Calendar,
      description: 'Recommended cleaning interval',
      color: 'text-red-600'
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Performance Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>System Status:</span>
              <span className={`font-medium ${
                metrics.effectiveness > 0.7 ? 'text-green-600' : 
                metrics.effectiveness > 0.5 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metrics.effectiveness > 0.7 ? 'Optimal' : 
                 metrics.effectiveness > 0.5 ? 'Moderate' : 'Poor'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Maintenance Priority:</span>
              <span className={`font-medium ${
                metrics.recommendedCleaningDays > 21 ? 'text-green-600' : 
                metrics.recommendedCleaningDays > 7 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metrics.recommendedCleaningDays > 21 ? 'Low' : 
                 metrics.recommendedCleaningDays > 7 ? 'Medium' : 'High'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}