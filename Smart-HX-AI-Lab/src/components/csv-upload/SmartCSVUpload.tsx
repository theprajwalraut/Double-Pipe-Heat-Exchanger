'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, FileText, CheckCircle, AlertCircle, Eye, Download } from 'lucide-react'
import { autoMapColumns, validateMappings, expectedFields, type FieldMapping } from '@/lib/csvMapper'
import { useAppStore } from '@/lib/store'
import { calculateMetrics } from '@/lib/utils'
import Papa from 'papaparse'

interface SmartCSVUploadProps {
  onUploadComplete?: (result: any) => void
  className?: string
}

export default function SmartCSVUpload({ onUploadComplete, className }: SmartCSVUploadProps) {
  const { setCurrentAnalysis, addNotification } = useAppStore()
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<string[][]>([])
  const [mappings, setMappings] = useState<FieldMapping[]>([])
  const [step, setStep] = useState<'upload' | 'preview' | 'processing'>('upload')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      addNotification({
        type: 'error',
        title: 'Invalid File',
        message: 'Please select a CSV file',
        read: false
      })
      return
    }

    setFile(selectedFile)
    setError(null)
    setProgress(10)
    setProgressText('Parsing CSV file...')
    
    Papa.parse(selectedFile, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        setProgress(30)
        setProgressText('Validating structure...')
        
        if (results.errors.length > 0) {
          setError(`CSV parsing error: ${results.errors[0].message}`)
          setProgress(0)
          setProgressText('')
          return
        }
        
        const data = results.data as string[][]
        if (data.length < 2) {
          setError('CSV must contain at least a header row and one data row')
          setProgress(0)
          setProgressText('')
          return
        }
        
        setCsvData(data)
        setProgress(50)
        setProgressText('Detecting columns...')
        
        const headers = data[0]
        const autoMappings = autoMapColumns(headers)
        setMappings(autoMappings)
        
        setProgress(100)
        setProgressText('Ready for mapping')
        setTimeout(() => {
          setStep('preview')
          setProgress(0)
          setProgressText('')
        }, 500)
      },
      error: (error) => {
        setError(`Failed to parse CSV: ${error.message}`)
        setProgress(0)
        setProgressText('')
      }
    })
  }

  const updateMapping = (csvColumn: string, targetField: string) => {
    setMappings(prev => {
      const filtered = prev.filter(m => m.csvColumn !== csvColumn)
      if (targetField !== 'none') {
        filtered.push({ csvColumn, targetField, confidence: 1.0 })
      }
      return filtered
    })
  }

  const processData = async () => {
    if (!csvData.length || !mappings.length) return

    const validation = validateMappings(mappings)
    if (!validation.isValid) {
      addNotification({
        type: 'error',
        title: 'Missing Required Data',
        message: `Missing: ${validation.missing.join(', ')}. Check column names match expected patterns.`,
        read: false
      })
      return
    }

    setProcessing(true)
    setStep('processing')
    setProgress(0)
    setError(null)

    try {
      setProgress(10)
      setProgressText('Mapping columns...')
      
      const headers = csvData[0]
      const mappingDict = Object.fromEntries(mappings.map(m => [m.csvColumn, m.targetField]))
      
      setProgress(30)
      setProgressText('Processing data rows...')
      
      const processedData = csvData.slice(1).map((row, index) => {
        const dataPoint: any = {
          timestamp: new Date().toISOString()
        }
        
        headers.forEach((header, i) => {
          const targetField = mappingDict[header]
          if (targetField && row[i]) {
            if (targetField === 'timestamp') {
              dataPoint[targetField] = row[i]
            } else {
              const value = parseFloat(row[i])
              if (!isNaN(value)) {
                dataPoint[targetField] = value
              }
            }
          }
        })

        // Fill missing optional fields with defaults
        dataPoint.outletTempCold = dataPoint.outletTempCold || dataPoint.inletTempCold + 10
        dataPoint.flowRateCold = dataPoint.flowRateCold || dataPoint.flowRateHot
        dataPoint.pressureDrop = dataPoint.pressureDrop || 150
        dataPoint.foulingResistance = dataPoint.foulingResistance || 0.001

        return dataPoint
      }).filter(d => d.inletTempHot && d.outletTempHot && d.inletTempCold && d.flowRateHot)

      if (processedData.length === 0) {
        throw new Error('No valid data rows found after processing')
      }

      setProgress(60)
      setProgressText('Saving to database...')

      const response = await fetch('/api/csv-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: processedData, filename: file?.name })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Server error')
      }

      setProgress(80)
      setProgressText('Calculating metrics...')
      
      const metrics = calculateMetrics(processedData)
      
      setProgress(90)
      setProgressText('Generating analysis...')
      
      const analysisResult = {
        id: `csv_${Date.now()}`,
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
        filename: file?.name
      }

      setCurrentAnalysis(analysisResult)
      onUploadComplete?.(analysisResult)

      setProgress(100)
      setProgressText('Complete!')

      addNotification({
        type: 'success',
        title: 'CSV Processed',
        message: `Successfully processed ${processedData.length} data points`,
        read: false
      })

      // Reset after delay
      setTimeout(() => {
        setFile(null)
        setCsvData([])
        setMappings([])
        setStep('upload')
        setProgress(0)
        setProgressText('')
      }, 1500)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(errorMessage)
      setProgress(0)
      setProgressText('')
      
      addNotification({
        type: 'error',
        title: 'Processing Failed',
        message: errorMessage,
        read: false
      })
    } finally {
      setProcessing(false)
    }
  }

  const validation = validateMappings(mappings)

  return (
    <div className={className}>
      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Smart CSV Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-file-input"
                disabled={progress > 0}
              />
              <label htmlFor="csv-file-input" className={`cursor-pointer ${progress > 0 ? 'opacity-50' : ''}`}>
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Upload CSV File</p>
                <p className="text-sm text-gray-600">
                  Automatic column detection and mapping
                </p>
              </label>
            </div>
            
            {progress > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{progressText}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Upload Error</span>
                </div>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {step === 'preview' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview & Confirm Mapping
                </span>
                <Badge variant={validation.isValid ? 'default' : 'destructive'}>
                  {validation.isValid ? 'Ready' : 'Missing Fields'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                File: <strong>{file?.name}</strong> ({csvData.length - 1} rows)
              </div>
              <div className="text-sm font-medium mb-3 text-gray-700">
                Column Mapping Preview:
              </div>

              <div className="space-y-3">
                {csvData[0]?.map((header, index) => {
                  const mapping = mappings.find(m => m.csvColumn === header)
                  return (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="font-medium text-blue-700">{header}</div>
                        <div className="text-sm text-gray-500">
                          Sample: {csvData[1]?.[index] || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {mapping ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">→</span>
                            <Badge variant="default" className="text-xs">
                              {mapping.targetField}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {(mapping.confidence * 100).toFixed(0)}%
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No mapping</span>
                        )}
                        <Select
                          value={mapping?.targetField || 'none'}
                          onValueChange={(value) => updateMapping(header, value)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Map to field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Don't map</SelectItem>
                            {Object.keys(expectedFields).map(field => (
                              <SelectItem key={field} value={field}>
                                {field}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )
                })}
              </div>

              {!validation.isValid && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-700 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    Auto-detecting columns... Please wait
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('upload')}>
                  Back
                </Button>
                <Button 
                  onClick={processData}
                  disabled={processing}
                  className="flex-1"
                >
                  Process Data ({csvData.length - 1} rows)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'processing' && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-lg font-medium">Processing CSV Data...</p>
            <p className="text-sm text-muted-foreground mb-4">
              {progressText || 'Mapping columns and calculating metrics'}
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Processing Error</span>
                </div>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    setStep('preview')
                    setError(null)
                    setProgress(0)
                    setProgressText('')
                  }}
                >
                  Back to Mapping
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}