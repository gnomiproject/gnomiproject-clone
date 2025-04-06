
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MatchFeedbackMenuProps {
  archetypeId: string;
}

const MatchFeedbackMenu = ({ archetypeId }: MatchFeedbackMenuProps) => {
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmitFeedback = () => {
    if (!selectedFeedback) return;
    
    // Here we would typically send this feedback to an API
    console.log(`Feedback submitted for archetype ${archetypeId}: ${selectedFeedback}`);
    
    // For now, just show a toast confirmation
    toast({
      title: "Feedback Received",
      description: "Thank you for helping us improve our archetype matching!",
      duration: 3000,
    });
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center py-3 px-4 gap-2 text-green-600 bg-white rounded-lg shadow-lg border">
        <Check className="h-4 w-4" />
        <span className="text-sm font-medium">Thanks for your feedback!</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-lg border rounded-lg max-w-xs">
      <p className="text-sm font-medium mb-3">Match feedback?</p>
      
      <RadioGroup 
        value={selectedFeedback || ""} 
        onValueChange={setSelectedFeedback}
        className="space-y-1"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="great" id="great" />
          <Label htmlFor="great" className="cursor-pointer text-sm">Looks great!</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <RadioGroupItem value="good" id="good" />
          <Label htmlFor="good" className="cursor-pointer text-sm">Pretty good</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <RadioGroupItem value="wrong" id="wrong" />
          <Label htmlFor="wrong" className="cursor-pointer text-sm">Not quite right</Label>
        </div>
      </RadioGroup>
      
      <div className="mt-3 flex justify-end">
        <Button 
          onClick={handleSubmitFeedback} 
          disabled={!selectedFeedback}
          size="sm"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default MatchFeedbackMenu;
