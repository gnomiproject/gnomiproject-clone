
import { averageDataService, StandardizedAverageData } from './AverageDataService';

export interface PercentageResult {
  percentageDifference: number;
  formattedDifference: string;
  comparisonText: string;
  colorClass: string;
  isValid: boolean;
  debugInfo?: {
    value: number;
    average: number;
    calculation: string;
  };
}

export interface MetricMapping {
  getValue: (data: any) => number;
  getAverage: (avgData: StandardizedAverageData) => number;
  isLowerBetter?: boolean;
}

class PercentageCalculatorService {
  private averageData: StandardizedAverageData | null = null;

  // Predefined metric mappings for consistent calculations
  private metricMappings: Record<string, MetricMapping> = {
    // Demographic metrics
    'Demo_Average Age': {
      getValue: (data) => data["Demo_Average Age"],
      getAverage: (avg) => avg.averageAge
    },
    'Demo_Average Family Size': {
      getValue: (data) => data["Demo_Average Family Size"],
      getAverage: (avg) => avg.averageFamilySize
    },
    'Demo_Average Employees': {
      getValue: (data) => data["Demo_Average Employees"],
      getAverage: (avg) => avg.averageEmployees
    },
    'Demo_Average Members': {
      getValue: (data) => data["Demo_Average Members"],
      getAverage: (avg) => avg.averageMembers
    },
    'Demo_Average Percent Female': {
      getValue: (data) => data["Demo_Average Percent Female"],
      getAverage: (avg) => avg.averagePercentFemale
    },
    'Demo_Average Salary': {
      getValue: (data) => data["Demo_Average Salary"],
      getAverage: (avg) => avg.averageSalary
    },
    'Demo_Average States': {
      getValue: (data) => data["Demo_Average States"],
      getAverage: (avg) => avg.averageStates
    },

    // Cost metrics (lower is generally better for costs)
    'Cost_Medical & RX Paid Amount PMPY': {
      getValue: (data) => data["Cost_Medical & RX Paid Amount PMPY"],
      getAverage: (avg) => avg.medicalRxPaidAmountPMPY,
      isLowerBetter: true
    },
    'Cost_Medical & RX Paid Amount PEPY': {
      getValue: (data) => data["Cost_Medical & RX Paid Amount PEPY"],
      getAverage: (avg) => avg.medicalRxPaidAmountPEPY,
      isLowerBetter: true
    },
    'Cost_Medical Paid Amount PMPY': {
      getValue: (data) => data["Cost_Medical Paid Amount PMPY"],
      getAverage: (avg) => avg.medicalPaidAmountPMPY,
      isLowerBetter: true
    },
    'Cost_Medical Paid Amount PEPY': {
      getValue: (data) => data["Cost_Medical Paid Amount PEPY"],
      getAverage: (avg) => avg.medicalPaidAmountPEPY,
      isLowerBetter: true
    },
    'Cost_RX Paid Amount PMPY': {
      getValue: (data) => data["Cost_RX Paid Amount PMPY"],
      getAverage: (avg) => avg.rxPaidAmountPMPY,
      isLowerBetter: true
    },
    'Cost_RX Paid Amount PEPY': {
      getValue: (data) => data["Cost_RX Paid Amount PEPY"],
      getAverage: (avg) => avg.rxPaidAmountPEPY,
      isLowerBetter: true
    },
    'Cost_Avoidable ER Potential Savings PMPY': {
      getValue: (data) => data["Cost_Avoidable ER Potential Savings PMPY"],
      getAverage: (avg) => avg.avoidableERSavingsPMPY,
      isLowerBetter: true
    },
    'Cost_Specialty RX Allowed Amount PMPM': {
      getValue: (data) => data["Cost_Specialty RX Allowed Amount PMPM"],
      getAverage: (avg) => avg.specialtyRxAllowedAmountPMPM,
      isLowerBetter: true
    },

    // Utilization metrics
    'Util_Emergency Visits per 1k Members': {
      getValue: (data) => data["Util_Emergency Visits per 1k Members"],
      getAverage: (avg) => avg.emergencyVisitsPer1k,
      isLowerBetter: true
    },
    'Util_PCP Visits per 1k Members': {
      getValue: (data) => data["Util_PCP Visits per 1k Members"],
      getAverage: (avg) => avg.pcpVisitsPer1k
    },
    'Util_Specialist Visits per 1k Members': {
      getValue: (data) => data["Util_Specialist Visits per 1k Members"],
      getAverage: (avg) => avg.specialistVisitsPer1k
    },
    'Util_Urgent Care Visits per 1k Members': {
      getValue: (data) => data["Util_Urgent Care Visits per 1k Members"],
      getAverage: (avg) => avg.urgentCareVisitsPer1k,
      isLowerBetter: true
    },
    'Util_Telehealth Adoption': {
      getValue: (data) => data["Util_Telehealth Adoption"],
      getAverage: (avg) => avg.telehealthAdoption
    },
    'Util_Percent of Members who are Non-Utilizers': {
      getValue: (data) => data["Util_Percent of Members who are Non-Utilizers"],
      getAverage: (avg) => avg.percentNonUtilizers,
      isLowerBetter: true
    },

    // Risk metrics
    'Risk_Average Risk Score': {
      getValue: (data) => data["Risk_Average Risk Score"],
      getAverage: (avg) => avg.averageRiskScore,
      isLowerBetter: true
    }
  };

  async calculatePercentage(
    metricKey: string,
    reportData: any,
    options: {
      customValue?: number;
      customAverage?: number;
      isLowerBetter?: boolean;
      includeDebug?: boolean;
    } = {}
  ): Promise<PercentageResult> {
    try {
      // Ensure we have average data
      if (!this.averageData) {
        this.averageData = await averageDataService.getAverageData();
      }

      let value: number;
      let average: number;
      let isLowerBetter = false;

      // Use custom values if provided
      if (options.customValue !== undefined && options.customAverage !== undefined) {
        value = options.customValue;
        average = options.customAverage;
        isLowerBetter = options.isLowerBetter || false;
      } else {
        // Use predefined mapping
        const mapping = this.metricMappings[metricKey];
        if (!mapping) {
          console.warn(`[PercentageCalculatorService] No mapping found for metric: ${metricKey}`);
          return this.createInvalidResult(`No mapping for metric: ${metricKey}`);
        }

        value = mapping.getValue(reportData);
        average = mapping.getAverage(this.averageData);
        isLowerBetter = mapping.isLowerBetter || false;
      }

      // Validate inputs
      if (!this.isValidNumber(value)) {
        console.warn(`[PercentageCalculatorService] Invalid value for ${metricKey}: ${value}`);
        return this.createInvalidResult(`Invalid value: ${value}`);
      }

      if (!this.isValidNumber(average) || average === 0) {
        console.warn(`[PercentageCalculatorService] Invalid average for ${metricKey}: ${average}`);
        return this.createInvalidResult(`Invalid average: ${average}`);
      }

      // Calculate percentage difference
      const percentageDifference = ((value - average) / Math.abs(average)) * 100;
      
      // Determine if this is a positive or negative result
      const isPositive = (percentageDifference > 0 && !isLowerBetter) || 
                        (percentageDifference < 0 && isLowerBetter);

      // Format the result
      const formattedDifference = this.formatPercentage(percentageDifference);
      const comparisonText = this.getComparisonText(percentageDifference, isLowerBetter);
      const colorClass = this.getColorClass(isPositive, percentageDifference);

      const result: PercentageResult = {
        percentageDifference,
        formattedDifference,
        comparisonText,
        colorClass,
        isValid: true
      };

      if (options.includeDebug) {
        result.debugInfo = {
          value,
          average,
          calculation: `((${value} - ${average}) / ${Math.abs(average)}) * 100 = ${percentageDifference.toFixed(2)}%`
        };
      }

      return result;

    } catch (error) {
      console.error(`[PercentageCalculatorService] Error calculating percentage for ${metricKey}:`, error);
      return this.createInvalidResult(`Calculation error: ${error.message}`);
    }
  }

  private isValidNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }

  private formatPercentage(percentage: number): string {
    const sign = percentage > 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  }

  private getComparisonText(percentage: number, isLowerBetter: boolean): string {
    if (Math.abs(percentage) < 0.1) {
      return 'Same as archetype average';
    }

    const direction = percentage > 0 ? 'higher than' : 'lower than';
    return `${Math.abs(percentage).toFixed(1)}% ${direction} archetype average`;
  }

  private getColorClass(isPositive: boolean, percentage: number): string {
    if (Math.abs(percentage) < 0.1) return 'text-gray-600';
    return isPositive ? 'text-green-600' : 'text-amber-600';
  }

  private createInvalidResult(reason: string): PercentageResult {
    return {
      percentageDifference: 0,
      formattedDifference: 'N/A',
      comparisonText: 'No comparison available',
      colorClass: 'text-gray-500',
      isValid: false,
      debugInfo: {
        value: 0,
        average: 0,
        calculation: `Invalid: ${reason}`
      }
    };
  }

  // Batch calculate multiple metrics
  async calculateMultiplePercentages(
    reportData: any,
    metricKeys: string[],
    options: { includeDebug?: boolean } = {}
  ): Promise<Record<string, PercentageResult>> {
    const results: Record<string, PercentageResult> = {};
    
    // Ensure we have average data once
    if (!this.averageData) {
      this.averageData = await averageDataService.getAverageData();
    }

    for (const metricKey of metricKeys) {
      results[metricKey] = await this.calculatePercentage(metricKey, reportData, options);
    }

    return results;
  }

  clearCache(): void {
    this.averageData = null;
  }
}

// Export singleton instance
export const percentageCalculatorService = new PercentageCalculatorService();
