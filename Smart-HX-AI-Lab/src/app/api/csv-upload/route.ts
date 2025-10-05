import { NextRequest, NextResponse } from 'next/server'

// Shared storage for CSV uploads
let csvUploadHistory: any[] = []

if (typeof global !== 'undefined') {
  global.csvUploadHistory = global.csvUploadHistory || []
  csvUploadHistory = global.csvUploadHistory
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, filename } = body
    
    // Validate input
    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ 
        error: 'Invalid data format. Expected array of data points.' 
      }, { status: 400 })
    }

    if (data.length === 0) {
      return NextResponse.json({ 
        error: 'No data points provided.' 
      }, { status: 400 })
    }

    // Validate required fields in data
    const requiredFields = ['inletTempHot', 'outletTempHot', 'inletTempCold', 'flowRateHot']
    const firstRow = data[0]
    const missingFields = requiredFields.filter(field => !(field in firstRow))
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 })
    }

    // Check for reasonable data size (prevent memory issues)
    if (data.length > 10000) {
      return NextResponse.json({ 
        error: 'File too large. Maximum 10,000 rows supported.' 
      }, { status: 413 })
    }

    const uploadRecord = {
      id: `csv_${Date.now()}`,
      filename: filename || 'unknown.csv',
      data,
      uploadedAt: new Date().toISOString(),
      dataPoints: data.length,
      source: 'csv_upload'
    }

    csvUploadHistory.push(uploadRecord)
    
    if (typeof global !== 'undefined') {
      global.csvUploadHistory = csvUploadHistory
    }

    return NextResponse.json({
      success: true,
      id: uploadRecord.id,
      dataPoints: data.length,
      message: 'CSV data processed successfully'
    })
  } catch (error) {
    console.error('CSV upload error:', error)
    
    if (error instanceof SyntaxError) {
      return NextResponse.json({ 
        error: 'Invalid JSON data format' 
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: 'Internal server error during CSV processing' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: csvUploadHistory,
      count: csvUploadHistory.length
    })
  } catch (error) {
    console.error('CSV history fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch CSV history' 
    }, { status: 500 })
  }
}