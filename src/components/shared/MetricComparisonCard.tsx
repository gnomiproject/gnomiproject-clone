
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { percentageCalculatorService } from '@/services/PercentageCalculatorService';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MetricComparisonCardProps {
  title: string;
  value: number;
  average: number;
  unit?: string;
  className?: string;
  metricKey?: string; // Optional metric key for better mapping
}

/**
 * A card component that displays a metric value with a comparison to the archetype average
 * Now uses centralized percentage calculation service for consistency
 */
const MetricComparisonCard = ({ 
  title, 
  value, 
  average, 
  unit = '', 
  className = '',
  metricKey
}: MetricComparisonCardProps) => {
  const [comparisonData, setComparisonData] = useState({
    text: 'Calculating...',
    color: 'text-gray-500',
    formattedDifference: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateComparison = async () => {
      setIsLoading(true);
      
      try {
        // Validate inputs first
        const validValue = typeof value === 'number' && !isNaN(value) ? value : 0;
        const validAverage = typeof average === 'number' && !isNaN(average) && average !== 0 ? average : 
          (title.includes('Cost') ? 5000 : 1); // Fallback based on metric type

        if (validAverage !== average) {
          console.warn(`[MetricComparisonCard] Using fallback average for ${title}:`, {
            originalAverage: average,
            fallbackAverage: validAverage
          });
        }

        // Use the centralized service for consistent calculations
        const result = await percentageCalculatorService.calculatePercentage(
          metricKey || title, // Use metricKey if provided, otherwise use title
          {},
          {
            customValue: validValue,
            customAverage: validAverage,
            isLowerBetter: title.toLowerCase().includes('cost') || 
                          title.toLowerCase().includes('emergency') ||
                          title.toLowerCase().includes('risk'),
            includeDebug: false
          }
        );

        setComparisonData({
          text: result.comparisonText,
          color: result.colorClass,
          formattedDifference: result.formattedDifference
        });

      } catch (error) {
        console.error(`[MetricComparisonCard] Error calculating comparison for ${title}:`, error);
        setComparisonData({
          text: 'Comparison unavailable',
          color: 'text-gray-500',
          formattedDifference: 'N/A'
        });
      } finally {
        setIsLoading(false);
      }
    };

    calculateComparison();
  }, [value, average, title, metricKey]);

  // Format the average value
  const formattedAverage = title.toLowerCase().includes('cost') ? 
    `$${average.toLocaleString()}` : 
    average.toLocaleString();
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-1 flex items-center">
          {title}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Compared to a weighted average across all healthcare archetypes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{value.toLocaleString()}</span>
          {unit && <span className="text-gray-500">{unit}</span>}
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">Archetype avg: {formattedAverage}{unit}</span>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <p className={comparisonData.color}>
              {comparisonData.text}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricComparisonCard;
