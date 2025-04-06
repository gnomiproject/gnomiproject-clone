
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MatchFeedbackMenuProps {
  archetypeId: string;
  onClose: () => void;
}

const MatchFeedbackMenu = ({ archetypeId, onClose }: MatchFeedbackMenuProps) => {
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
    <div className="p-4 bg-white shadow-lg border rounded-lg max-w-xs relative">
      <button 
        onClick={onClose} 
        className="absolute top-3 right-3 p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        aria-label="Close feedback menu"
      >
        <X className="h-5 w-5" />
      </button>
      
      <div className="pr-6">
        <p className="text-sm font-medium mb-4 mt-1">Did we get it right?</p>
      
        <RadioGroup 
          value={selectedFeedback || ""} 
          onValueChange={setSelectedFeedback}
          className="space-y-3 mb-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="great" id="great" />
            <Label htmlFor="great" className="cursor-pointer text-sm">Spot on!</Label>
          </div>
          
          <div className="flex items-center gap-2">
            <RadioGroupItem value="good" id="good" />
            <Label htmlFor="good" className="cursor-pointer text-sm">Pretty close</Label>
          </div>
          
          <div className="flex items-center gap-2">
            <RadioGroupItem value="wrong" id="wrong" />
            <Label htmlFor="wrong" className="cursor-pointer text-sm">Not quite</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex justify-end">
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
