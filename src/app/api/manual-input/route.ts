import { NextRequest, NextResponse } from 'next/server'

// Shared storage with existing upload system
let manualInputHistory: any[] = []

// Import shared storage if available
if (typeof global !== 'undefined') {
  global.manualInputHistory = global.manualInputHistory || []
  manualInputHistory = global.manualInputHistory
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    const requiredFields = ['inletTempHot', 'outletTempHot', 'inletTempCold', 'flowRateHot']
    const missingFields = requiredFields.filter(field => !data[field] && data[field] !== 0)
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 })
    }

    // Add metadata
    const inputRecord = {
      id: `manual_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      source: 'manual_input'
    }

    // Store in memory (replace with database save)
    manualInputHistory.push(inputRecord)
    if (typeof global !== 'undefined') {
      global.manualInputHistory = manualInputHistory
    }

    // In production, save to MongoDB:
    /*
    const { MongoClient } = require('mongodb')
    const client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    const db = client.db('heat_exchanger')
    await db.collection('manual_inputs').insertOne(inputRecord)
    await client.close()
    */

    return NextResponse.json({
      success: true,
      data: inputRecord,
      message: 'Data saved successfully'
    })
  } catch (error) {
    console.error('Manual input save error:', error)
    return NextResponse.json({ 
      error: 'Failed to save data' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return all manual input history
    return NextResponse.json({
      success: true,
      data: manualInputHistory,
      count: manualInputHistory.length
    })
  } catch (error) {
    console.error('Manual input fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch data' 
    }, { status: 500 })
  }
}