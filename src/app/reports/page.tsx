'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  FileText, 
  Download, 
  QrCode,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import jsPDF from 'jspdf'

export default function ReportsPage() {
  const { currentAnalysis } = useAppStore()
  const [generating, setGenerating] = useState(false)
  const [reportSections, setReportSections] = useState({
    summary: true,
    metrics: true,
    charts: true,
    predictions: true,
    optimization: false,
    rawData: false
  })

  const generatePDFReport = async () => {
    if (!currentAnalysis) return

    setGenerating(true)
    
    try {
      const pdf = new jsPDF()
      let yPosition = 30

      // Header
      pdf.setFontSize(20)
      pdf.text('Smart HX AI Lab - Analysis Report', 20, yPosition)
      yPosition += 20

      // Report Info
      pdf.setFontSize(12)
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition)
      yPosition += 10
      pdf.text(`Analysis ID: ${currentAnalysis.id}`, 20, yPosition)
      yPosition += 20

      if (reportSections.summary) {
        pdf.setFontSize(16)
        pdf.text('Executive Summary', 20, yPosition)
        yPosition += 15

        pdf.setFontSize(12)
        pdf.text(`Data Points Analyzed: ${currentAnalysis.data.length}`, 20, yPosition)
        yPosition += 10
        pdf.text(`System Health Score: ${currentAnalysis.metrics.systemHealthScore.toFixed(1)}/100`, 20, yPosition)
        yPosition += 10
        pdf.text(`Overall Status: ${currentAnalysis.metrics.systemHealthScore > 80 ? 'Excellent' : 
          currentAnalysis.metrics.systemHealthScore > 60 ? 'Good' : 'Needs Attention'}`, 20, yPosition)
        yPosition += 20
      }

      if (reportSections.metrics) {
        pdf.setFontSize(16)
        pdf.text('Performance Metrics', 20, yPosition)
        yPosition += 15

        pdf.setFontSize(12)
        const metrics = currentAnalysis.metrics
        pdf.text(`Effectiveness: ${(metrics.effectiveness * 100).toFixed(1)}%`, 20, yPosition)
        yPosition += 10
        pdf.text(`Fouling Rate: ${metrics.foulingRate.toFixed(6)} m²K/W/day`, 20, yPosition)
        yPosition += 10
        pdf.text(`Heat Transfer Coefficient: ${metrics.overallHeatTransferCoeff.toFixed(2)} W/m²K`, 20, yPosition)
        yPosition += 10
        pdf.text(`Energy Efficiency: ${metrics.energyEfficiency.toFixed(1)}%`, 20, yPosition)
        yPosition += 10
        pdf.text(`Recommended Cleaning: ${metrics.recommendedCleaningDays} days`, 20, yPosition)
        yPosition += 20
      }

      if (reportSections.predictions) {
        pdf.setFontSize(16)
        pdf.text('AI Predictions', 20, yPosition)
        yPosition += 15

        pdf.setFontSize(12)
        const predictions = currentAnalysis.predictions
        pdf.text(`Cleaning Schedule: ${predictions.cleaningSchedule}`, 20, yPosition)
        yPosition += 10
        pdf.text(`Confidence Score: ${(predictions.confidenceScore * 100).toFixed(1)}%`, 20, yPosition)
        yPosition += 20
      }

      // QR Code placeholder
      if (yPosition < 250) {
        pdf.setFontSize(10)
        pdf.text('Scan QR code to view online dashboard:', 20, yPosition)
        pdf.rect(20, yPosition + 5, 30, 30) // QR code placeholder
        pdf.text('QR Code', 25, yPosition + 22)
      }

      // Save PDF
      pdf.save(`heat-exchanger-report-${currentAnalysis.id}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setGenerating(false)
    }
  }

  const downloadCSVData = () => {
    if (!currentAnalysis) return

    const csvContent = [
      'timestamp,inletTempHot,outletTempHot,inletTempCold,outletTempCold,flowRateHot,flowRateCold,pressureDrop,foulingResistance',
      ...currentAnalysis.data.map(d => 
        `${d.timestamp},${d.inletTempHot},${d.outletTempHot},${d.inletTempCold},${d.outletTempCold},${d.flowRateHot},${d.flowRateCold},${d.pressureDrop},${d.foulingResistance}`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `heat-exchanger-data-${currentAnalysis.id}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const toggleSection = (section: keyof typeof reportSections) => {
    setReportSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Report Generator</h1>
          <p className="text-muted-foreground">
            Generate comprehensive analysis reports and export data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Report Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {Object.entries(reportSections).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={() => toggleSection(key as keyof typeof reportSections)}
                    />
                    <label htmlFor={key} className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Report Format</h4>
                <div className="space-y-2">
                  <Badge variant="default">PDF Report</Badge>
                  <Badge variant="secondary">CSV Data Export</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                Report Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Professional formatting
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  QR code for online access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Performance charts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  AI insights and recommendations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Traceability information
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Report Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Generate Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentAnalysis ? (
                <>
                  <div className="space-y-4">
                    <Button 
                      onClick={generatePDFReport}
                      disabled={generating}
                      className="w-full"
                      size="lg"
                    >
                      {generating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate PDF Report
                        </>
                      )}
                    </Button>

                    <Button 
                      onClick={downloadCSVData}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV Data
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Report Preview</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Analysis ID: {currentAnalysis.id}</p>
                      <p>Data Points: {currentAnalysis.data.length}</p>
                      <p>Generated: {new Date().toLocaleDateString()}</p>
                      <p>Sections: {Object.values(reportSections).filter(Boolean).length}/6</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-medium mb-2">No Data Available</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload and analyze data to generate reports
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {currentAnalysis ? (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Effectiveness</div>
                    <div className="text-muted-foreground">
                      {currentAnalysis.metrics.effectiveness.toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Energy Efficiency</div>
                    <div className="text-muted-foreground">
                      {currentAnalysis.metrics.energyEfficiency.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Cleaning Due</div>
                    <div className="text-muted-foreground">
                      {currentAnalysis.metrics.recommendedCleaningDays} days
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No analysis data available</p>
                  <p className="text-xs">Use Smart Input or upload data to see summary</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}