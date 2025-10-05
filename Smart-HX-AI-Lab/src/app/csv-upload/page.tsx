'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SmartCSVUpload from '@/components/csv-upload/SmartCSVUpload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileSpreadsheet, Download, Eye, Trash2 } from 'lucide-react'

export default function CSVUploadPage() {
  const router = useRouter()
  const [uploadHistory, setUploadHistory] = useState<any[]>([])

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/csv-upload')
      if (response.ok) {
        const result = await response.json()
        setUploadHistory(result.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch history:', error)
    }
  }

  const handleUploadComplete = (result: any) => {
    fetchHistory()
    router.push('/dashboard')
  }

  const downloadProcessedData = async (record: any) => {
    try {
      const response = await fetch(`/api/csv-upload/download?id=${record.id}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `processed-${record.filename}`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-8 w-8" />
            Smart CSV Upload
          </h1>
          <p className="text-muted-foreground">
            Upload CSV files with automatic column detection and mapping
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <SmartCSVUpload onUploadComplete={handleUploadComplete} />
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</div>
                <span>Upload your CSV file</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</div>
                <span>Auto-detect column mapping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</div>
                <span>Confirm and adjust mappings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">4</div>
                <span>Process and analyze data</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Supported Columns</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <div><strong>Required:</strong></div>
              <div>• Hot inlet/outlet temperature</div>
              <div>• Cold inlet temperature</div>
              <div>• Hot fluid flow rate</div>
              <div><strong>Optional:</strong></div>
              <div>• Cold outlet temperature</div>
              <div>• Cold fluid flow rate</div>
              <div>• Pressure drop</div>
              <div>• Fouling resistance</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload History */}
      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
        </CardHeader>
        <CardContent>
          {uploadHistory.length > 0 ? (
            <div className="space-y-3">
              {uploadHistory.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{record.filename}</div>
                    <div className="text-sm text-muted-foreground">
                      {record.dataPoints} data points • {new Date(record.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{record.dataPoints} rows</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadProcessedData(record)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No CSV files uploaded yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}