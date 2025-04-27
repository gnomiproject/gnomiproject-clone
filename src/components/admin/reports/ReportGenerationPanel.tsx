
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface ReportGenerationPanelProps {
  isGenerating: boolean;
  onGenerateReport: (archetypeId: string) => void;
  formatArchetypeLabel: (id: string) => string;
  generationInProgress?: string[];
}

const ReportGenerationPanel = ({
  isGenerating,
  onGenerateReport,
  formatArchetypeLabel,
  generationInProgress = []
}: ReportGenerationPanelProps) => {
  const [selectedArchetype, setSelectedArchetype] = React.useState('');
  
  const archetypeOptions = [
    { id: 'a1', name: 'Proactive Planners' },
    { id: 'a2', name: 'Complex Condition Managers' },
    { id: 'a3', name: 'Wellness Champions' },
    { id: 'b1', name: 'Resourceful Adapters' },
    { id: 'b2', name: 'Cost-Conscious Caregivers' },
    { id: 'b3', name: 'Prevention Partners' },
    { id: 'c1', name: 'Traditional Consumers' },
    { id: 'c2', name: 'Reactive Responders' },
    { id: 'c3', name: 'Healthcare Avoiders' },
  ];
  
  const handleGenerate = () => {
    if (selectedArchetype) {
      onGenerateReport(selectedArchetype);
    }
  };
  
  const isProcessing = isGenerating || generationInProgress.includes(selectedArchetype);

  return (
    <Card className="p-4 border border-gray-200">
      <div className="space-y-4">
        <h3 className="font-medium">Generate a new Deep Dive report</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-2/3">
            <Select
              value={selectedArchetype}
              onValueChange={setSelectedArchetype}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an archetype" />
              </SelectTrigger>
              <SelectContent>
                {archetypeOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.id.toUpperCase()} - {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-1/3">
            <Button 
              className="w-full" 
              onClick={handleGenerate}
              disabled={!selectedArchetype || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Report'
              )}
            </Button>
          </div>
        </div>
        
        {generationInProgress.length > 0 && generationInProgress.some(id => id !== selectedArchetype) && (
          <div className="text-sm text-amber-600">
            Report generation in progress for: {generationInProgress.map(id => id.toUpperCase()).join(', ')}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReportGenerationPanel;
