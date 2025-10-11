'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  History, 
  Search, 
  Download, 
  Eye,
  Trash2,
  Calendar,
  FileText,
  TrendingUp,
  Filter
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function HistoryPage() {
  const { datasetHistory, currentAnalysis, setCurrentAnalysis } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'points'>('date')

  // Mock additional history data for demonstration
  const mockHistory = [
    {
      id: 'hist_001',
      filename: 'hx_data_jan_2024.csv',
      uploadDate: '2024-01-15T10:30:00Z',
      dataPoints: 1440,
      avgEffectiveness: 0.82,
      maxFoulingResistance: 0.045,
      status: 'processed' as const
    },
    {
      id: 'hist_002', 
      filename: 'performance_test_dec.csv',
      uploadDate: '2023-12-20T14:15:00Z',
      dataPoints: 720,
      avgEffectiveness: 0.75,
      maxFoulingResistance: 0.038,
      status: 'processed' as const
    },
    {
      id: 'hist_003',
      filename: 'baseline_measurements.csv',
      uploadDate: '2023-12-01T09:00:00Z',
      dataPoints: 2160,
      avgEffectiveness: 0.88,
      maxFoulingResistance: 0.025,
      status: 'processed' as const
    }
  ]

  const allHistory = [...datasetHistory, ...mockHistory]

  const filteredHistory = allHistory
    .filter(item => 
      item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        case 'name':
          return a.filename.localeCompare(b.filename)
        case 'points':
          return b.dataPoints - a.dataPoints
        default:
          return 0
      }
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'default'
      case 'processing': return 'secondary'
      case 'error': return 'destructive'
      default: return 'secondary'
    }
  }

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness > 0.8) return 'text-green-600'
    if (effectiveness > 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const viewAnalysis = (historyItem: any) => {
    // In a real app, this would load the analysis from storage
    console.log('Loading analysis:', historyItem.id)
  }

  const downloadData = (historyItem: any) => {
    // Mock download functionality
    console.log('Downloading:', historyItem.filename)
  }

  const deleteHistory = (historyItem: any) => {
    // Mock delete functionality
    console.log('Deleting:', historyItem.id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">History & Logs</h1>
          <p className="text-muted-foreground">
            View and manage previous analyses and datasets
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by filename or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'date' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('date')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Date
              </Button>
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('name')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Name
              </Button>
              <Button
                variant={sortBy === 'points' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('points')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Size
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{allHistory.length}</div>
            <p className="text-xs text-muted-foreground">Total Analyses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {allHistory.reduce((sum, h) => sum + h.dataPoints, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Data Points</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {(allHistory.reduce((sum, h) => sum + h.avgEffectiveness, 0) / allHistory.length * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Avg Effectiveness</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {allHistory.filter(h => h.status === 'processed').length}
            </div>
            <p className="text-xs text-muted-foreground">Processed</p>
          </CardContent>
        </Card>
      </div>

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredHistory.length > 0 ? (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{item.filename}</h3>
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        {currentAnalysis?.id === item.id && (
                          <Badge variant="outline">Current</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Uploaded:</span>
                          <br />
                          {formatDate(item.uploadDate)}
                        </div>
                        <div>
                          <span className="font-medium">Data Points:</span>
                          <br />
                          {item.dataPoints.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Effectiveness:</span>
                          <br />
                          <span className={getEffectivenessColor(item.avgEffectiveness)}>
                            {(item.avgEffectiveness * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Max Fouling:</span>
                          <br />
                          {item.maxFoulingResistance.toFixed(4)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewAnalysis(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadData(item)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteHistory(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <History className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? 'No matching results' : 'No analysis history'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Upload and analyze data to build your history'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}