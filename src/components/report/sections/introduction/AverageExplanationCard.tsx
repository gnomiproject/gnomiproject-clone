
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Info, Scale } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WebsiteImage from '@/components/common/WebsiteImage'; 

const AverageExplanationCard = () => {
  return (
    <Card className="bg-blue-50 border-blue-100 my-6">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <WebsiteImage 
              type="chart" 
              className="h-5 w-5 text-blue-700"
              altText="Chart icon" 
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-blue-800 flex items-center">
              Quick Analytic Note on Archetype Averages
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-2 text-blue-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Your archetype is compared to the average across all archetypes..</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            <p className="mt-2 text-blue-700">
              Throughout this report, all metrics are compared to the <strong>archetype average</strong> — a weighted average across <em>all</em> healthcare archetypes. This provides a consistent baseline for comparison and effectively represents a national market average.
            </p>
            <p className="mt-2 text-blue-700">
              Contact our team to find out how your company-specific data compares to your matched archetype.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AverageExplanationCard;
