
import React from 'react';
import { CheckCircle } from 'lucide-react';

export interface DeepDiveBenefitsProps {
  archetypeName: string;
}

const DeepDiveBenefits = ({ archetypeName }: DeepDiveBenefitsProps) => {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Your {archetypeName} Deep Dive Report Includes:</h3>
      
      <div className="space-y-4">
        <BenefitItem text="Detailed profile analysis of your matched archetype" />
        <BenefitItem text="Strategic recommendations tailored to your archetype" />
        <BenefitItem text="Comprehensive utilization patterns analysis" />
        <BenefitItem text="Detailed cost savings opportunities" />
        <BenefitItem text="Disease prevalence insights" />
        <BenefitItem text="Holistic emographic insights" />
        <BenefitItem text="Care gap identification and solutions" />
      </div>
      
      <div className="text-sm text-muted-foreground mt-4 pt-4 border-t">
        <p>We'll email the report directly to your inbox. And, it's free!.</p>
      </div>
    </div>
  );
};

const BenefitItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3">
    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
    <span>{text}</span>
  </div>
);

export default DeepDiveBenefits;
