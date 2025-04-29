
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
        <BenefitItem text="Detailed profile analysis customized for your healthcare organization" />
        <BenefitItem text="Strategic recommendations tailored to your archetype" />
        <BenefitItem text="Comprehensive utilization patterns analysis" />
        <BenefitItem text="Cost efficiency opportunities specific to your needs" />
        <BenefitItem text="Disease management insights for your population" />
        <BenefitItem text="Demographic trend analysis" />
        <BenefitItem text="Care gap identification and solutions" />
      </div>
      
      <div className="text-sm text-muted-foreground mt-4 pt-4 border-t">
        Our team reviews each request individually to provide the most accurate
        and valuable insights for your organization.
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
