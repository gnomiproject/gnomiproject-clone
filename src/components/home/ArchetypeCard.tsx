
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useArchetypes } from '@/hooks/useArchetypes';
import { ArchetypeId } from '@/types/archetype';
import { ArrowRight } from 'lucide-react';

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
  
  const colorStyles = {
    orange: {
      border: 'border-l-orange-500',
      badge: 'bg-orange-100 text-orange-600',
      category: 'bg-orange-100 text-orange-600',
      icon: 'text-orange-500'
    },
    teal: {
      border: 'border-l-teal-500',
      badge: 'bg-teal-100 text-teal-600',
      category: 'bg-teal-100 text-teal-600',
      icon: 'text-teal-500'
    },
    yellow: {
      border: 'border-l-yellow-500',
      badge: 'bg-yellow-100 text-yellow-600',
      category: 'bg-yellow-100 text-yellow-600',
      icon: 'text-yellow-500'
    },
    blue: {
      border: 'border-l-blue-500',
      badge: 'bg-blue-100 text-blue-600',
      category: 'bg-blue-100 text-blue-600',
      icon: 'text-blue-500'
    },
    purple: {
      border: 'border-l-purple-500',
      badge: 'bg-purple-100 text-purple-600',
      category: 'bg-purple-100 text-purple-600',
      icon: 'text-purple-500'
    },
    green: {
      border: 'border-l-green-500',
      badge: 'bg-green-100 text-green-600',
      category: 'bg-green-100 text-green-600',
      icon: 'text-green-500'
    }
  };
  
  const styles = colorStyles[color as keyof typeof colorStyles] || colorStyles.blue;
  const detailedData = getArchetypeStandard(id);
  
  const openDetails = () => setShowDetails(true);
  const closeDetails = () => setShowDetails(false);
  
  return (
    <>
      <div className={`bg-white rounded-lg shadow-sm border-l-4 ${styles.border} overflow-hidden`}>
        <div className="p-6">
          <div className="mb-4 flex items-center">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles.category} mr-2`}>
              {category}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles.badge}`}>
              {id}
            </span>
          </div>
          
          <h3 className="text-xl font-bold mb-4">{title}</h3>
          
          <p className="text-gray-600 text-sm mb-6">
            {description}
          </p>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Key Characteristics:</h4>
            <ul className="space-y-2">
              {characteristics.slice(0, 3).map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className={`mr-2 flex-shrink-0 ${styles.icon}`}>●</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <button 
            onClick={openDetails}
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            View Details 
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={closeDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {detailedData && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles.category}`}>
                    {detailedData.familyName}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles.badge}`}>
                    {detailedData.id}
                  </span>
                </div>
                <DialogTitle className="text-2xl">{detailedData.name}</DialogTitle>
              </DialogHeader>

              <div className="mt-4">
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">{detailedData.fullDescription}</p>
                  
                  <h3 className="font-bold text-lg mb-4">Key Characteristics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {detailedData.keyCharacteristics.map((characteristic, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-md bg-gray-50">
                        <div className={`h-2 w-2 rounded-full bg-${color}-500`}></div>
                        <span>{characteristic}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-bold text-lg mb-4">Key Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {Object.entries(detailedData.keyStatistics).map(([key, stat]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-600 text-sm mb-1">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <div className="flex items-center">
                          <span className={`text-xl font-bold ${
                            stat.trend === 'up' ? 'text-orange-600' : 
                            stat.trend === 'down' ? 'text-green-600' : 
                            'text-gray-600'
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

                  <h3 className="font-bold text-lg mb-4">Key Insights</h3>
                  <ul className="space-y-2 mb-8">
                    {detailedData.keyInsights.map((insight, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full bg-${color}-500 flex-shrink-0`}></div>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
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
