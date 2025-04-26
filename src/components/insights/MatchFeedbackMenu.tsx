
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface MatchFeedbackMenuProps {
  archetypeId: string;
  onClose: () => void;
}

const MatchFeedbackMenu = ({ archetypeId, onClose }: MatchFeedbackMenuProps) => {
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [userComments, setUserComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmitFeedback = async () => {
    if (!selectedFeedback) return;
    
    setIsSubmitting(true);
    
    try {
      // Instead of saving to database, just log the feedback since we don't have the appropriate table
      console.log('Archetype Feedback:', {
        archetypeId,
        feedback: selectedFeedback,
        comments: userComments.trim() !== '' ? userComments : null,
        timestamp: new Date().toISOString()
      });
      
      // Show success toast
      toast({
        title: "Feedback Received",
        description: "Thank you for helping us improve our archetype matching!",
        duration: 3000,
      });
      
      setSubmitted(true);
    } catch (err) {
      console.error('Error in feedback submission:', err);
      toast({
        title: "Error Submitting Feedback",
        description: "There was a problem submitting your feedback. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      onClose();
    } catch (error) {
      console.error('Error in handleClose:', error);
    }
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
        onClick={handleClose} 
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
        
        <div className="mb-4">
          <Label htmlFor="comments" className="text-xs text-gray-500 mb-1 block">
            Additional comments (optional)
          </Label>
          <Textarea 
            id="comments"
            placeholder="Tell us more about your experience..."
            value={userComments}
            onChange={(e) => setUserComments(e.target.value)}
            className="text-sm min-h-[60px]"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmitFeedback} 
          disabled={!selectedFeedback || isSubmitting}
          size="sm"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default MatchFeedbackMenu;
