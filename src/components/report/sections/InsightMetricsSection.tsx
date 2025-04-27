
import React from 'react';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import { insightReportSchema } from '@/schemas/insightReportSchema';

interface InsightMetricsSectionProps {
  archetype: any;
}

const InsightMetricsSection = ({ archetype }: InsightMetricsSectionProps) => {
  return (
    <Section id="key-metrics">
      <SectionTitle 
        title={insightReportSchema.metrics.title}
        subtitle="Important performance indicators for this population"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insightReportSchema.metrics.fields.map((fieldKey) => {
          const value = archetype[fieldKey];
          if (value !== undefined) {
            return (
              <Card key={fieldKey} className="p-4">
                <p className="text-sm text-gray-500">{fieldKey.replace(/_/g, ' ')}</p>
                <p className="text-2xl font-bold">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
              </Card>
            );
          }
          return null;
        })}
      </div>
    </Section>
  );
};

export default InsightMetricsSection;
