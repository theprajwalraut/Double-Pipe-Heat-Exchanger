import { NextRequest, NextResponse } from 'next/server'
import { calculateMetrics, predictFouling } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json({ error: 'Invalid CSV format' }, { status: 400 })
    }

    const headers = lines[0].split(',').map(h => h.trim())
    const expectedHeaders = [
      'timestamp', 'inletTempHot', 'outletTempHot', 'inletTempCold', 
      'outletTempCold', 'flowRateHot', 'flowRateCold', 'pressureDrop', 'foulingResistance'
    ]

    // Check if headers match exactly (for backward compatibility)
    const exactMatch = expectedHeaders.every(h => headers.includes(h))
    if (!exactMatch) {
      return NextResponse.json({ 
        error: `Column names don't match exactly. Use Smart CSV Upload for automatic mapping.`,
        suggestion: 'Try the Smart CSV Upload feature for automatic column detection'
      }, { status: 400 })
    }

    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim())
      const row: any = {}
      
      headers.forEach((header, index) => {
        if (header === 'timestamp') {
          row[header] = values[index]
        } else {
          row[header] = parseFloat(values[index])
        }
      })
      
      return row
    }).filter(row => !Object.values(row).some(v => v === null || v === undefined || (typeof v === 'number' && isNaN(v))))

    if (data.length === 0) {
      return NextResponse.json({ error: 'No valid data rows found' }, { status: 400 })
    }

    const metrics = calculateMetrics(data)
    const predictions = predictFouling(data)
    
    const analysisResult = {
      id: `analysis_${Date.now()}`,
      createdAt: new Date().toISOString(),
      data,
      metrics,
      predictions
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error('Upload processing error:', error)
    return NextResponse.json({ 
      error: 'Failed to process file' 
    }, { status: 500 })
  }
}