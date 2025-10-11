'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText, CheckCircle } from 'lucide-react'
import Papa from 'papaparse'
import { calculateMetrics } from '@/lib/utils'
import { useAppStore } from '@/lib/store'

export default function UploadPage() {
  const { setCurrentAnalysis } = useAppStore()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    
    setUploading(true)
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const rawData = results.data as any[]
        
        const processedData = rawData.map((row, index) => ({
          timestamp: row.DateTime || row.Time || new Date().toISOString(),
          inletTempHot: parseFloat(row.Th_inlet || row['Hot Inlet'] || row.inletTempHot) || 80,
          outletTempHot: parseFloat(row.Th_outlet || row['Hot Outlet'] || row.outletTempHot) || 65,
          inletTempCold: parseFloat(row.Tc_inlet || row['Cold Inlet'] || row.inletTempCold) || 20,
          outletTempCold: parseFloat(row.Tc_outlet || row['Cold Outlet'] || row.outletTempCold) || 35,
          flowRateHot: parseFloat(row.mass_flow_h || row['Flow Hot'] || row.flowRateHot) || 2.5,
          flowRateCold: parseFloat(row.mass_flow_c || row['Flow Cold'] || row.flowRateCold) || 2.2,
          pressureDrop: parseFloat(row['ΔP'] || row.pressureDrop) || 150,
          foulingResistance: parseFloat(row.fouling_factor || row.foulingResistance) || 0.001 + index * 0.0001
        }))
        
        const metrics = calculateMetrics(processedData)
        
        const analysisResult = {
          id: `upload_${Date.now()}`,
          data: processedData,
          metrics,
          predictions: {
            futureFoulingResistance: processedData.map(d => d.foulingResistance),
            cleaningSchedule: `Cleaning recommended in ${metrics.recommendedCleaningDays} days`,
            confidenceScore: 0.85,
            predictedU: [metrics.overallHeatTransferCoeff],
            predictedEffectiveness: [metrics.effectiveness]
          },
          createdAt: new Date().toISOString(),
          filename: file.name
        }
        
        setResult(analysisResult)
        setCurrentAnalysis(analysisResult)
        setUploading(false)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          📊 Smart Data Upload
        </h1>
        <p className="text-muted-foreground">
          🚀 Upload heat exchanger data for AI-powered analysis ⚡
        </p>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-xl transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Upload className="h-4 w-4" />
            📁 Upload CSV File
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-gradient-to-br from-blue-25 to-indigo-25 hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <FileText className="h-12 w-12 mx-auto text-blue-400 mb-4" />
              <p className="text-lg font-medium mb-2 text-blue-700">
                {file ? `📄 ${file.name}` : '📁 Choose CSV File'}
              </p>
              <p className="text-sm text-blue-600">
                ✨ Click to select your heat exchanger data
              </p>
            </label>
          </div>
          
          {file && (
            <Button 
              onClick={handleUpload} 
              disabled={uploading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {uploading ? '⏳ Processing...' : '🚀 Upload and Analyze'}
            </Button>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4 text-green-600" />
              ✅ Analysis Complete - Go to Graph Analysis 📈
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Data Points: {result.data.length}</div>
              <div>Effectiveness: {(result.metrics.effectiveness * 100).toFixed(1)}%</div>
              <div>Health Score: {result.metrics.systemHealthScore}/100</div>
              <div>Cleaning Due: {result.metrics.recommendedCleaningDays} days</div>
            </div>
            <Button 
              onClick={() => window.location.href = '/analysis'} 
              className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              📊 View Graphs
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}