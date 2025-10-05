# Smart HX AI Lab - Professional Heat Exchanger Analysis Platform

🚀 **Advanced AI-powered analysis for double-pipe heat exchanger fouling prediction and performance optimization**

## ✨ Features

### 🏠 **Professional Dashboard**
- Real-time KPI monitoring with animated counters
- System health gauge (0-100 score)
- Live fouling resistance trend charts
- AI-generated insights and recommendations
- Color-coded performance indicators

### 📊 **Smart Data Input**
- Manual parameter input form with validation
- Real-time validation score (0-100%)
- Required field indicators and optional fields
- Instant performance calculations
- CSV upload for batch processing
- Download input history as CSV
- Template CSV download

### 📤 **Enhanced Data Upload**
- Drag & drop CSV upload with preview
- Real-time validation and error handling
- Progress tracking and status indicators
- File information and analysis summary
- Sample data download

### 🧠 **AI Prediction Studio**
- Multiple ML models (ANN, SVM, Random Forest, LSTM)
- Model comparison with performance metrics
- Predicted vs actual visualization
- Downloadable prediction results
- Training progress tracking

### 📊 **Advanced Graph Analysis**
- Interactive temperature trend analysis
- Fouling resistance progression charts
- Effectiveness vs flow rate correlation
- Heat transfer coefficient analysis
- Filterable date ranges and chart types

### ⚙️ **Optimization Tools**
- Cost-based cleaning schedule optimization
- What-if scenario simulator
- Energy savings calculator
- ROI analysis and recommendations
- Operating condition optimization

### 📑 **Professional Reports**
- Customizable PDF report generation
- CSV data export functionality
- QR code integration for traceability
- Performance summaries and insights
- Historical comparison reports

### 🔔 **Smart Features**
- Responsive collapsible sidebar navigation
- Dark/light mode toggle
- Real-time notifications system
- Data history and comparison
- Professional UI with loading states

## 🛠️ Tech Stack

- **Frontend**: React 18 + Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for interactive visualizations
- **State Management**: Zustand with persistence
- **Backend**: Next.js API Routes
- **Database**: MongoDB (optional for history)
- **ML Simulation**: Custom algorithms with extensible architecture
- **PDF Generation**: jsPDF with chart integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and navigate to project**
```bash
cd Smart-HX-AI-Lab
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open application**
```
http://localhost:3000
```

The app will automatically redirect to the dashboard.

## 📁 Project Structure

```
Smart-HX-AI-Lab/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Main dashboard
│   │   ├── smart-input/        # Manual data input form
│   │   ├── upload/             # Data upload interface
│   │   ├── predictions/        # AI/ML prediction studio
│   │   ├── analysis/           # Graph analysis tools
│   │   ├── optimization/       # Cost optimization tools
│   │   ├── reports/            # Report generation
│   │   ├── history/            # Data history management
│   │   ├── settings/           # Application settings
│   │   └── api/                # Backend API routes
│   ├── components/
│   │   ├── layout/             # Sidebar, Navbar
│   │   ├── dashboard/          # KPI cards, gauges, trends
│   │   ├── upload/             # Drag-drop upload components
│   │   └── ui/                 # Reusable UI components
│   ├── lib/
│   │   ├── store.ts            # Zustand state management
│   │   └── utils.ts            # Calculations & ML functions
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── public/
│   ├── sample-data.csv         # Demo dataset
│   └── uploads/                # File upload directory
└── README.md
```

## 📊 CSV Data Format

Your CSV file must include these columns:

| Column | Description | Unit |
|--------|-------------|------|
| `timestamp` | Date/time of measurement | ISO string |
| `inletTempHot` | Hot fluid inlet temperature | °C |
| `outletTempHot` | Hot fluid outlet temperature | °C |
| `inletTempCold` | Cold fluid inlet temperature | °C |
| `outletTempCold` | Cold fluid outlet temperature | °C |
| `flowRateHot` | Hot fluid flow rate | kg/s |
| `flowRateCold` | Cold fluid flow rate | kg/s |
| `pressureDrop` | Pressure drop across exchanger | Pa |
| `foulingResistance` | Fouling resistance | m²K/W |

### Sample Data
```csv
timestamp,inletTempHot,outletTempHot,inletTempCold,outletTempCold,flowRateHot,flowRateCold,pressureDrop,foulingResistance
2024-01-01T00:00:00Z,80.5,65.2,20.1,35.8,2.5,2.2,150.5,0.001
2024-01-01T01:00:00Z,81.2,66.1,19.8,36.2,2.4,2.3,152.1,0.0012
```

## 🔧 API Endpoints

### Data Processing
- `POST /api/upload` - Process CSV data and return analysis
- `POST /api/predict` - Generate AI predictions from data
- `POST /api/manual-input` - Save manual input data
- `GET /api/manual-input` - Retrieve manual input history
- `POST /api/manual-input/csv` - Process CSV upload for manual input
- `GET /api/manual-input/history` - Download input history as CSV

### Response Format
```json
{
  "id": "analysis_1234567890",
  "data": [...],
  "metrics": {
    "effectiveness": 0.78,
    "foulingRate": 0.0025,
    "overallHeatTransferCoeff": 850,
    "energyEfficiency": 78,
    "recommendedCleaningDays": 21,
    "systemHealthScore": 75
  },
  "predictions": {
    "futureFoulingResistance": [...],
    "cleaningSchedule": "Cleaning recommended in 21 days",
    "confidenceScore": 0.85
  }
}
```

## 📈 Calculated Metrics

### Performance Indicators
- **Effectiveness (ε)**: Heat exchanger thermal effectiveness (0-1)
- **Fouling Rate**: Rate of fouling accumulation (m²K/W per day)
- **Overall U**: Heat transfer coefficient (W/m²K)
- **Energy Efficiency**: Overall system efficiency (%)
- **System Health Score**: Combined performance metric (0-100)

### AI Predictions
- **Future Fouling**: 30-day fouling resistance forecast
- **Cleaning Schedule**: Optimal maintenance timing
- **Confidence Score**: Prediction reliability (0-1)

## 🎯 Key Features Walkthrough

### 1. **Dashboard Navigation**
- Collapsible sidebar with 8 main sections
- Responsive design for mobile/desktop
- Real-time notifications and user profile

### 2. **Data Upload Process**
1. Drag & drop CSV file or click to browse
2. Preview data table with validation
3. Upload with progress tracking
4. Automatic analysis and results

### 3. **AI Model Training**
1. Select model type (ANN/SVM/RandomForest/LSTM)
2. Train with progress visualization
3. Compare model performance metrics
4. Download predictions as CSV

### 4. **Optimization Workflow**
1. Set cost parameters (cleaning, downtime, energy)
2. Run optimization algorithm
3. Get optimal cleaning schedule
4. Simulate what-if scenarios

### 5. **Report Generation**
1. Customize report sections
2. Generate PDF with charts and QR codes
3. Export raw data as CSV
4. Share analysis results

## 🔒 Security & Performance

- Input validation and sanitization
- File type and size restrictions
- Error handling and user feedback
- Optimized chart rendering
- Responsive design patterns
- State persistence with Zustand

## 🚀 Production Deployment

### Environment Setup
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@smarthxailab.com
- 📖 Documentation: [docs.smarthxailab.com](https://docs.smarthxailab.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

**Smart HX AI Lab** - Transforming heat exchanger monitoring with AI-powered insights 🚀