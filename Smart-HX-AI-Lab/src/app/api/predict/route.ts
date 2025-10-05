import { NextRequest, NextResponse } from 'next/server'
import { predictFouling } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json()
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 })
    }

    const predictions = predictFouling(data)
    
    return NextResponse.json({
      success: true,
      predictions
    })
  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate predictions' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI/ML Prediction API',
    endpoints: {
      POST: 'Generate fouling predictions from heat exchanger data'
    }
  })
}