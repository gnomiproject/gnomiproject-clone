
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useArchetypes } from '@/hooks/useArchetypes';
import { ArchetypeId } from '@/types/archetype';
import { ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ArchetypeCardProps {
  id: ArchetypeId;
  title: string;
  category: string;
  color: string;
  description: string;
  characteristics: string[];
}

const ArchetypeCard = ({ id, title, category, color, description, characteristics }: ArchetypeCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { getArchetypeStandard } = useArchetypes();
  
  const detailedData = getArchetypeStandard(id);
  
  const openDetails = () => setShowDetails(true);
  const closeDetails = () => setShowDetails(false);
  
  // Always use archetype color for the card border
  const archetypeColorClass = `archetype-${id}`;
  // Use family color for category tag
  const familyColorClass = `family-${id.charAt(0)}`;
  
  return (
    <>
      <div className={`bg-white rounded-lg shadow-md border-l-4 border-${archetypeColorClass} hover:shadow-lg transition-shadow duration-200 overflow-hidden h-full flex flex-col`}>
        <div className="p-6 flex flex-col h-full">
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <Badge className={`bg-${familyColorClass}/15 hover:bg-${familyColorClass}/25 text-${familyColorClass} border-0`}>
              {category.toLowerCase()}
            </Badge>
            <Badge className={`bg-${archetypeColorClass}/20 hover:bg-${archetypeColorClass}/30 text-${archetypeColorClass} border-0`}>
              {id}
            </Badge>
          </div>
          
          <h3 className={`text-xl font-bold mb-3 text-gray-800 ${archetypeColorClass === 'archetype-c3' ? 'text-black' : `text-${archetypeColorClass}/90`}`}>
            {title}
          </h3>
          
          <p className="text-gray-600 mb-5 flex-grow">
            {description}
          </p>
          
          <div className="mb-5">
            <h4 className="font-semibold text-gray-700 mb-3">Key Characteristics:</h4>
            <ul className="space-y-2.5">
              {characteristics.slice(0, 3).map((item, index) => (
                <li key={index} className="flex items-start text-left">
                  <span className={`mr-2 mt-1 flex-shrink-0 text-${archetypeColorClass} text-lg leading-none`}>•</span>
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <button 
            onClick={openDetails}
            className={`inline-flex items-center mt-auto text-sm font-medium py-1.5 px-3 rounded-md bg-${archetypeColorClass}/10 hover:bg-${archetypeColorClass}/20 text-${archetypeColorClass} transition-colors`}
          >
            Learn More 
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={closeDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {detailedData && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className={`bg-family-${detailedData.familyId}/15 hover:bg-family-${detailedData.familyId}/25 text-family-${detailedData.familyId} border-0`}>
                    family {detailedData.familyId}
                  </Badge>
                  <Badge className={`bg-archetype-${detailedData.id}/20 hover:bg-archetype-${detailedData.id}/30 text-archetype-${detailedData.id} border-0`}>
                    {detailedData.id}
                  </Badge>
                </div>
                <DialogTitle className={`text-2xl font-bold ${archetypeColorClass === 'archetype-c3' ? 'text-black' : `text-${archetypeColorClass}/90`}`}>{detailedData.name}</DialogTitle>
              </DialogHeader>

              <div className="mt-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-8 text-lg">{detailedData.fullDescription}</p>
                  
                  <h3 className={`font-bold text-xl mb-5 ${archetypeColorClass === 'archetype-c3' ? 'text-black' : `text-${archetypeColorClass}/90`}`}>Key Characteristics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    {detailedData.keyCharacteristics.map((characteristic, index) => (
                      <div key={index} className={`flex items-start gap-3 p-4 rounded-md bg-${archetypeColorClass}/5 border-l-3 border-${archetypeColorClass} text-left`}>
                        <div className={`h-2.5 w-2.5 mt-1.5 rounded-full bg-${archetypeColorClass} flex-shrink-0`}></div>
                        <span className="text-gray-700">{characteristic}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className={`font-bold text-xl mb-5 ${archetypeColorClass === 'archetype-c3' ? 'text-black' : `text-${archetypeColorClass}/90`}`}>Key Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {Object.entries(detailedData.keyStatistics).map(([key, stat]) => (
                      <div key={key} className={`bg-${archetypeColorClass}/5 rounded-lg p-5 border border-${archetypeColorClass}/20`}>
                        <h4 className="font-medium text-gray-600 text-sm mb-1">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <div className="flex items-center">
                          <span className={`text-xl font-bold ${
                            stat.trend === 'up' ? 'text-orange-600' : 
                            stat.trend === 'down' ? 'text-green-600' : 
                            `text-${archetypeColorClass}`
                          }`}>
                            {stat.value}
                          </span>
                          <span className={`ml-2 ${
                            stat.trend === 'up' ? 'text-orange-600' : 
                            stat.trend === 'down' ? 'text-green-600' : 
                            'text-gray-600'
                          }`}>
                            {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '–'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className={`font-bold text-xl mb-5 ${archetypeColorClass === 'archetype-c3' ? 'text-black' : `text-${archetypeColorClass}/90`}`}>Key Insights</h3>
                  <div className="space-y-3 mb-4 text-left">
                    {detailedData.keyInsights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`h-3 w-3 mt-1 rounded-full bg-${archetypeColorClass} flex-shrink-0`}></div>
                        <span className="text-gray-700">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArchetypeCard;
