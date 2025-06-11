
import { averageDataService } from '@/services/AverageDataService';

// Utility to safely extract average values from averageData
export const getAverageValue = (averageData: any, fieldName: string, fallback: number): number => {
  // First try to get the value from averageData
  if (averageData && averageData[fieldName] !== undefined && averageData[fieldName] !== null) {
    const value = averageData[fieldName];
    console.log(`[getAverageValue] ✅ Using average value for ${fieldName}: ${value}`);
    return value;
  }
  
  // Only use fallback if no data is available
  console.warn(`[getAverageValue] ⚠️ MISSING DATA for ${fieldName}, using fallback: ${fallback}`);
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
  console.log('[buildMetrics] 🔧 Building metrics with:', {
    hasArchetypeData: !!archetypeData,
    hasAverageData: !!averageData,
    averageDataKeys: averageData ? Object.keys(averageData).length : 0,
    isUsingFallback: averageDataService.isUsingFallbackData()
  });

  // Log the exact data we're working with
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

  // Log final metrics for debugging
  console.log('[buildMetrics] 🎯 FINAL METRICS:', {
    cost: { 
      archetype: metrics.cost.value, 
      average: metrics.cost.average,
      source: averageData ? 'database' : 'fallback'
    },
    risk: { 
      archetype: metrics.risk.value, 
      average: metrics.risk.average,
      source: averageData ? 'database' : 'fallback'
    },
    emergency: { 
      archetype: metrics.emergency.value, 
      average: metrics.emergency.average,
      source: averageData ? 'database' : 'fallback'
    },
    specialist: { 
      archetype: metrics.specialist.value, 
      average: metrics.specialist.average,
      source: averageData ? 'database' : 'fallback'
    }
  });

  return metrics;
};
