
import React from 'react';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import { insightReportSchema } from '@/schemas/insightReportSchema';

interface InsightCareSectionProps {
  archetype: any;
}

const InsightCareSection = ({ archetype }: InsightCareSectionProps) => {
  return (
    <Section id="disease-care">
      <SectionTitle 
        title={insightReportSchema.diseaseAndCare.title} 
        subtitle="Health conditions and care management insights"
      />
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Disease Prevalence</h3>
            <div className="space-y-3">
              {['Dise_Heart Disease Prevalence', 'Dise_Type 2 Diabetes Prevalence', 
                'Dise_Mental Health Disorder Prevalence', 'Dise_Substance Use Disorder Prevalence'].map((metric) => {
                const value = archetype[metric];
                if (value !== undefined) {
                  return (
                    <div key={metric} className="flex justify-between items-center">
                      <span className="text-gray-700">{metric.replace('Dise_', '').replace('_', ' ')}</span>
                      <span className="font-medium">{(value * 100).toFixed(1)}%</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Care Gaps</h3>
            <div className="space-y-3">
              {['Gaps_Diabetes RX Adherence', 'Gaps_Behavioral Health FU ED Visit Mental Illness',
                'Gaps_Cancer Screening Breast', 'Gaps_Wellness Visit Adults'].map((metric) => {
                const value = archetype[metric];
                if (value !== undefined) {
                  return (
                    <div key={metric} className="flex justify-between items-center">
                      <span className="text-gray-700">{metric.replace('Gaps_', '')}</span>
                      <span className="font-medium">{(value * 100).toFixed(1)}%</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </Card>
    </Section>
  );
};

export default InsightCareSection;
