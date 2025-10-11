export interface HeatExchangerData {
  timestamp: string;
  inletTempHot: number;
  outletTempHot: number;
  inletTempCold: number;
  outletTempCold: number;
  flowRateHot: number;
  flowRateCold: number;
  pressureDrop: number;
  foulingResistance: number;
}

export interface CalculatedMetrics {
  effectiveness: number;
  foulingRate: number;
  overallHeatTransferCoeff: number;
  energyEfficiency: number;
  recommendedCleaningDays: number;
  systemHealthScore: number;
}

export interface PredictionResult {
  futureFoulingResistance: number[];
  cleaningSchedule: string;
  confidenceScore: number;
  predictedU: number[];
  predictedEffectiveness: number[];
}

export interface MLModelResult {
  modelType: 'ANN' | 'SVM' | 'RandomForest' | 'LSTM';
  mae: number;
  rmse: number;
  r2: number;
  accuracy: number;
  predictions: number[];
}

export interface OptimizationParams {
  maxFoulingResistance: number;
  cleaningCost: number;
  downtimeCost: number;
  energyCostPerKWh: number;
}

export interface OptimizationResult {
  optimalCleaningInterval: number;
  energyCostSavings: number;
  totalCostSavings: number;
  recommendedOperatingConditions: {
    inletTemp: number;
    flowRate: number;
  };
}

export interface DatasetHistory {
  id: string;
  filename: string;
  uploadDate: string;
  dataPoints: number;
  avgEffectiveness: number;
  maxFoulingResistance: number;
  status: 'processed' | 'processing' | 'error';
}

export interface AnalysisResult {
  data: HeatExchangerData[];
  metrics: CalculatedMetrics;
  predictions: PredictionResult;
  mlResults?: MLModelResult[];
  optimization?: OptimizationResult;
  id: string;
  createdAt: string;
  filename?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AppSettings {
  darkMode: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  notifications: boolean;
  language: string;
}

export interface ComparisonData {
  dataset1: AnalysisResult;
  dataset2: AnalysisResult;
  differences: {
    effectivenessDiff: number;
    foulingRateDiff: number;
    energyEfficiencyDiff: number;
  };
}