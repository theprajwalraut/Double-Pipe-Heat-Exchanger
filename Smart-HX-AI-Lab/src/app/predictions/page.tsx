'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Brain, 
  Play, 
  Download, 
  TrendingUp,
  Target,
  Zap,
  AlertCircle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import { runMLModel } from '@/lib/utils'
import type { MLModelResult } from '@/types'

export default function PredictionsPage() {
  const { currentAnalysis, addNotification } = useAppStore()
  const [selectedModel, setSelectedModel] = useState<MLModelResult['modelType']>('ANN')
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [modelResults, setModelResults] = useState<MLModelResult[]>([])
  const [selectedResult, setSelectedResult] = useState<MLModelResult | null>(null)

  const modelTypes: { value: MLModelResult['modelType']; label: string; description: string }[] = [
    { value: 'ANN', label: 'Artificial Neural Network', description: 'Deep learning model for complex patterns' },
    { value: 'SVM', label: 'Support Vector Machine', description: 'Robust model for non-linear relationships' },
    { value: 'RandomForest', label: 'Random Forest', description: 'Ensemble method with high accuracy' },
    { value: 'LSTM', label: 'LSTM Neural Network', description: 'Time-series specialized deep learning' }
  ]

  const runModel = async () => {
    if (!currentAnalysis?.data) {
      addNotification({
        type: 'error',
        title: 'No Data Available',
        message: 'Please upload data first to run predictions',
        read: false
      })
      return
    }

    setIsTraining(true)
    setTrainingProgress(0)

    // Simulate training progress
    const progressInterval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + 5
      })
    }, 200)

    try {
      // Simulate model training delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const result = runMLModel(currentAnalysis.data, selectedModel)
      
      setModelResults(prev => {
        const filtered = prev.filter(r => r.modelType !== selectedModel)
        return [...filtered, result]
      })
      
      setSelectedResult(result)
      setTrainingProgress(100)

      addNotification({
        type: 'success',
        title: 'Model Training Complete',
        message: `${selectedModel} model achieved ${result.accuracy.toFixed(1)}% accuracy`,
        read: false
      })

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Training Failed',
        message: 'Failed to train the selected model',
        read: false
      })
    } finally {
      setIsTraining(false)
      setTimeout(() => setTrainingProgress(0), 2000)
    }
  }

  const downloadPredictions = () => {
    if (!selectedResult || !currentAnalysis) return

    const csvContent = [
      'timestamp,actual,predicted,difference',
      ...currentAnalysis.data.map((d, i) => 
        `${d.timestamp},${d.foulingResistance},${selectedResult.predictions[i]},${Math.abs(d.foulingResistance - selectedResult.predictions[i])}`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `predictions-${selectedResult.modelType}-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Prepare chart data
  const chartData = selectedResult && currentAnalysis ? 
    currentAnalysis.data.map((d, i) => ({
      index: i,
      actual: d.foulingResistance,
      predicted: selectedResult.predictions[i],
      timestamp: d.timestamp
    })) : []

  const scatterData = selectedResult && currentAnalysis ?
    currentAnalysis.data.map((d, i) => ({
      actual: d.foulingResistance,
      predicted: selectedResult.predictions[i]
    })) : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Prediction Studio</h1>
          <p className="text-muted-foreground">
            Train and compare machine learning models for fouling prediction
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Selection & Training */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Model Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Choose ML Model
                </label>
                <Select value={selectedModel} onValueChange={(value: MLModelResult['modelType']) => setSelectedModel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modelTypes.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900 font-medium">
                  {modelTypes.find(m => m.value === selectedModel)?.label}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {modelTypes.find(m => m.value === selectedModel)?.description}
                </p>
              </div>

              {isTraining && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Training Progress</span>
                    <span>{trainingProgress}%</span>
                  </div>
                  <Progress value={trainingProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Training {selectedModel} model...
                  </p>
                </div>
              )}

              <Button 
                onClick={runModel}
                disabled={isTraining || !currentAnalysis}
                className="w-full"
              >
                {isTraining ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Training...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Train Model
                  </>
                )}
              </Button>

              {!currentAnalysis && (
                <div className="flex items-center gap-2 text-orange-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  Upload data to enable training
                </div>
              )}
            </CardContent>
          </Card>

          {/* Model Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Model Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              {modelResults.length > 0 ? (
                <div className="space-y-3">
                  {modelResults.map((result) => (
                    <div 
                      key={result.modelType}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedResult?.modelType === result.modelType 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedResult(result)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{result.modelType}</span>
                        <Badge variant={result.accuracy > 90 ? 'default' : result.accuracy > 80 ? 'secondary' : 'destructive'}>
                          {result.accuracy.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>MAE: {result.mae.toFixed(4)}</div>
                        <div>RMSE: {result.rmse.toFixed(4)}</div>
                        <div>R²: {result.r2.toFixed(3)}</div>
                        <div>Acc: {result.accuracy.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No models trained yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Visualization */}
        <div className="lg:col-span-2 space-y-6">
          {selectedResult ? (
            <>
              {/* Metrics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedResult.accuracy.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedResult.r2.toFixed(3)}
                    </div>
                    <p className="text-xs text-muted-foreground">R² Score</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {selectedResult.mae.toFixed(4)}
                    </div>
                    <p className="text-xs text-muted-foreground">MAE</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedResult.rmse.toFixed(4)}
                    </div>
                    <p className="text-xs text-muted-foreground">RMSE</p>
                  </CardContent>
                </Card>
              </div>

              {/* Prediction vs Actual Chart */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Predicted vs Actual Values</CardTitle>
                  <Button variant="outline" size="sm" onClick={downloadPredictions}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="index" />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(label) => `Data Point: ${label}`}
                        formatter={(value: number, name: string) => [value.toFixed(6), name]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#3b82f6" 
                        name="Actual"
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#ef4444" 
                        name="Predicted"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Scatter Plot */}
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Accuracy Scatter Plot</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={scatterData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="actual" 
                        name="Actual"
                        label={{ value: 'Actual Values', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        dataKey="predicted" 
                        name="Predicted"
                        label={{ value: 'Predicted Values', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [value.toFixed(6), name]}
                      />
                      <Scatter dataKey="predicted" fill="#8884d8" />
                      {/* Perfect prediction line */}
                      <Line 
                        type="linear" 
                        dataKey="actual" 
                        stroke="#ff7300" 
                        strokeDasharray="2 2"
                        dot={false}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12">
                <div className="text-center text-muted-foreground">
                  <Zap className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Model Selected</h3>
                  <p>Train a model to view predictions and performance metrics</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}