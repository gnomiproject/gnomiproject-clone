
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DollarSign, 
  Brain, 
  Ambulance,
  CalendarCheck, 
  Home 
} from 'lucide-react';

interface KeyFinding {
  text: string;
  icon: React.ReactNode;
}

interface ArchetypeInsightsCardProps {
  archetypeName: string;
  familyName: string;
  shortDescription: string;
  keyFindings: string[];
  topPriority?: string;
}

const ArchetypeInsightsCard: React.FC<ArchetypeInsightsCardProps> = ({
  archetypeName,
  familyName,
  shortDescription,
  keyFindings = [],
  topPriority
}) => {
  // Map findings to icons based on their content
  const findingsWithIcons: KeyFinding[] = keyFindings.map(finding => {
    let icon;
    
    if (finding.toLowerCase().includes('cost') || finding.toLowerCase().includes('spend')) {
      icon = <DollarSign className="h-5 w-5 text-teal-600 flex-shrink-0" />;
    } else if (finding.toLowerCase().includes('mental health') || finding.toLowerCase().includes('condition')) {
      icon = <Brain className="h-5 w-5 text-teal-600 flex-shrink-0" />;
    } else if (finding.toLowerCase().includes('emergency') || finding.toLowerCase().includes('specialist')) {
      icon = <Ambulance className="h-5 w-5 text-teal-600 flex-shrink-0" />;
    } else if (finding.toLowerCase().includes('care') || finding.toLowerCase().includes('preventive')) {
      icon = <CalendarCheck className="h-5 w-5 text-teal-600 flex-shrink-0" />;
    } else if (finding.toLowerCase().includes('social') || finding.toLowerCase().includes('determinants')) {
      icon = <Home className="h-5 w-5 text-teal-600 flex-shrink-0" />;
    } else {
      // Default icon
      icon = <CalendarCheck className="h-5 w-5 text-teal-600 flex-shrink-0" />;
    }
    
    return {
      text: finding,
      icon
    };
  });

  return (
    <Card className="overflow-hidden bg-white shadow-md border-t-4 border-t-teal-500">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-gray-800 tracking-tight">
              {archetypeName} Insights
            </h3>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">{familyName} Family</span> • Healthcare Archetype Profile
            </p>
            <p className="text-gray-600 mt-2 text-sm">
              {shortDescription}
            </p>
          </div>

          {/* Key Findings */}
          <div>
            <h4 className="text-lg font-medium text-gray-700 mb-3">Key Findings</h4>
            <div className="space-y-4">
              {findingsWithIcons.map((finding, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 bg-teal-50 rounded-full p-2">
                    {finding.icon}
                  </div>
                  <p className="text-gray-600">{finding.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Priority Section */}
          {topPriority && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-lg font-medium text-gray-700 mb-2">Top Strategic Priority</h4>
              <p className="text-gray-600 bg-blue-50 p-3 rounded-md">
                {topPriority}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArchetypeInsightsCard;
