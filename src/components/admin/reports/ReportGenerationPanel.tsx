
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ReportGenerationPanelProps {
  isGenerating: boolean;
  onGenerateReport: (archetypeId: string) => void;
  formatArchetypeLabel: (id: string) => string;
}

const ReportGenerationPanel = ({ 
  isGenerating, 
  onGenerateReport,
  formatArchetypeLabel 
}: ReportGenerationPanelProps) => {
  const archetypeIds = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Generate new report</h3>
      <div className="flex flex-wrap gap-2">
        {archetypeIds.map((id) => (
          <Button
            key={id}
            variant="outline"
            size="sm"
            onClick={() => onGenerateReport(id)}
            disabled={isGenerating}
            className={isGenerating ? "animate-pulse" : ""}
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-1" />
            ) : (
              formatArchetypeLabel(id)
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ReportGenerationPanel;
