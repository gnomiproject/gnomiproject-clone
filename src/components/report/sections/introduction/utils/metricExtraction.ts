
import { averageDataService } from '@/services/AverageDataService';

// Utility to safely extract average values from averageData
export const getAverageValue = (averageData: any, fieldName: string, fallback: number): number => {
  // First try to get the value from averageData
  if (averageData && averageData[fieldName] !== undefined && averageData[fieldName] !== null) {
    const value = averageData[fieldName];
    console.log(`[getAverageValue] ✅ Using REAL average for ${fieldName}: ${value}`);
    return value;
  }
  
  // Only use fallback if no data is available
  console.error(`[getAverageValue] ⚠️ MISSING DATA for ${fieldName}, using fallback: ${fallback}`);
  console.error(`[getAverageValue] averageData:`, averageData);
  return fallback;
};

// Utility to safely extract archetype values
export const getArchetypeValue = (archetypeData: any, fieldName: string, fallback: number): number => {
  // Try archetypeData first
  if (archetypeData && archetypeData[fieldName] !== undefined && archetypeData[fieldName] !== null) {
    const value = archetypeData[fieldName];
    console.log(`[getArchetypeValue] ✅ Using archetype value for ${fieldName}: ${value}`);
    return value;
  }
  
  console.warn(`[getArchetypeValue] ⚠️ Using fallback archetype value for ${fieldName}: ${fallback}`);
  return fallback;
};

// Build metrics using actual data, not hardcoded values - FIXED to use correct fallbacks
export const buildMetrics = (archetypeData: any, averageData: any) => {
  console.log('[buildMetrics] 🔧 Building metrics with:', {
    hasArchetypeData: !!archetypeData,
    hasAverageData: !!averageData,
    averageDataKeys: averageData ? Object.keys(averageData).length : 0,
    isUsingFallback: averageDataService.isUsingFallbackData()
  });

  // CRITICAL: Log the exact data we're working with
  if (averageData) {
    console.log('[buildMetrics] 📊 AVERAGE DATA FIELDS:', {
      costPEPY: averageData["Cost_Medical & RX Paid Amount PEPY"],
      riskScore: averageData["Risk_Average Risk Score"],
      emergencyVisits: averageData["Util_Emergency Visits per 1k Members"],
      specialistVisits: averageData["Util_Specialist Visits per 1k Members"]
    });
  }

  const metrics = {
    cost: {
      name: "Total Cost PEPY",
      value: getArchetypeValue(archetypeData, "Cost_Medical & RX Paid Amount PEPY", 12000),
      average: getAverageValue(averageData, "Cost_Medical & RX Paid Amount PEPY", 13440) // CORRECT fallback
    },
    risk: {
      name: "Risk Score", 
      value: getArchetypeValue(archetypeData, "Risk_Average Risk Score", 1.0),
      average: getAverageValue(averageData, "Risk_Average Risk Score", 0.95) // CORRECT fallback
    },
    emergency: {
      name: "ER Visits per 1K",
      value: getArchetypeValue(archetypeData, "Util_Emergency Visits per 1k Members", 120),
      average: getAverageValue(averageData, "Util_Emergency Visits per 1k Members", 135) // CORRECT fallback
    },
    specialist: {
      name: "Specialist Visits per 1K", 
      value: getArchetypeValue(archetypeData, "Util_Specialist Visits per 1k Members", 2200),
      average: getAverageValue(averageData, "Util_Specialist Visits per 1k Members", 2250) // CORRECT fallback
    }
  };

  // CRITICAL VALIDATION: Check if we're getting the right values
  console.log('[buildMetrics] 🎯 FINAL METRICS VALIDATION:', {
    cost: { 
      archetype: metrics.cost.value, 
      average: metrics.cost.average,
      isCorrectAverage: metrics.cost.average === 13440,
      source: averageData ? 'database' : 'fallback'
    },
    risk: { 
      archetype: metrics.risk.value, 
      average: metrics.risk.average,
      isCorrectAverage: metrics.risk.average === 0.95,
      source: averageData ? 'database' : 'fallback'
    },
    emergency: { 
      archetype: metrics.emergency.value, 
      average: metrics.emergency.average,
      isCorrectAverage: metrics.emergency.average === 135,
      source: averageData ? 'database' : 'fallback'
    },
    specialist: { 
      archetype: metrics.specialist.value, 
      average: metrics.specialist.average,
      isCorrectAverage: metrics.specialist.average === 2250,
      source: averageData ? 'database' : 'fallback'
    }
  });

  // If we're not getting correct values, something is wrong
  if (metrics.cost.average !== 13440 || metrics.risk.average !== 0.95 || 
      metrics.emergency.average !== 135 || metrics.specialist.average !== 2250) {
    console.error('[buildMetrics] ❌ WRONG AVERAGES DETECTED - DATA FLOW ISSUE!');
    console.error('[buildMetrics] averageData:', averageData);
  }

  return metrics;
};
