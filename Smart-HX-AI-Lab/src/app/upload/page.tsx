'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import DragDropUpload from '@/components/upload/DragDropUpload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock,
  BarChart3,
  Download,
  FileSpreadsheet
} from 'lucide-react'
import type { AnalysisResult } from '@/types'

export default function UploadPage() {
  const router = useRouter()
  const { setCurrentAnalysis, addToHistory, addNotification } = useAppStore()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setUploadComplete(false)
  }

  const handleUploadComplete = (result: AnalysisResult) => {
    setAnalysisResult(result)
    setCurrentAnalysis(result)
    setUploadComplete(true)

    // Add to history
    addToHistory({
      id: result.id,
      filename: selectedFile?.name || 'unknown.csv',
      uploadDate: new Date().toISOString(),
      dataPoints: result.data.length,
      avgEffectiveness: result.metrics.effectiveness,
      maxFoulingResistance: Math.max(...result.data.map(d => d.foulingResistance)),
      status: 'processed'
    })

    // Add notification
    addNotification({
      type: 'success',
      title: 'Upload Complete',
      message: `Successfully processed ${result.data.length} data points`,
      read: false
    })
  }

  const navigateToDashboard = () => {
    router.push('/dashboard')
  }

  const navigateToAnalysis = () => {
    router.push('/analysis')
  }

  const downloadSampleData = () => {
    const link = document.createElement('a')
    link.href = '/sample-data.csv'
    link.download = 'sample-heat-exchanger-data.csv'
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Upload</h1>
          <p className="text-muted-foreground">
            Upload heat exchanger data for AI-powered analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadSampleData}>
            <Download className="h-4 w-4 mr-2" />
            Download Sample Data
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/csv-upload'}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Smart CSV Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <DragDropUpload
            onFileSelect={handleFileSelect}
            onUploadComplete={handleUploadComplete}
          />
        </div>

        {/* Status Panel */}
        <div className="space-y-6">
          {/* Upload Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">File Selected</span>
                  {selectedFile ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Processing Complete</span>
                  {uploadComplete ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Analysis Ready</span>
                  {analysisResult ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Info */}
          {selectedFile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  File Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{selectedFile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="secondary">CSV</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modified:</span>
                    <span>{new Date(selectedFile.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Data Points:</span>
                    <span className="font-medium">{analysisResult.data.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Effectiveness:</span>
                    <span className="font-medium">
                      {(analysisResult.metrics.effectiveness * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Health Score:</span>
                    <span className="font-medium">
                      {analysisResult.metrics.systemHealthScore.toFixed(0)}/100
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cleaning Due:</span>
                    <span className="font-medium">
                      {analysisResult.metrics.recommendedCleaningDays} days
                    </span>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Button 
                      onClick={navigateToDashboard}
                      className="w-full"
                      size="sm"
                    >
                      View Dashboard
                    </Button>
                    <Button 
                      onClick={navigateToAnalysis}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      Analyze Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm text-blue-900">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Ensure your CSV has all required columns</li>
                <li>• Use consistent units for temperature (°C)</li>
                <li>• Include timestamp for time-series analysis</li>
                <li>• Larger datasets provide better predictions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Uploads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent uploads found</p>
            <p className="text-sm">Upload your first dataset to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}