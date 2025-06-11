
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
  console.warn(`[getAverageValue] ⚠️ Using FALLBACK average for ${fieldName}: ${fallback}`);
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

// Build metrics using actual data, not hardcoded values
export const buildMetrics = (archetypeData: any, averageData: any) => {
  console.log('[buildMetrics] Building metrics with:', {
    hasArchetypeData: !!archetypeData,
    hasAverageData: !!averageData,
    averageDataKeys: averageData ? Object.keys(averageData).length : 0,
    isUsingFallback: averageDataService.isUsingFallbackData()
  });

  const metrics = {
    cost: {
      name: "Total Cost PEPY",
      value: getArchetypeValue(archetypeData, "Cost_Medical & RX Paid Amount PEPY", 12000),
      average: getAverageValue(averageData, "Cost_Medical & RX Paid Amount PEPY", 13440)
    },
    risk: {
      name: "Risk Score", 
      value: getArchetypeValue(archetypeData, "Risk_Average Risk Score", 1.0),
      average: getAverageValue(averageData, "Risk_Average Risk Score", 0.95)
    },
    emergency: {
      name: "ER Visits per 1K",
      value: getArchetypeValue(archetypeData, "Util_Emergency Visits per 1k Members", 120),
      average: getAverageValue(averageData, "Util_Emergency Visits per 1k Members", 135)
    },
    specialist: {
      name: "Specialist Visits per 1K", 
      value: getArchetypeValue(archetypeData, "Util_Specialist Visits per 1k Members", 2200),
      average: getAverageValue(averageData, "Util_Specialist Visits per 1k Members", 2250)
    }
  };

  // Validation logging
  console.log('[buildMetrics] FINAL METRICS:', {
    cost: { 
      archetype: metrics.cost.value, 
      average: metrics.cost.average,
      isCorrectAverage: metrics.cost.average === 13440
    },
    risk: { 
      archetype: metrics.risk.value, 
      average: metrics.risk.average,
      isCorrectAverage: metrics.risk.average === 0.95
    },
    emergency: { 
      archetype: metrics.emergency.value, 
      average: metrics.emergency.average,
      isCorrectAverage: metrics.emergency.average === 135
    },
    specialist: { 
      archetype: metrics.specialist.value, 
      average: metrics.specialist.average,
      isCorrectAverage: metrics.specialist.average === 2250
    }
  });

  return metrics;
};
