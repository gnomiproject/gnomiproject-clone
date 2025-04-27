
import React from 'react';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import { insightReportSchema } from '@/schemas/insightReportSchema';

interface InsightOverviewSectionProps {
  archetype: any;
}

const InsightOverviewSection = ({ archetype }: InsightOverviewSectionProps) => {
  const name = archetype?.name || archetype?.archetype_name || 'Untitled Archetype';

  return (
    <Section id="overview">
      <SectionTitle 
        title={insightReportSchema.overview.title}
        subtitle="General information about this archetype population"
      />
      <Card className="p-6">
        <p className="text-gray-700">{archetype?.short_description || 'No description available'}</p>
        {archetype?.executive_summary && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
            <p className="text-gray-700">{archetype.executive_summary}</p>
          </div>
        )}
      </Card>
    </Section>
  );
};

export default InsightOverviewSection;
