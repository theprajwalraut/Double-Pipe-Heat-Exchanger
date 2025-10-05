import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing upload ID' }, { status: 400 })
    }

    const csvUploadHistory = (global as any)?.csvUploadHistory || []
    const record = csvUploadHistory.find((r: any) => r.id === id)
    
    if (!record) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 })
    }

    const headers = [
      'timestamp',
      'inletTempHot', 
      'outletTempHot',
      'inletTempCold',
      'outletTempCold',
      'flowRateHot',
      'flowRateCold', 
      'pressureDrop',
      'foulingResistance'
    ]

    const csvContent = [
      headers.join(','),
      ...record.data.map((row: any) => 
        headers.map(header => row[header] || '').join(',')
      )
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="processed-${record.filename}"`
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}