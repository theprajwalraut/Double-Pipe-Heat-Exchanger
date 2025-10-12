'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings2, 
  Calculator, 
  TrendingUp,
  DollarSign,
  Clock,
  Zap,
  AlertTriangle
} from 'lucide-react'
import { optimizeOperations } from '@/lib/utils'
import type { OptimizationParams, OptimizationResult } from '@/types'

export default function OptimizationPage() {
  const { currentAnalysis, addNotification } = useAppStore()
  const [params, setParams] = useState<OptimizationParams>({
    maxFoulingResistance: 0.05,
    cleaningCost: 415000,
    downtimeCost: 166000,
    energyCostPerKWh: 9.96
  })
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [whatIfParams, setWhatIfParams] = useState({
    inletTemp: 80,
    flowRate: 2.5
  })
  const [whatIfResult, setWhatIfResult] = useState<any>(null)

  const runOptimization = () => {
    if (!currentAnalysis?.data) {
      addNotification({
        type: 'error',
        title: 'No Data Available',
        message: 'Please upload data first to run optimization',
        read: false
      })
      return
    }

    const optimizationResult = optimizeOperations(currentAnalysis.data, params)
    setResult(optimizationResult)

    addNotification({
      type: 'success',
      title: 'Optimization Complete',
      message: `Optimal cleaning interval: ${optimizationResult.optimalCleaningInterval} days`,
      read: false
    })
  }

  const runWhatIfAnalysis = () => {
    if (!currentAnalysis?.data) return

    // Simulate what-if analysis
    const baselineFouling = currentAnalysis.metrics.foulingRate
    const tempFactor = (whatIfParams.inletTemp - 80) * 0.001 // Higher temp increases fouling
    const flowFactor = (2.5 - whatIfParams.flowRate) * 0.0005 // Lower flow increases fouling
    
    const newFoulingRate = Math.max(0, baselineFouling + tempFactor + flowFactor)
    const newEffectiveness = Math.max(0.5, Math.min(0.95, 0.85 - newFoulingRate * 10))
    const newCleaningDays = Math.max(7, Math.min(90, 30 - newFoulingRate * 2000))

    setWhatIfResult({
      foulingRate: newFoulingRate,
      effectiveness: newEffectiveness,
      cleaningDays: newCleaningDays,
      energySavings: (newEffectiveness - currentAnalysis.metrics.effectiveness) * 1000
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Optimization Tools</h1>
          <p className="text-muted-foreground">
            Optimize operations and predict maintenance schedules
          </p>
        </div>
      </div>

      <Tabs defaultValue="optimization" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="optimization">Cost Optimization</TabsTrigger>
          <TabsTrigger value="whatif">What-If Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Parameters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  Optimization Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFouling">Max Fouling Resistance (m²K/W)</Label>
                  <Input
                    id="maxFouling"
                    type="number"
                    step="0.001"
                    value={params.maxFoulingResistance}
                    onChange={(e) => setParams(prev => ({
                      ...prev,
                      maxFoulingResistance: parseFloat(e.target.value) || 0
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cleaningCost">Cleaning Cost (₹)</Label>
                  <Input
                    id="cleaningCost"
                    type="number"
                    value={params.cleaningCost}
                    onChange={(e) => setParams(prev => ({
                      ...prev,
                      cleaningCost: parseFloat(e.target.value) || 0
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="downtimeCost">Downtime Cost (₹)</Label>
                  <Input
                    id="downtimeCost"
                    type="number"
                    value={params.downtimeCost}
                    onChange={(e) => setParams(prev => ({
                      ...prev,
                      downtimeCost: parseFloat(e.target.value) || 0
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="energyCost">Energy Cost (₹/kWh)</Label>
                  <Input
                    id="energyCost"
                    type="number"
                    step="0.01"
                    value={params.energyCostPerKWh}
                    onChange={(e) => setParams(prev => ({
                      ...prev,
                      energyCostPerKWh: parseFloat(e.target.value) || 0
                    }))}
                  />
                </div>

                <Button 
                  onClick={runOptimization}
                  disabled={!currentAnalysis}
                  className="w-full"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Run Optimization
                </Button>

                {!currentAnalysis && (
                  <div className="flex items-center gap-2 text-orange-600 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    Upload data to enable optimization
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {result ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Optimal Cleaning</p>
                            <p className="text-2xl font-bold">{result.optimalCleaningInterval}</p>
                            <p className="text-xs text-muted-foreground">days</p>
                          </div>
                          <Clock className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Energy Savings</p>
                            <p className="text-2xl font-bold">₹{(result.energyCostSavings * 83).toLocaleString('en-IN')}</p>
                            <p className="text-xs text-muted-foreground">per month</p>
                          </div>
                          <Zap className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Optimization Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Cost Savings:</span>
                          <span className="font-medium">₹{(result.totalCostSavings * 83).toLocaleString('en-IN')}/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Recommended Inlet Temp:</span>
                          <span className="font-medium">{result.recommendedOperatingConditions.inletTemp}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Recommended Flow Rate:</span>
                          <span className="font-medium">{result.recommendedOperatingConditions.flowRate} kg/s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ROI Period:</span>
                          <span className="font-medium">
                            {result.totalCostSavings > 0 
                              ? Math.ceil((params.cleaningCost / 83) / result.totalCostSavings) 
                              : 'N/A'} months
                          </span>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg ${
                        result.totalCostSavings > 0 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-orange-50 border border-orange-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <DollarSign className={`h-4 w-4 ${
                            result.totalCostSavings > 0 ? 'text-green-600' : 'text-orange-600'
                          }`} />
                          <span className={`font-medium ${
                            result.totalCostSavings > 0 ? 'text-green-900' : 'text-orange-900'
                          }`}>
                            {result.totalCostSavings > 0 
                              ? 'Optimization will reduce costs' 
                              : 'Current operation is near optimal'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-12">
                    <div className="text-center text-muted-foreground">
                      <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No Optimization Results</h3>
                      <p>Set parameters and run optimization to see results</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="whatif" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* What-If Parameters */}
            <Card>
              <CardHeader>
                <CardTitle>What-If Simulator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatIfTemp">Inlet Temperature (°C)</Label>
                  <Input
                    id="whatIfTemp"
                    type="number"
                    value={whatIfParams.inletTemp}
                    onChange={(e) => setWhatIfParams(prev => ({
                      ...prev,
                      inletTemp: parseFloat(e.target.value) || 0
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatIfFlow">Flow Rate (kg/s)</Label>
                  <Input
                    id="whatIfFlow"
                    type="number"
                    step="0.1"
                    value={whatIfParams.flowRate}
                    onChange={(e) => setWhatIfParams(prev => ({
                      ...prev,
                      flowRate: parseFloat(e.target.value) || 0
                    }))}
                  />
                </div>

                <Button 
                  onClick={runWhatIfAnalysis}
                  disabled={!currentAnalysis}
                  className="w-full"
                >
                  Run Simulation
                </Button>
              </CardContent>
            </Card>

            {/* What-If Results */}
            <Card>
              <CardHeader>
                <CardTitle>Simulation Results</CardTitle>
              </CardHeader>
              <CardContent>
                {whatIfResult && currentAnalysis ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Current Effectiveness</p>
                        <p className="text-lg font-bold">
                          {(currentAnalysis.metrics.effectiveness * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Predicted Effectiveness</p>
                        <p className="text-lg font-bold">
                          {(whatIfResult.effectiveness * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current Cleaning Days</p>
                        <p className="text-lg font-bold">
                          {currentAnalysis.metrics.recommendedCleaningDays}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Predicted Cleaning Days</p>
                        <p className="text-lg font-bold">
                          {whatIfResult.cleaningDays.toFixed(0)}
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${
                      whatIfResult.energySavings > 0 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <p className={`font-medium ${
                        whatIfResult.energySavings > 0 ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {whatIfResult.energySavings > 0 ? 'Improvement' : 'Degradation'}: 
                        ₹{(Math.abs(whatIfResult.energySavings) * 83).toLocaleString('en-IN')} energy cost impact
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Run simulation to see predicted results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}