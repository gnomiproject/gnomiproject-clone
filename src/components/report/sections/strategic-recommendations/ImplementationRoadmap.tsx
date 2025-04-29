
import React from 'react';
import { Card } from '@/components/ui/card';
import { ListOrdered } from 'lucide-react';

interface ImplementationRoadmapProps {
  recommendations: any[];
}

const ImplementationRoadmap: React.FC<ImplementationRoadmapProps> = ({ recommendations }) => {
  // If no recommendations are available, show a placeholder
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <ListOrdered className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold">Implementation Roadmap</h3>
        </div>
        <p className="text-gray-500 italic">Implementation roadmap is not available at this time.</p>
      </Card>
    );
  }

  // Define implementation steps based on recommendations
  const implementationSteps = [
    {
      title: "Assessment & Planning",
      description: "Review current programs and identify opportunities aligned with strategic recommendations.",
      timeframe: "Month 1-2"
    },
    {
      title: "Program Design",
      description: "Develop specific initiatives addressing the identified priorities and gaps.",
      timeframe: "Month 2-3"
    },
    {
      title: "Implementation",
      description: "Launch initiatives with clear communication and engagement strategies.",
      timeframe: "Month 3-6"
    },
    {
      title: "Monitoring & Refinement",
      description: "Track key metrics and adjust programs based on initial outcomes.",
      timeframe: "Month 6-12"
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <ListOrdered className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold">Implementation Roadmap</h3>
      </div>

      <div className="relative pl-8 border-l-2 border-blue-200 space-y-8">
        {implementationSteps.map((step, index) => (
          <div key={index} className="relative">
            {/* Timeline node */}
            <div className="absolute -left-[32px] bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
              {index + 1}
            </div>
            
            {/* Content */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-lg text-blue-700">{step.title}</h4>
                <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  {step.timeframe}
                </span>
              </div>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ImplementationRoadmap;
