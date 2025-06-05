
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface KeyFindingsSectionProps {
  keyFindings?: any[];
  archetypeColor?: string;
}

const KeyFindingsSection: React.FC<KeyFindingsSectionProps> = ({
  keyFindings = [],
  archetypeColor = '#6E59A5'
}) => {
  // Parse key findings if they come as a string
  const parseKeyFindings = () => {
    if (!keyFindings || keyFindings.length === 0) return [];
    
    try {
      if (typeof keyFindings === 'string') {
        return JSON.parse(keyFindings);
      }
      return Array.isArray(keyFindings) ? keyFindings : [];
    } catch (error) {
      console.error('Error parsing key findings:', error);
      return [];
    }
  };

  const findings = parseKeyFindings();

  if (findings.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" style={{ color: archetypeColor }} />
          Key Findings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {findings.map((finding, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border">
              <div className="flex-shrink-0 mt-1">
                <BarChart3 className="h-4 w-4" style={{ color: archetypeColor }} />
              </div>
              <div className="flex-1">
                {typeof finding === 'string' ? (
                  <p className="text-sm text-gray-700">{finding}</p>
                ) : (
                  <div>
                    {finding.title && (
                      <h4 className="font-medium text-gray-900 mb-1">{finding.title}</h4>
                    )}
                    <p className="text-sm text-gray-700">
                      {finding.description || finding.content || finding}
                    </p>
                    {finding.metric && (
                      <div className="mt-2 text-xs text-gray-500">
                        Related metric: {finding.metric}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyFindingsSection;
