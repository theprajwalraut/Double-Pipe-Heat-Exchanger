import { NextRequest, NextResponse } from 'next/server'

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

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    
    // Map CSV headers to our expected format
    const headerMapping: { [key: string]: string } = {
      'hot_inlet_temp': 'inletTempHot',
      'hot_outlet_temp': 'outletTempHot', 
      'cold_inlet_temp': 'inletTempCold',
      'cold_outlet_temp': 'outletTempCold',
      'hot_flow_rate': 'flowRateHot',
      'cold_flow_rate': 'flowRateCold',
      'pressure_drop': 'pressureDrop',
      'fouling_resistance': 'foulingResistance'
    }

    const processedData = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim())
      const row: any = {
        id: `csv_${Date.now()}_${index}`,
        createdAt: new Date().toISOString(),
        source: 'csv_upload'
      }
      
      headers.forEach((header, i) => {
        const mappedKey = headerMapping[header] || header
        const value = values[i]
        
        if (value && !isNaN(parseFloat(value))) {
          row[mappedKey] = parseFloat(value)
        } else if (value) {
          row[mappedKey] = value
        }
      })
      
      return row
    }).filter(row => row.inletTempHot && row.outletTempHot && row.inletTempCold && row.flowRateHot)

    if (processedData.length === 0) {
      return NextResponse.json({ error: 'No valid data rows found' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: processedData,
      count: processedData.length,
      message: `Successfully processed ${processedData.length} records`
    })
  } catch (error) {
    console.error('CSV upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to process CSV file' 
    }, { status: 500 })
  }
}