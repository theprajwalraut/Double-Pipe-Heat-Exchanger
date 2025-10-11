'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  ArrowLeft, 
  Download, 
  Zap, 
  Settings, 
  Thermometer,
  Calculator,
  Factory,
  Lightbulb
} from 'lucide-react'

export default function LearningHubPage() {
  const [activeTab, setActiveTab] = useState('construction')

  const downloadPDF = () => {
    const printContent = `
      <html>
        <head>
          <title>Double-Pipe Heat Exchanger - Learning Guide</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
            h2 { color: #059669; margin-top: 30px; }
            h3 { color: #dc2626; }
            .page-break { page-break-before: always; }
            .equation { background: #f3f4f6; padding: 15px; text-align: center; font-size: 18px; margin: 10px 0; }
            .highlight { background: #fef3c7; padding: 10px; border-left: 4px solid #f59e0b; }
            ul { margin: 10px 0; }
            li { margin: 5px 0; }
          </style>
        </head>
        <body>
          <h1>🔥 Double-Pipe Heat Exchanger - Complete Learning Guide</h1>
          
          <h2>🏗️ Construction</h2>
          <p>The double-pipe heat exchanger consists of two concentric pipes, one placed inside the other.</p>
          <ul>
            <li><strong>Inner Tube:</strong> Carries one fluid (hot or cold)</li>
            <li><strong>Outer Tube:</strong> Contains the annular space for second fluid</li>
            <li><strong>Inlet/Outlet Connections:</strong> For fluid entry and exit</li>
            <li><strong>Support Structure:</strong> Maintains alignment and stability</li>
          </ul>
          
          <div class="highlight">
            <strong>Key Points:</strong><br>
            • Hot fluid flows through the inner tube, while cold fluid flows through the outer annular space<br>
            • Heat is transferred through the metal wall separating the fluids<br>
            • Materials: Commonly made of copper, stainless steel, or carbon steel<br>
            • Insulation: The outer surface is often insulated to prevent heat loss
          </div>
          
          <h2>⚡ Working Principle</h2>
          <p>The double-pipe heat exchanger works on the principle of conduction and convection.</p>
          
          <h3>Heat Transfer Process:</h3>
          <ul>
            <li>When hot fluid flows through one pipe and cold fluid through the other, heat energy transfers from the hotter fluid to the cooler one through the pipe wall</li>
            <li>The rate of heat transfer depends on temperature difference, flow rate, and material conductivity</li>
            <li>In counter-flow, fluids move in opposite directions, providing maximum temperature difference and higher efficiency</li>
            <li>In parallel-flow, both fluids move in the same direction, leading to lower efficiency but simpler design</li>
          </ul>
          
          <div class="page-break"></div>
          
          <h2>🏭 Industrial Applications</h2>
          <p>Double-pipe heat exchangers are ideal for small-scale industries and laboratory use where compact design and easy cleaning are needed.</p>
          
          <h3>Common Applications:</h3>
          <ul>
            <li><strong>Power Plants:</strong> Cooling turbine oil and preheating boiler feed water</li>
            <li><strong>Chemical Industries:</strong> Temperature control of reactor fluids</li>
            <li><strong>Food Processing:</strong> Milk pasteurization and juice heating</li>
            <li><strong>HVAC Systems:</strong> Heat recovery and air preheating</li>
          </ul>
          
          <h3>Advantages:</h3>
          <ul>
            <li>Easy to fabricate and maintain</li>
            <li>Compact and suitable for low-to-moderate heat duties</li>
            <li>Can be easily modified for series or parallel arrangements</li>
          </ul>
          
          <h2>📐 Design Equations</h2>
          <p>The performance of a double-pipe heat exchanger is evaluated using heat transfer and effectiveness equations.</p>
          
          <h3>Heat Transfer Rate:</h3>
          <div class="equation">Q = U × A × ΔT<sub>lm</sub></div>
          <ul>
            <li><strong>Q:</strong> Heat transferred (W)</li>
            <li><strong>U:</strong> Overall heat transfer coefficient (W/m²·K)</li>
            <li><strong>A:</strong> Heat transfer area (m²)</li>
            <li><strong>ΔT<sub>lm</sub>:</strong> Log Mean Temperature Difference (K)</li>
          </ul>
          
          <h3>Effectiveness:</h3>
          <div class="equation">ε = Q<sub>actual</sub> / Q<sub>max</sub></div>
          <p>Effectiveness measures how well the heat exchanger performs compared to the maximum possible heat transfer.</p>
          
          <h3>Log Mean Temperature Difference:</h3>
          <div class="equation">ΔT<sub>lm</sub> = (ΔT₁ - ΔT₂) / ln(ΔT₁/ΔT₂)</div>
          <ul>
            <li><strong>ΔT₁:</strong> Temperature difference at one end</li>
            <li><strong>ΔT₂:</strong> Temperature difference at other end</li>
          </ul>
          
          <div class="highlight">
            <strong>Note:</strong> Overall Heat Transfer Coefficient (U) depends on fluid properties, fouling resistance, and tube wall material.
          </div>
          
          <hr style="margin-top: 30px;">
          <p style="text-align: center; color: #6b7280; font-size: 12px;">
            Generated from Smart HX AI Lab - Double-Pipe Heat Exchanger Learning Hub
          </p>
        </body>
      </html>
    `
    
    const printWindow = window.open('', '_blank')
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            📘 Learning Hub
          </h1>
          <p className="text-muted-foreground">
            🎓 Complete guide to Double-Pipe Heat Exchanger theory and applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={() => window.location.href = '/dashboard'}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="construction" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Construction
          </TabsTrigger>
          <TabsTrigger value="working" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Working
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <Factory className="h-4 w-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="equations" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Equations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="construction">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Settings className="h-5 w-5" />
                🏗️ Construction of Double-Pipe Heat Exchanger
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-700">🔧 Main Components</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">1</Badge>
                      <span><strong>Inner Tube:</strong> Carries one fluid (hot or cold)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">2</Badge>
                      <span><strong>Outer Tube:</strong> Contains the annular space for second fluid</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">3</Badge>
                      <span><strong>Inlet/Outlet Connections:</strong> For fluid entry and exit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">4</Badge>
                      <span><strong>Support Structure:</strong> Maintains alignment and stability</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <img 
                    src="/double-pipe-heat-exchanger%20photo.png" 
                    alt="Double Pipe Heat Exchanger" 
                    className="w-full h-56 object-contain rounded-lg bg-white p-2"
                    onError={(e) => {
                      e.currentTarget.src = '/Double-Pipe_Heat_Exchangerphoto2.webp'
                    }}
                  />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-700 mb-3">📚 Construction Details</h4>
                <div className="space-y-3 text-sm text-blue-600">
                  <p>• The double-pipe heat exchanger consists of two concentric pipes, one placed inside the other.</p>
                  <p>• Hot fluid flows through the inner tube, while cold fluid flows through the outer annular space.</p>
                  <p>• Heat is transferred through the metal wall separating the fluids.</p>
                  <p>• The setup can be arranged horizontally or vertically depending on space and process needs.</p>
                  <p>• <strong>Materials:</strong> Commonly made of copper, stainless steel, or carbon steel for better heat conduction and corrosion resistance.</p>
                  <p>• <strong>Insulation:</strong> The outer surface is often insulated to prevent heat loss to the environment.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="working">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Zap className="h-5 w-5" />
                ⚡ Working Principle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-700">🌡️ Heat Transfer Process</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-700">Step 1: Fluid Entry</h4>
                      <p className="text-sm text-green-600">Hot and cold fluids enter through separate inlets</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-700">Step 2: Heat Exchange</h4>
                      <p className="text-sm text-green-600">Heat transfers through the inner tube wall</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-700">🔄 Flow Configurations</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-700">Counter-Current Flow</h4>
                      <p className="text-sm text-green-600">Fluids flow in opposite directions - Maximum efficiency</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-700">Co-Current Flow</h4>
                      <p className="text-sm text-green-600">Fluids flow in same direction - Lower efficiency</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-700 mb-3">🔬 Working Principle Details</h4>
                <div className="space-y-3 text-sm text-green-600">
                  <p>• The double-pipe heat exchanger works on the principle of conduction and convection.</p>
                  <p>• When the hot fluid flows through one pipe and the cold fluid through the other, heat energy transfers from the hotter fluid to the cooler one through the pipe wall.</p>
                  <p>• The rate of heat transfer depends on temperature difference, flow rate, and material conductivity.</p>
                  <p>• In counter-flow, the fluids move in opposite directions, providing maximum temperature difference and higher efficiency.</p>
                  <p>• In parallel-flow, both fluids move in the same direction, leading to lower efficiency but simpler design.</p>
                  <p>• Heat exchangers often include baffles or fins to improve turbulence and heat transfer.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Factory className="h-5 w-5" />
                🏭 Industrial Applications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white p-4 rounded-lg border border-purple-200 mb-4">
                <p className="text-sm text-purple-600 mb-3">
                  • Double-pipe heat exchangers are ideal for small-scale industries and laboratory use where compact design and easy cleaning are needed.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-700">🏢 Common Applications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-white rounded border">
                      <Badge className="bg-purple-100 text-purple-700">Power Plants</Badge>
                      <span className="text-sm">Cooling turbine oil and preheating boiler feed water</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-white rounded border">
                      <Badge className="bg-purple-100 text-purple-700">Chemical</Badge>
                      <span className="text-sm">Temperature control of reactor fluids</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-white rounded border">
                      <Badge className="bg-purple-100 text-purple-700">Food</Badge>
                      <span className="text-sm">Milk pasteurization and juice heating</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-white rounded border">
                      <Badge className="bg-purple-100 text-purple-700">HVAC</Badge>
                      <span className="text-sm">Heat recovery and air preheating</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-700">✨ Advantages</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>Easy to fabricate and maintain</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>Compact and suitable for low-to-moderate heat duties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>Can be easily modified for series or parallel arrangements to meet temperature requirements</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-700 mb-3">🏭 Industrial Photos</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <img 
                    src="/double-pipe-heat-exchanger%20photo.png" 
                    alt="Industrial Heat Exchanger" 
                    className="w-full h-40 object-contain rounded-lg border bg-white p-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling.style.display = 'flex'
                    }}
                  />
                  <div className="w-full h-32 bg-purple-100 rounded-lg border flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-purple-600 text-sm">Heat Exchanger Image</span>
                  </div>
                  <img 
                    src="/Double-Pipe_Heat_Exchangerphoto2.webp" 
                    alt="Heat Exchanger Diagram" 
                    className="w-full h-40 object-contain rounded-lg border bg-white p-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling.style.display = 'flex'
                    }}
                  />
                  <div className="w-full h-32 bg-purple-100 rounded-lg border flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-purple-600 text-sm">Heat Exchanger Diagram</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equations">
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Calculator className="h-5 w-5" />
                📐 Design Equations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white p-4 rounded-lg border border-orange-200 mb-4">
                <p className="text-sm text-orange-600">
                  • The performance of a double-pipe heat exchanger is evaluated using heat transfer and effectiveness equations.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-700 mb-3">🔥 Heat Transfer Rate</h3>
                <div className="bg-orange-50 p-4 rounded-lg font-mono text-center text-lg mb-3">
                  Q = U × A × ΔT<sub>lm</sub>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-2 bg-orange-50 rounded">
                    <strong>Q:</strong> Heat transferred (W)
                  </div>
                  <div className="p-2 bg-orange-50 rounded">
                    <strong>U:</strong> Overall heat transfer coefficient (W/m²·K)
                  </div>
                  <div className="p-2 bg-orange-50 rounded">
                    <strong>A:</strong> Heat transfer area (m²)
                  </div>
                  <div className="p-2 bg-orange-50 rounded">
                    <strong>ΔT<sub>lm</sub>:</strong> Log Mean Temperature Difference (K)
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-700 mb-3">🎯 Effectiveness (ε)</h3>
                <div className="bg-orange-50 p-4 rounded-lg font-mono text-center text-lg mb-3">
                  ε = Q<sub>actual</sub> / Q<sub>max</sub>
                </div>
                <p className="text-sm text-orange-600">
                  Effectiveness measures how well the heat exchanger performs compared to the maximum possible heat transfer.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-700 mb-3">📊 Log Mean Temperature Difference</h3>
                <div className="bg-orange-50 p-4 rounded-lg font-mono text-center text-lg mb-3">
                  ΔT<sub>lm</sub> = (ΔT₁ - ΔT₂) / ln(ΔT₁/ΔT₂)
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-2 bg-orange-50 rounded">
                    <strong>ΔT₁:</strong> Temperature difference at one end
                  </div>
                  <div className="p-2 bg-orange-50 rounded">
                    <strong>ΔT₂:</strong> Temperature difference at other end
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-700 mb-3">⚙️ Overall Heat Transfer Coefficient (U)</h3>
                <p className="text-sm text-orange-600 mb-3">
                  Depends on fluid properties, fouling resistance, and tube wall material.
                </p>
                <div className="bg-orange-50 p-3 rounded-lg text-sm">
                  <strong>Note:</strong> Include small explanation boxes or hover tooltips for each term (Q, U, A, ΔT<sub>lm</sub>) for better learning experience.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}