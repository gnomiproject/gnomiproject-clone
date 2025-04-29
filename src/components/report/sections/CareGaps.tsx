
import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CareGapsProps {
  reportData: any;
  averageData: any;
}

const CareGaps = ({ reportData, averageData }: CareGapsProps) => {
  // Use the care_gaps field from reportData or provide placeholder content
  const careGapsContent = reportData.care_gaps || "No care gaps analysis available for this archetype.";
  
  // Extract some care gap metrics for visualization
  const gapMetrics = [
    { name: 'Wellness Visit Adults', value: reportData.Gaps_Wellness_Visit_Adults || reportData['Gaps_Wellness Visit Adults'] },
    { name: 'Cancer Screening', value: reportData.Gaps_Cancer_Screening_Breast || reportData['Gaps_Cancer Screening Breast'] },
    { name: 'Diabetes Management', value: reportData.Gaps_Diabetes_RX_Adherence || reportData['Gaps_Diabetes RX Adherence'] },
    { name: 'Mental Health Follow-up', value: reportData.Gaps_Behavioral_Health_FU_ED_Visit_Mental_Illness || reportData['Gaps_Behavioral Health FU ED Visit Mental Illness'] }
  ].filter(metric => metric.value !== undefined);

  const hasMetrics = gapMetrics.length > 0;

  // Gnome image
  const gnomeImage = '/assets/gnomes/gnome_clipboard.png';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-6">Care Gaps</h1>
          <p className="text-lg">
            This section highlights opportunities to improve care delivery and health outcomes
            through addressing identified care gaps in the population.
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <img
            src={gnomeImage}
            alt="Care Gaps Gnome"
            className="max-h-64 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/gnomes/placeholder.svg';
            }}
          />
        </div>
      </div>

      {hasMetrics ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Key Care Gap Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gapMetrics.map((metric, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">{metric.name}</p>
                      <p className="text-lg font-bold">{typeof metric.value === 'number' ? `${(metric.value * 100).toFixed(1)}%` : 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Care Gaps Analysis</h2>
            <div className="bg-white p-6 rounded-lg border">
              <p className="whitespace-pre-line">{careGapsContent}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Care Gap Data Coming Soon</h2>
          <p>Complete care gaps analysis will be available in the next report update.</p>
        </div>
      )}
    </div>
  );
};

export default CareGaps;
