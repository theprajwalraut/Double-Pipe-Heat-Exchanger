'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Calculator, 
  Upload, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Database,
  FileSpreadsheet
} from 'lucide-react'
import { calculateMetrics } from '@/lib/utils'

interface ManualInputData {
  hotInletTemp: string
  hotOutletTemp: string
  coldInletTemp: string
  coldOutletTemp: string
  hotFlowRate: string
  coldFlowRate: string
  pressureDrop: string
  foulingResistance: string
}

export default function SmartInputPage() {
  const { setCurrentAnalysis, addNotification } = useAppStore()
  const [formData, setFormData] = useState<ManualInputData>({
    hotInletTemp: '',
    hotOutletTemp: '',
    coldInletTemp: '',
    coldOutletTemp: '',
    hotFlowRate: '',
    coldFlowRate: '',
    pressureDrop: '',
    foulingResistance: ''
  })
  const [results, setResults] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const requiredFields = ['hotInletTemp', 'hotOutletTemp', 'coldInletTemp', 'hotFlowRate']
  
  const calculateValidationScore = () => {
    const totalFields = Object.keys(formData).length
    const filledFields = Object.values(formData).filter(value => value.trim() !== '').length
    return Math.round((filledFields / totalFields) * 100)
  }

  const validateRequiredFields = () => {
    return requiredFields.every(field => formData[field as keyof ManualInputData].trim() !== '')
  }

  const handleInputChange = (field: keyof ManualInputData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!validateRequiredFields()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields',
        read: false
      })
      return
    }

    setIsCalculating(true)

    try {
      // Convert form data to heat exchanger data format
      const heatExchangerData = {
        timestamp: new Date().toISOString(),
        inletTempHot: parseFloat(formData.hotInletTemp),
        outletTempHot: parseFloat(formData.hotOutletTemp),
        inletTempCold: parseFloat(formData.coldInletTemp),
        outletTempCold: parseFloat(formData.coldOutletTemp) || parseFloat(formData.coldInletTemp) + 10,
        flowRateHot: parseFloat(formData.hotFlowRate),
        flowRateCold: parseFloat(formData.coldFlowRate) || parseFloat(formData.hotFlowRate),
        pressureDrop: parseFloat(formData.pressureDrop) || 150,
        foulingResistance: parseFloat(formData.foulingResistance) || 0.001
      }

      // Save to backend
      const response = await fetch('/api/manual-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heatExchangerData)
      })

      if (response.ok) {
        const savedData = await response.json()
        
        // Calculate metrics
        const metrics = calculateMetrics([heatExchangerData])
        
        const analysisResult = {
          id: `manual_${Date.now()}`,
          data: [heatExchangerData],
          metrics,
          predictions: {
            futureFoulingResistance: [heatExchangerData.foulingResistance],
            cleaningSchedule: `Cleaning recommended in ${metrics.recommendedCleaningDays} days`,
            confidenceScore: 0.85,
            predictedU: [metrics.overallHeatTransferCoeff],
            predictedEffectiveness: [metrics.effectiveness]
          },
          createdAt: new Date().toISOString()
        }

        setCurrentAnalysis(analysisResult)
        setResults(metrics)

        addNotification({
          type: 'success',
          title: 'Calculation Complete',
          message: 'Heat exchanger performance calculated successfully',
          read: false
        })
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Calculation Failed',
        message: 'Failed to calculate performance metrics',
        read: false
      })
    } finally {
      setIsCalculating(false)
    }
  }

  const downloadHistory = async () => {
    try {
      const response = await fetch('/api/manual-input/history')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `heat-exchanger-history-${Date.now()}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Download Failed',
        message: 'Failed to download history',
        read: false
      })
    }
  }



  const validationScore = calculateValidationScore()
  const isValid = validateRequiredFields()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            📊 Smart Data Input
          </h1>
          <p className="text-muted-foreground">
            Manually input heat exchanger parameters for real-time analysis
          </p>
        </div>
        <Button variant="outline" onClick={downloadHistory}>
          <Download className="h-4 w-4 mr-2" />
          Download History
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Heat Exchanger Parameters</span>
                <div className="flex items-center gap-2">
                  <Badge variant={validationScore > 80 ? 'default' : validationScore > 50 ? 'secondary' : 'destructive'}>
                    {validationScore}% Complete
                  </Badge>
                  <Progress value={validationScore} className="w-20 h-2" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Temperature Inputs */}
              <div>
                <h3 className="font-medium mb-4">Temperature Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotInletTemp" className="flex items-center gap-1">
                      Hot Fluid Inlet Temperature (°C) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="hotInletTemp"
                      type="number"
                      step="0.1"
                      value={formData.hotInletTemp}
                      onChange={(e) => handleInputChange('hotInletTemp', e.target.value)}
                      placeholder="e.g., 80.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hotOutletTemp" className="flex items-center gap-1">
                      Hot Fluid Outlet Temperature (°C) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="hotOutletTemp"
                      type="number"
                      step="0.1"
                      value={formData.hotOutletTemp}
                      onChange={(e) => handleInputChange('hotOutletTemp', e.target.value)}
                      placeholder="e.g., 65.2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coldInletTemp" className="flex items-center gap-1">
                      Cold Fluid Inlet Temperature (°C) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="coldInletTemp"
                      type="number"
                      step="0.1"
                      value={formData.coldInletTemp}
                      onChange={(e) => handleInputChange('coldInletTemp', e.target.value)}
                      placeholder="e.g., 20.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coldOutletTemp">
                      Cold Fluid Outlet Temperature (°C)
                    </Label>
                    <Input
                      id="coldOutletTemp"
                      type="number"
                      step="0.1"
                      value={formData.coldOutletTemp}
                      onChange={(e) => handleInputChange('coldOutletTemp', e.target.value)}
                      placeholder="e.g., 35.8 (optional)"
                    />
                  </div>
                </div>
              </div>

              {/* Flow Rate Inputs */}
              <div>
                <h3 className="font-medium mb-4">Flow Rate Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotFlowRate" className="flex items-center gap-1">
                      Hot Fluid Mass Flow Rate (kg/s) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="hotFlowRate"
                      type="number"
                      step="0.1"
                      value={formData.hotFlowRate}
                      onChange={(e) => handleInputChange('hotFlowRate', e.target.value)}
                      placeholder="e.g., 2.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coldFlowRate">
                      Cold Fluid Mass Flow Rate (kg/s)
                    </Label>
                    <Input
                      id="coldFlowRate"
                      type="number"
                      step="0.1"
                      value={formData.coldFlowRate}
                      onChange={(e) => handleInputChange('coldFlowRate', e.target.value)}
                      placeholder="e.g., 2.2 (optional)"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Parameters */}
              <div>
                <h3 className="font-medium mb-4">Additional Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pressureDrop">
                      Pressure Drop (Pa)
                    </Label>
                    <Input
                      id="pressureDrop"
                      type="number"
                      step="0.1"
                      value={formData.pressureDrop}
                      onChange={(e) => handleInputChange('pressureDrop', e.target.value)}
                      placeholder="e.g., 150.5 (optional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="foulingResistance">
                      Initial Fouling Resistance (m²K/W)
                    </Label>
                    <Input
                      id="foulingResistance"
                      type="number"
                      step="0.0001"
                      value={formData.foulingResistance}
                      onChange={(e) => handleInputChange('foulingResistance', e.target.value)}
                      placeholder="e.g., 0.001 (optional)"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={!isValid || isCalculating}
                className="w-full"
                size="lg"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Performance
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Validation & Results */}
        <div className="space-y-6">
          {/* Validation Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Validation Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-primary">
                  {validationScore}%
                </div>
                <Progress value={validationScore} className="h-3" />
                <div className="space-y-2 text-sm">
                  {requiredFields.map(field => (
                    <div key={field} className="flex items-center justify-between">
                      <span className="capitalize">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      {formData[field as keyof ManualInputData].trim() !== '' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Results */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Real-time Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Effectiveness:</span>
                    <span className="font-medium">{(results.effectiveness * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Fouling Rate:</span>
                    <span className="font-medium">{results.foulingRate.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Heat Transfer Coeff:</span>
                    <span className="font-medium">{results.overallHeatTransferCoeff.toFixed(0)} W/m²K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Energy Efficiency:</span>
                    <span className="font-medium">{results.energyEfficiency.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Health Score:</span>
                    <span className="font-medium">{results.systemHealthScore.toFixed(0)}/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Smart CSV Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Smart CSV Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Upload CSV with automatic column detection
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/csv-upload'}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Open CSV Upload
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = '/manual-input-template.csv'
                    link.download = 'manual-input-template.csv'
                    link.click()
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}