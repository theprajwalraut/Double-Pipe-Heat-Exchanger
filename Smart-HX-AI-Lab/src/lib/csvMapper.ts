// Smart CSV column mapping utility
export interface FieldMapping {
  csvColumn: string
  targetField: string
  confidence: number
}

export const expectedFields = {
  timestamp: ['timestamp', 'time', 'date', 't', 'datetime', 'Time', 'DateTime'],
  inletTempHot: ['inletTempHot', 'T_hot_in', 'hot_inlet_temp', 'inlet_temp_hot', 'Th_in', 'Th_inlet', 'hot_in', 'T_h_in', 'temp_hot_in', 'hot_inlet', 'inlet_hot'],
  outletTempHot: ['outletTempHot', 'T_hot_out', 'hot_outlet_temp', 'outlet_temp_hot', 'Th_out', 'Th_outlet', 'hot_out', 'T_h_out', 'temp_hot_out', 'hot_outlet', 'outlet_hot'],
  inletTempCold: ['inletTempCold', 'T_cold_in', 'cold_inlet_temp', 'inlet_temp_cold', 'Tc_in', 'Tc_inlet', 'cold_in', 'T_c_in', 'temp_cold_in', 'cold_inlet', 'inlet_cold'],
  outletTempCold: ['outletTempCold', 'T_cold_out', 'cold_outlet_temp', 'outlet_temp_cold', 'Tc_out', 'Tc_outlet', 'cold_out', 'T_c_out', 'temp_cold_out', 'cold_outlet', 'outlet_cold'],
  flowRateHot: ['flowRateHot', 'flow_hot', 'hot_flow_rate', 'mh', 'm_hot', 'flow_rate_hot', 'mass_flow_hot', 'mass_flow_h', 'flowrate_hot', 'hot_mass_flow'],
  flowRateCold: ['flowRateCold', 'flow_cold', 'cold_flow_rate', 'mc', 'm_cold', 'flow_rate_cold', 'mass_flow_cold', 'mass_flow_c', 'flowrate_cold', 'cold_mass_flow'],
  pressureDrop: ['pressureDrop', 'pressure_drop', 'dp', 'delta_p', 'press_drop', 'dP', 'ΔP', 'pressure', 'deltap', 'delta_pressure'],
  foulingResistance: ['foulingResistance', 'Rf', 'fouling_resistance', 'R_f', 'fouling', 'resistance', 'fouling_factor', 'fouling_factor', 'R_fouling', 'fouling_res']
}

function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '')
  const s2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '')
  
  if (s1 === s2) return 1.0
  if (s1.includes(s2) || s2.includes(s1)) return 0.9
  
  // Check for common abbreviations
  const abbrevs = {
    'temp': 'temperature', 'press': 'pressure', 'flow': 'flowrate',
    'in': 'inlet', 'out': 'outlet', 'hot': 'h', 'cold': 'c'
  }
  
  let expandedS1 = s1, expandedS2 = s2
  Object.entries(abbrevs).forEach(([short, long]) => {
    expandedS1 = expandedS1.replace(short, long)
    expandedS2 = expandedS2.replace(short, long)
  })
  
  if (expandedS1 === expandedS2) return 0.95
  if (expandedS1.includes(expandedS2) || expandedS2.includes(expandedS1)) return 0.85
  
  // Levenshtein distance
  const matrix = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null))
  
  for (let i = 0; i <= s1.length; i++) matrix[0][i] = i
  for (let j = 0; j <= s2.length; j++) matrix[j][0] = j
  
  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      )
    }
  }
  
  const maxLen = Math.max(s1.length, s2.length)
  return maxLen === 0 ? 1 : 1 - matrix[s2.length][s1.length] / maxLen
}

export function autoMapColumns(csvHeaders: string[]): FieldMapping[] {
  const mappings: FieldMapping[] = []
  
  Object.entries(expectedFields).forEach(([targetField, patterns]) => {
    let bestMatch = { column: '', confidence: 0 }
    
    csvHeaders.forEach(csvColumn => {
      patterns.forEach(pattern => {
        const confidence = calculateSimilarity(csvColumn, pattern)
        if (confidence > bestMatch.confidence && confidence > 0.5) {
          bestMatch = { column: csvColumn, confidence }
        }
      })
    })
    
    if (bestMatch.confidence > 0.5) {
      mappings.push({
        csvColumn: bestMatch.column,
        targetField,
        confidence: bestMatch.confidence
      })
    }
  })
  
  return mappings
}

export function validateMappings(mappings: FieldMapping[]): { isValid: boolean; missing: string[]; suggestions: string[] } {
  const requiredFields = ['inletTempHot', 'outletTempHot', 'inletTempCold', 'flowRateHot']
  const mappedFields = mappings.map(m => m.targetField)
  const missing = requiredFields.filter(field => !mappedFields.includes(field))
  
  return {
    isValid: missing.length === 0,
    missing,
    suggestions: []
  }
}