
import React from 'react';
import { useAssessment } from '../hooks/useAssessment';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CalculationLoader from '../components/assessment/CalculationLoader';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";

const Assessment = () => {
  const { 
    currentQuestion, 
    totalQuestions, 
    questions, 
    answers, 
    isCalculating,
    setAnswer, 
    setMultipleAnswers,
    goToNext, 
    goToPrevious 
  } = useAssessment();
  
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  
  const renderQuestionContent = () => {
    const currentQ = questions[currentQuestion - 1];
    
    // Handle multiple-select questions (checkboxes)
    if (currentQ.type === 'multi-select') {
      const selectedValues = answers[currentQ.id] ? answers[currentQ.id].split(',') : [];
      
      return (
        <div className="space-y-4">
          {currentQ.options.map(option => (
            <div key={option.id} className="flex items-start space-x-3 text-left">
              <Checkbox 
                id={option.id} 
                checked={selectedValues.includes(option.id)}
                onCheckedChange={(checked) => {
                  let newValues;
                  if (checked) {
                    newValues = [...selectedValues, option.id];
                  } else {
                    newValues = selectedValues.filter(value => value !== option.id);
                  }
                  setMultipleAnswers(currentQ.id, newValues);
                }}
              />
              <Label htmlFor={option.id} className="text-base font-normal cursor-pointer">
                {option.text}
              </Label>
            </div>
          ))}
        </div>
      );
    }
    
    // Special handling for industry question (first question)
    if (currentQ.id === 'industry') {
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between text-left font-normal overflow-hidden text-ellipsis"
            >
              <span className="truncate block">
                {answers[currentQ.id] 
                  ? currentQ.options.find(option => option.id === answers[currentQ.id])?.text 
                  : "Select industry..."}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 flex-none" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search industry..." className="h-10" />
              <CommandList>
                <CommandEmpty>No industry found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {/* Sort options alphabetically, but keep "Other Services" last */}
                  {[...currentQ.options]
                    .sort((a, b) => {
                      // Keep "Other Services" last
                      if (a.id === 'other_services') return 1;
                      if (b.id === 'other_services') return -1;
                      // Sort the rest alphabetically
                      return a.text.localeCompare(b.text);
                    })
                    .map((option) => (
                      <CommandItem
                        key={option.id}
                        value={option.id}
                        onSelect={(value) => {
                          setAnswer(currentQ.id, value);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            answers[currentQ.id] === option.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.text}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      );
    }
    
    // Geography question with dropdown (second question)
    if (currentQ.id === 'geography') {
      return (
        <Select
          value={answers[currentQ.id] || ""}
          onValueChange={(value) => setAnswer(currentQ.id, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select number of states..." />
          </SelectTrigger>
          <SelectContent>
            {currentQ.options.map(option => (
              <SelectItem key={option.id} value={option.id}>
                {option.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    
    // Organization size with dropdown (third question)
    if (currentQ.id === 'size') {
      return (
        <Select
          value={answers[currentQ.id] || ""}
          onValueChange={(value) => setAnswer(currentQ.id, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select organization size..." />
          </SelectTrigger>
          <SelectContent>
            {currentQ.options.map(option => (
              <SelectItem key={option.id} value={option.id}>
                {option.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    
    // Standard radio group for other questions (like gender)
    return (
      <RadioGroup
        value={answers[currentQ.id] || ""}
        onValueChange={(value) => setAnswer(currentQ.id, value)}
        className="space-y-4"
      >
        {currentQ.options.map(option => (
          <div key={option.id} className="flex items-center space-x-3 text-left">
            <RadioGroupItem id={option.id} value={option.id} />
            <Label htmlFor={option.id} className="text-base font-normal cursor-pointer">
              {option.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  };

  // Determine if the current question is valid for navigation
  const isCurrentQuestionValid = () => {
    const currentQ = questions[currentQuestion - 1];
    
    // For multi-select questions, allow proceeding as long as at least one option is selected
    // or allow skipping (since it's just informational)
    if (currentQ.type === 'multi-select') {
      // For the priorities question, make it optional
      if (currentQ.id === 'priorities') return true;
      
      const selectedValues = answers[currentQ.id] ? answers[currentQ.id].split(',') : [];
      return selectedValues.length > 0;
    }
    
    // For single-select questions, require an answer
    return !!answers[questions[currentQuestion - 1].id];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-5 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-left mb-6 sm:mb-8">gNomi Archetype Assessment</h1>
        
        {questions.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-left mb-3 sm:mb-4">Question {currentQuestion} of {totalQuestions}</h2>
            <p className="mb-5 sm:mb-6 text-left">{questions[currentQuestion - 1].text}</p>
            
            {renderQuestionContent()}
            
            <div className="flex justify-between mt-6 sm:mt-8">
              <Button
                onClick={goToPrevious}
                disabled={currentQuestion === 1}
                variant="outline"
                className="font-semibold py-2 px-3 sm:px-4"
              >
                Previous
              </Button>
              <Button
                onClick={goToNext}
                disabled={!isCurrentQuestionValid()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4"
              >
                {currentQuestion === totalQuestions ? 'Submit' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
      <CalculationLoader isVisible={isCalculating} />
    </div>
  );
};

export default Assessment;
