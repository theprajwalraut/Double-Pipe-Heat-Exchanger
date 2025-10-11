import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { HeatExchangerData, CalculatedMetrics, PredictionResult, MLModelResult, OptimizationParams, OptimizationResult } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateMetrics(data: HeatExchangerData[]): CalculatedMetrics {
  if (!data || !data.length) {
    return {
      effectiveness: 0,
      foulingRate: 0,
      overallHeatTransferCoeff: 0,
      energyEfficiency: 0,
      recommendedCleaningDays: 30,
      systemHealthScore: 0
    };
  }

  const avgFoulingResistance = data.reduce((sum, d) => sum + d.foulingResistance, 0) / data.length;
  const effectiveness = Math.max(0, Math.min(1, 0.85 - avgFoulingResistance * 0.1));
  const foulingRate = data.length > 1 ? 
    (data[data.length - 1].foulingResistance - data[0].foulingResistance) / data.length : 0;
  const overallHeatTransferCoeff = 1000 / (1 + avgFoulingResistance * 100);
  const energyEfficiency = effectiveness * 100;
  const recommendedCleaningDays = Math.max(7, Math.min(90, 30 - avgFoulingResistance * 200));
  
  // Calculate system health score (0-100)
  const healthFactors = [
    effectiveness * 100,
    Math.max(0, 100 - Math.abs(foulingRate) * 10000),
    Math.min(100, overallHeatTransferCoeff / 10),
    energyEfficiency
  ];
  const systemHealthScore = healthFactors.reduce((sum, factor) => sum + factor, 0) / healthFactors.length;

  return {
    effectiveness: Number(effectiveness.toFixed(3)),
    foulingRate: Number(foulingRate.toFixed(6)),
    overallHeatTransferCoeff: Number(overallHeatTransferCoeff.toFixed(2)),
    energyEfficiency: Number(energyEfficiency.toFixed(1)),
    recommendedCleaningDays: Math.round(recommendedCleaningDays),
    systemHealthScore: Number(systemHealthScore.toFixed(1))
  };
}

export function predictFouling(data: HeatExchangerData[]): PredictionResult {
  if (!data.length) throw new Error('No data provided');

  const currentFouling = data[data.length - 1]?.foulingResistance || 0;
  const trend = data.length > 1 ? 
    (data[data.length - 1].foulingResistance - data[0].foulingResistance) / data.length : 0.001;

  const futureFoulingResistance = Array.from({ length: 30 }, (_, i) => 
    Math.max(0, currentFouling + trend * (i + 1))
  );

  const predictedU = futureFoulingResistance.map(f => 1000 / (1 + f * 100));
  const predictedEffectiveness = futureFoulingResistance.map(f => Math.max(0, Math.min(1, 0.85 - f * 0.1)));

  const cleaningThreshold = 0.05;
  const daysUntilCleaning = futureFoulingResistance.findIndex(f => f > cleaningThreshold);
  
  return {
    futureFoulingResistance,
    predictedU,
    predictedEffectiveness,
    cleaningSchedule: daysUntilCleaning > 0 ? 
      `Cleaning recommended in ${daysUntilCleaning} days` : 
      "Immediate cleaning recommended",
    confidenceScore: Math.max(0.6, Math.min(0.95, 0.8 - Math.abs(trend) * 10))
  };
}

export function runMLModel(data: HeatExchangerData[], modelType: MLModelResult['modelType']): MLModelResult {
  // Simplified ML simulation - in production, use actual ML libraries
  const predictions = data.map((d, i) => {
    const noise = (Math.random() - 0.5) * 0.01;
    return d.foulingResistance + noise;
  });

  const actual = data.map(d => d.foulingResistance);
  const mae = actual.reduce((sum, val, i) => sum + Math.abs(val - predictions[i]), 0) / actual.length;
  const rmse = Math.sqrt(actual.reduce((sum, val, i) => sum + Math.pow(val - predictions[i], 2), 0) / actual.length);
  
  const meanActual = actual.reduce((sum, val) => sum + val, 0) / actual.length;
  const ssRes = actual.reduce((sum, val, i) => sum + Math.pow(val - predictions[i], 2), 0);
  const ssTot = actual.reduce((sum, val) => sum + Math.pow(val - meanActual, 2), 0);
  const r2 = 1 - (ssRes / ssTot);
  
  const accuracy = Math.max(0, Math.min(100, (1 - mae / meanActual) * 100));

  return {
    modelType,
    mae: Number(mae.toFixed(6)),
    rmse: Number(rmse.toFixed(6)),
    r2: Number(r2.toFixed(3)),
    accuracy: Number(accuracy.toFixed(1)),
    predictions
  };
}

export function optimizeOperations(data: HeatExchangerData[], params: OptimizationParams): OptimizationResult {
  const currentMetrics = calculateMetrics(data);
  const avgEnergyConsumption = 1000; // kWh/day baseline
  
  // Calculate optimal cleaning interval based on fouling rate and costs
  const dailyFoulingIncrease = Math.abs(currentMetrics.foulingRate);
  const daysToThreshold = params.maxFoulingResistance / Math.max(dailyFoulingIncrease, 0.0001);
  
  const cleaningCostPerDay = params.cleaningCost / Math.max(daysToThreshold, 1);
  const energyLossPerDay = avgEnergyConsumption * (1 - currentMetrics.energyEfficiency / 100) * params.energyCostPerKWh;
  
  const optimalCleaningInterval = Math.max(7, Math.min(90, daysToThreshold * 0.8));
  const energyCostSavings = energyLossPerDay * 30; // Monthly savings
  const totalCostSavings = energyCostSavings - (params.cleaningCost + params.downtimeCost);
  
  // Recommend optimal operating conditions
  const avgInletTemp = data.reduce((sum, d) => sum + d.inletTempHot, 0) / data.length;
  const avgFlowRate = data.reduce((sum, d) => sum + d.flowRateHot, 0) / data.length;
  
  return {
    optimalCleaningInterval: Math.round(optimalCleaningInterval),
    energyCostSavings: Number(energyCostSavings.toFixed(2)),
    totalCostSavings: Number(totalCostSavings.toFixed(2)),
    recommendedOperatingConditions: {
      inletTemp: Number((avgInletTemp * 0.95).toFixed(1)), // Slightly lower temp
      flowRate: Number((avgFlowRate * 1.05).toFixed(2))    // Slightly higher flow
    }
  };
}

export function generateInsights(data: HeatExchangerData[], metrics: CalculatedMetrics): string[] {
  const insights: string[] = [];
  
  if (metrics.systemHealthScore > 80) {
    insights.push("System is operating in excellent condition.");
  } else if (metrics.systemHealthScore > 60) {
    insights.push("System performance is acceptable but could be improved.");
  } else {
    insights.push("System requires immediate attention - performance is below optimal.");
  }
  
  if (metrics.foulingRate > 0.001) {
    insights.push(`Fouling is accumulating at ${(metrics.foulingRate * 1000000).toFixed(2)} μm²K/W per day.`);
  }
  
  if (metrics.energyEfficiency < 70) {
    insights.push("Energy efficiency is low - consider cleaning or operational adjustments.");
  }
  
  if (metrics.recommendedCleaningDays < 14) {
    insights.push("Frequent cleaning may be required due to high fouling rate.");
  }
  
  const avgTemp = data.reduce((sum, d) => sum + d.inletTempHot, 0) / data.length;
  if (avgTemp > 85) {
    insights.push("High inlet temperatures may be accelerating fouling formation.");
  }
  
  return insights;
}

export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}