'use client'

import { useCallback, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Papa from 'papaparse'

interface DragDropUploadProps {
  onFileSelect: (file: File) => void
  onUploadComplete: (result: any) => void
  className?: string
}

export default function DragDropUpload({ 
  onFileSelect, 
  onUploadComplete, 
  className 
}: DragDropUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string[][] | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please select a valid CSV file')
      return
    }
    
    setFile(selectedFile)
    setError(null)
    onFileSelect(selectedFile)
    
    // Generate preview using papaparse
    Papa.parse(selectedFile, {
      header: false,
      preview: 6,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length === 0) {
          setPreview(results.data as string[][])
        }
      },
      error: () => {
        setError('Failed to preview CSV file')
      }
    })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      onUploadComplete(result)
      
      // Reset after successful upload
      setTimeout(() => {
        setFile(null)
        setPreview(null)
        setUploadProgress(0)
      }, 2000)

    } catch (err) {
      setError('Failed to upload and process file')
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    setUploadProgress(0)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Drop Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive 
                ? "border-primary bg-primary/5" 
                : "border-gray-300 hover:border-gray-400",
              file && "border-green-300 bg-green-50"
            )}
          >
            <input
              id="file-input"
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
            />
            
            {file ? (
              <div className="space-y-4">
                <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
                <div>
                  <p className="text-lg font-medium text-green-700">
                    File Selected
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile()
                  }}
                  className="mx-auto"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-gray-400" />
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive 
                      ? "Drop the CSV file here" 
                      : "Drag & drop CSV file here"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    or click to browse files
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  Supported format: CSV files only
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Preview */}
      {preview && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-4 w-4" />
              <h3 className="font-medium">Data Preview</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {preview.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex === 0 ? 'font-medium bg-gray-50' : ''}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 border-b">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Showing first 5 rows of data
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {uploading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing file...</span>
                <span className="text-sm text-gray-600">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-gray-500">
                Validating data format and running analysis
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Upload Error</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Upload Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          size="lg"
          className="px-8"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload & Analyze
            </>
          )}
        </Button>
      </div>

      {/* Expected Format */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Expected CSV Format</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Required columns:</strong></p>
                <ul className="list-disc list-inside space-y-0.5 ml-4">
                  <li>timestamp</li>
                  <li>inletTempHot, outletTempHot</li>
                  <li>inletTempCold, outletTempCold</li>
                  <li>flowRateHot, flowRateCold</li>
                  <li>pressureDrop, foulingResistance</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}