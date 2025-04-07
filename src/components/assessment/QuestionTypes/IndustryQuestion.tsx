import React from 'react';
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { AssessmentQuestion } from '@/types/assessment';

interface IndustryQuestionProps {
  question: AssessmentQuestion;
  selectedAnswer: string | undefined;
  onAnswerChange: (questionId: string, value: string) => void;
}

const IndustryQuestion = ({ question, selectedAnswer, onAnswerChange }: IndustryQuestionProps) => {
  const [open, setOpen] = React.useState(false);
  
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
            {selectedAnswer 
              ? question.options.find(option => option.id === selectedAnswer)?.text 
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
              {[...question.options]
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
                      onAnswerChange(question.id, value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedAnswer === option.id ? "opacity-100" : "opacity-0"
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
};

export default IndustryQuestion;
