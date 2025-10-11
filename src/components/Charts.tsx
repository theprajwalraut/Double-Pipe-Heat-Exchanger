'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { HeatExchangerData } from '@/types'

interface ChartsProps {
  data: HeatExchangerData[]
}

export default function Charts({ data }: ChartsProps) {
  const temperatureData = data.map((d, index) => ({
    time: index,
    hotInlet: d.inletTempHot,
    hotOutlet: d.outletTempHot,
    coldInlet: d.inletTempCold,
    coldOutlet: d.outletTempCold
  }))

  const foulingData = data.map((d, index) => ({
    time: index,
    foulingResistance: d.foulingResistance
  }))

  const effectivenessData = data.map((d, index) => {
    const effectiveness = Math.max(0, Math.min(1, 0.85 - d.foulingResistance * 0.1))
    return {
      flowRate: d.flowRateHot,
      effectiveness: effectiveness * 100
    }
  })

  const heatTransferData = data.map((d, index) => {
    const U = 1000 / (1 + d.foulingResistance * 100)
    return {
      foulingFactor: d.foulingResistance,
      heatTransferCoeff: U
    }
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Data Visualization</h2>
      
      <Tabs defaultValue="temperature" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="fouling">Fouling</TabsTrigger>
          <TabsTrigger value="effectiveness">Effectiveness</TabsTrigger>
          <TabsTrigger value="heattransfer">Heat Transfer</TabsTrigger>
        </TabsList>

        <TabsContent value="temperature">
          <Card>
            <CardHeader>
              <CardTitle>Temperature vs Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hotInlet" stroke="#ef4444" name="Hot Inlet" />
                  <Line type="monotone" dataKey="hotOutlet" stroke="#f97316" name="Hot Outlet" />
                  <Line type="monotone" dataKey="coldInlet" stroke="#3b82f6" name="Cold Inlet" />
                  <Line type="monotone" dataKey="coldOutlet" stroke="#06b6d4" name="Cold Outlet" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fouling">
          <Card>
            <CardHeader>
              <CardTitle>Fouling Resistance vs Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={foulingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="foulingResistance" stroke="#dc2626" name="Fouling Resistance" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="effectiveness">
          <Card>
            <CardHeader>
              <CardTitle>Effectiveness vs Flow Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={effectivenessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="flowRate" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="effectiveness" stroke="#16a34a" name="Effectiveness %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heattransfer">
          <Card>
            <CardHeader>
              <CardTitle>Heat Transfer Coefficient vs Fouling Factor</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={heatTransferData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="foulingFactor" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="heatTransferCoeff" stroke="#7c3aed" name="U (W/m²K)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}