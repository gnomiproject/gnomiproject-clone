
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Info, Scale } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AverageExplanationCard = () => {
  return (
    <Card className="bg-blue-50 border-blue-100 my-6">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <Scale className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-blue-800 flex items-center">
              Understanding Comparisons in This Report
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-2 text-blue-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>All comparisons are to a single, consistent baseline across all reports.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            <p className="mt-2 text-blue-700">
              Throughout this report, all metrics are compared to the <strong>archetype average</strong> — a weighted average across <em>all</em> healthcare archetypes. This provides a consistent baseline for comparison.
            </p>
            <p className="mt-2 text-blue-700">
              This is not a comparison to your submitted data or to external benchmarks, but rather to our standardized cross-archetype average.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AverageExplanationCard;
