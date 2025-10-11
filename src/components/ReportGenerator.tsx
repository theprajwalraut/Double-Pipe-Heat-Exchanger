'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileText } from 'lucide-react'
import jsPDF from 'jspdf'
import type { AnalysisResult } from '@/types'

interface ReportGeneratorProps {
  analysisResult: AnalysisResult
}

export default function ReportGenerator({ analysisResult }: ReportGeneratorProps) {
  const [generating, setGenerating] = useState(false)

  const generatePDFReport = async () => {
    setGenerating(true)
    
    try {
      const pdf = new jsPDF()
      
      // Title
      pdf.setFontSize(20)
      pdf.text('Smart HX AI Lab - Analysis Report', 20, 30)
      
      // Date
      pdf.setFontSize(12)
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45)
      pdf.text(`Analysis ID: ${analysisResult.id}`, 20, 55)
      
      // Metrics Section
      pdf.setFontSize(16)
      pdf.text('Performance Metrics', 20, 75)
      
      pdf.setFontSize(12)
      const metrics = analysisResult.metrics
      pdf.text(`Effectiveness: ${(metrics.effectiveness * 100).toFixed(1)}%`, 20, 90)
      pdf.text(`Fouling Rate: ${metrics.foulingRate.toFixed(6)}`, 20, 100)
      pdf.text(`Overall Heat Transfer Coefficient: ${metrics.overallHeatTransferCoeff.toFixed(2)} W/m²K`, 20, 110)
      pdf.text(`Energy Efficiency: ${metrics.energyEfficiency.toFixed(1)}%`, 20, 120)
      pdf.text(`Recommended Cleaning: ${metrics.recommendedCleaningDays} days`, 20, 130)
      
      // Predictions Section
      pdf.setFontSize(16)
      pdf.text('AI Predictions', 20, 150)
      
      pdf.setFontSize(12)
      const predictions = analysisResult.predictions
      pdf.text(`Cleaning Schedule: ${predictions.cleaningSchedule}`, 20, 165)
      pdf.text(`Confidence Score: ${(predictions.confidenceScore * 100).toFixed(1)}%`, 20, 175)
      
      // Data Summary
      pdf.setFontSize(16)
      pdf.text('Data Summary', 20, 195)
      
      pdf.setFontSize(12)
      pdf.text(`Total Data Points: ${analysisResult.data.length}`, 20, 210)
      pdf.text(`Analysis Period: ${analysisResult.data[0]?.timestamp} to ${analysisResult.data[analysisResult.data.length - 1]?.timestamp}`, 20, 220)
      
      // Save PDF
      pdf.save(`heat-exchanger-report-${analysisResult.id}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setGenerating(false)
    }
  }

  const downloadCSVData = () => {
    const csvContent = [
      'timestamp,inletTempHot,outletTempHot,inletTempCold,outletTempCold,flowRateHot,flowRateCold,pressureDrop,foulingResistance',
      ...analysisResult.data.map(d => 
        `${d.timestamp},${d.inletTempHot},${d.outletTempHot},${d.inletTempCold},${d.outletTempCold},${d.flowRateHot},${d.flowRateCold},${d.pressureDrop},${d.foulingResistance}`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `heat-exchanger-data-${analysisResult.id}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Report Generation</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              PDF Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Generate a comprehensive PDF report with all metrics, predictions, and recommendations.
            </p>
            <Button 
              onClick={generatePDFReport}
              disabled={generating}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {generating ? 'Generating...' : 'Download PDF Report'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Raw Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Download the processed data in CSV format for further analysis.
            </p>
            <Button 
              onClick={downloadCSVData}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download CSV Data
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium">Analysis ID</div>
              <div className="text-gray-600">{analysisResult.id}</div>
            </div>
            <div>
              <div className="font-medium">Data Points</div>
              <div className="text-gray-600">{analysisResult.data.length}</div>
            </div>
            <div>
              <div className="font-medium">Effectiveness</div>
              <div className="text-gray-600">{(analysisResult.metrics.effectiveness * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div className="font-medium">Cleaning Due</div>
              <div className="text-gray-600">{analysisResult.metrics.recommendedCleaningDays} days</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}