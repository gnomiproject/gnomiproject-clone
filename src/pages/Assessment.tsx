
import React from 'react';
import { useAssessment } from '../hooks/useAssessment';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CalculationLoader from '../components/assessment/CalculationLoader';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Assessment = () => {
  const { 
    currentQuestion, 
    totalQuestions, 
    questions, 
    answers, 
    isCalculating,
    setAnswer, 
    goToNext, 
    goToPrevious 
  } = useAssessment();
  
  const [open, setOpen] = React.useState(false);
  
  const renderQuestionContent = () => {
    const currentQ = questions[currentQuestion - 1];
    
    // Special handling for industry question (first question)
    if (currentQ.id === 'industry') {
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between text-left font-normal"
            >
              {answers[currentQ.id] 
                ? currentQ.options.find(option => option.id === answers[currentQ.id])?.text 
                : "Select industry..."}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search industry..." className="h-10" />
              <CommandEmpty>No industry found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {currentQ.options.map((option) => (
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
            </Command>
          </PopoverContent>
        </Popover>
      );
    }
    
    // Standard radio group for other questions
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-semibold text-left mb-8">Assessment</h1>
        
        {questions.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-left mb-4">Question {currentQuestion} of {totalQuestions}</h2>
            <p className="mb-6 text-left">{questions[currentQuestion - 1].text}</p>
            
            {renderQuestionContent()}
            
            <div className="flex justify-between mt-8">
              <button
                onClick={goToPrevious}
                disabled={currentQuestion === 1}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={goToNext}
                disabled={!answers[questions[currentQuestion - 1].id]}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
              >
                {currentQuestion === totalQuestions ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>
      <CalculationLoader isVisible={isCalculating} />
    </div>
  );
};

export default Assessment;
