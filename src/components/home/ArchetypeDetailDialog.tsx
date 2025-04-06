
import React from 'react';
import { ArchetypeId } from '@/types/archetype';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ArchetypeDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  archetypeDetail: {
    id: ArchetypeId;
    familyId: 'a' | 'b' | 'c';
    name: string;
    familyName: string;
    fullDescription: string;
    keyCharacteristics: string[];
    keyInsights: string[];
    keyStatistics: {
      [key: string]: {
        value: string;
        trend: 'up' | 'down' | 'neutral';
      };
    };
  } | null;
}

const ArchetypeDetailDialog: React.FC<ArchetypeDetailDialogProps> = ({
  open,
  onOpenChange,
  archetypeDetail
}) => {
  if (!archetypeDetail) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap gap-2 mb-2">
            <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-family-${archetypeDetail.familyId}/20 text-family-${archetypeDetail.familyId}`}>
              Family {archetypeDetail.familyId}: {archetypeDetail.familyName}
            </div>
            <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-archetype-${archetypeDetail.id}/20 text-archetype-${archetypeDetail.id}`}>
              {archetypeDetail.id}
            </div>
          </div>
          
          <DialogTitle className={`text-2xl font-bold text-archetype-${archetypeDetail.id}`}>
            {archetypeDetail.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-8">
          {/* Full Description */}
          <div>
            <p className="text-gray-700 text-lg leading-relaxed">{archetypeDetail.fullDescription}</p>
          </div>
          
          {/* Key Statistics Section */}
          <div>
            <h3 className={`font-bold text-xl mb-5 text-archetype-${archetypeDetail.id}`}>Key Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {Object.entries(archetypeDetail.keyStatistics).map(([key, stat]) => (
                <div key={key} className={`bg-archetype-${archetypeDetail.id}/5 rounded-lg p-5 border border-archetype-${archetypeDetail.id}/20`}>
                  <h4 className="font-medium text-gray-600 text-sm mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </h4>
                  <div className="flex items-center">
                    <span className={`text-xl font-bold ${
                      stat.trend === 'up' ? 'text-orange-600' : 
                      stat.trend === 'down' ? 'text-green-600' : 
                      `text-archetype-${archetypeDetail.id}`
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
          </div>
            
          {/* Key Characteristics Section */}
          <div>
            <h3 className={`font-bold text-xl mb-5 text-archetype-${archetypeDetail.id}`}>Key Characteristics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {archetypeDetail.keyCharacteristics.map((trait, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-3 p-4 rounded-md bg-archetype-${archetypeDetail.id}/5 border-l-3 border-archetype-${archetypeDetail.id} text-left`}
                >
                  <div className={`h-2.5 w-2.5 mt-1.5 rounded-full bg-archetype-${archetypeDetail.id} flex-shrink-0`}></div>
                  <span className="text-gray-700">{trait}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights Section */}
          <div>
            <h3 className={`font-bold text-xl mb-5 text-archetype-${archetypeDetail.id}`}>Key Insights</h3>
            <ul className="space-y-3 mb-6 text-left">
              {archetypeDetail.keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className={`h-3 w-3 mt-1 rounded-full bg-archetype-${archetypeDetail.id} flex-shrink-0`}></div>
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArchetypeDetailDialog;
