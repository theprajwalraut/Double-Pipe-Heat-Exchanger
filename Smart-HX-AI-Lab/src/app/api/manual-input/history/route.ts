import { NextRequest, NextResponse } from 'next/server'

// Use shared storage
let manualInputHistory: any[] = []
if (typeof global !== 'undefined') {
  manualInputHistory = global.manualInputHistory || []
}

export async function GET() {
  try {
    // In production, fetch from MongoDB:
    /*
    const { MongoClient } = require('mongodb')
    const client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    const db = client.db('heat_exchanger')
    const history = await db.collection('manual_inputs').find({}).toArray()
    await client.close()
    */

    // Generate CSV content
    const csvHeaders = [
      'ID',
      'Created At',
      'Hot Inlet Temp (°C)',
      'Hot Outlet Temp (°C)', 
      'Cold Inlet Temp (°C)',
      'Cold Outlet Temp (°C)',
      'Hot Flow Rate (kg/s)',
      'Cold Flow Rate (kg/s)',
      'Pressure Drop (Pa)',
      'Fouling Resistance (m²K/W)',
      'Source'
    ].join(',')

    const csvRows = manualInputHistory.map(record => [
      record.id,
      record.createdAt,
      record.inletTempHot,
      record.outletTempHot,
      record.inletTempCold,
      record.outletTempCold || '',
      record.flowRateHot,
      record.flowRateCold || '',
      record.pressureDrop || '',
      record.foulingResistance || '',
      record.source
    ].join(','))

    const csvContent = [csvHeaders, ...csvRows].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="heat-exchanger-history-${Date.now()}.csv"`
      }
    })
  } catch (error) {
    console.error('History download error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate history CSV' 
    }, { status: 500 })
  }
}