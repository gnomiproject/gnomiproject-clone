
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DollarSign, 
  Brain, 
  Hospital,
  CalendarCheck, 
  Home,
  Users
} from 'lucide-react';
import { ArchetypeId } from '@/types/archetype';
import { getArchetypeColorHex } from '@/data/colors';

interface KeyFinding {
  text: string;
  icon: React.ReactNode;
}

interface ArchetypeInsightsCardProps {
  archetypeName: string;
  familyName: string;
  shortDescription: string;
  keyFindings: string[];
  archetypeId?: ArchetypeId;
}

const ArchetypeInsightsCard: React.FC<ArchetypeInsightsCardProps> = ({
  archetypeName,
  familyName,
  shortDescription,
  keyFindings = [],
  archetypeId = 'a1' as ArchetypeId // Default to a1 if not provided
}) => {
  console.log("ArchetypeInsightsCard rendering with:", {
    archetypeName,
    familyLength: familyName?.length || 0,
    findingsCount: keyFindings?.length || 0,
    archetypeId
  });
  
  // Get the archetype's color
  const archetypeColor = getArchetypeColorHex(archetypeId);
  
  // Map findings to icons based on their content
  const findingsWithIcons: KeyFinding[] = keyFindings.map(finding => {
    let icon;
    
    if (finding.toLowerCase().includes('cost') || finding.toLowerCase().includes('spend') || finding.toLowerCase().includes('financ')) {
      icon = <DollarSign className={`h-5 w-5 text-[${archetypeColor}] flex-shrink-0`} />;
    } else if (finding.toLowerCase().includes('mental health') || finding.toLowerCase().includes('condition') || finding.toLowerCase().includes('disorder')) {
      icon = <Brain className={`h-5 w-5 text-[${archetypeColor}] flex-shrink-0`} />;
    } else if (finding.toLowerCase().includes('emergency') || finding.toLowerCase().includes('specialist') || finding.toLowerCase().includes('hospital')) {
      icon = <Hospital className={`h-5 w-5 text-[${archetypeColor}] flex-shrink-0`} />;
    } else if (finding.toLowerCase().includes('care') || finding.toLowerCase().includes('preventive') || finding.toLowerCase().includes('adherence')) {
      icon = <CalendarCheck className={`h-5 w-5 text-[${archetypeColor}] flex-shrink-0`} />;
    } else if (finding.toLowerCase().includes('social') || finding.toLowerCase().includes('determinants') || finding.toLowerCase().includes('community')) {
      icon = <Home className={`h-5 w-5 text-[${archetypeColor}] flex-shrink-0`} />;
    } else {
      // Default icon
      icon = <Users className={`h-5 w-5 text-[${archetypeColor}] flex-shrink-0`} />;
    }
    
    return {
      text: finding,
      icon
    };
  });

  return (
    <Card 
      className="overflow-hidden bg-white shadow-md mb-8 relative z-10"
      style={{ borderTop: `4px solid ${archetypeColor}` }}
    >
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-gray-800 tracking-tight flex items-center gap-2">
              {archetypeName} Insights
              <span className="text-sm font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                {archetypeId}
              </span>
            </h3>
            <p className="text-sm text-gray-500">
              Healthcare Archetype Profile
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
                  <div 
                    className="mt-0.5 rounded-full p-2" 
                    style={{ backgroundColor: `${archetypeColor}10` }}
                  >
                    {finding.icon}
                  </div>
                  <p className="text-gray-600">{finding.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArchetypeInsightsCard;
