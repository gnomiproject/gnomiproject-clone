import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '@/components/shared/Button';
import SectionTitle from '@/components/shared/SectionTitle';
import { Grid, List } from 'lucide-react';
import { useArchetypes } from '@/hooks/useArchetypes';
import { ArchetypeId } from '@/types/archetype';
import ArchetypeReport from '@/components/insights/ArchetypeReport';

const Insights = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(null);
  const location = useLocation();
  const { getAllArchetypes } = useArchetypes();
  const archetypes = getAllArchetypes();
  
  useEffect(() => {
    // Check if an archetype was selected from Results page
    if (location.state?.selectedArchetype) {
      setSelectedArchetype(location.state.selectedArchetype);
      // Clear the location state to avoid persisting the selection on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {selectedArchetype ? (
          <>
            <div className="mb-6">
              <button 
                onClick={() => setSelectedArchetype(null)} 
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to All Archetypes
              </button>
            </div>
            <ArchetypeReport archetypeId={selectedArchetype} />
          </>
        ) : (
          <>
            <section className="mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-8 md:p-12">
                <div className="max-w-4xl mx-auto">
                  <SectionTitle
                    title="Meet the Employer Healthcare Archetypes"
                    subtitle="Explore the nine archetype profiles we've identified, each with unique healthcare management patterns and opportunities."
                    center
                  />
                </div>
              </div>
            </section>
            
            <div className="mb-8 flex items-center justify-start">
              <div className="bg-white border rounded-lg flex overflow-hidden">
                <button
                  className={`p-2 ${view === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
                  onClick={() => setView('grid')}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  className={`p-2 ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
                  onClick={() => setView('list')}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className={`grid ${view === 'grid' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {archetypes.map(archetype => (
                <ArchetypeCard 
                  key={archetype.id}
                  id={archetype.id}
                  title={archetype.name}
                  category={`Family ${archetype.familyId}`}
                  color={getColorName(archetype.color)}
                  description={archetype.summary.description}
                  characteristics={archetype.summary.keyCharacteristics}
                  onSelect={() => setSelectedArchetype(archetype.id)}
                />
              ))}
            </div>
            
            <section className="mt-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <img 
                    src="/lovable-uploads/ca1c73d6-92e6-464a-b685-4f51fb7c26c1.png" 
                    alt="DNA Double Helix" 
                    className="w-full h-auto"
                  />
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-6">
                    <span>Archetypes Unlock Your Healthcare Program's </span>
                    <span className="text-blue-500">Hidden Potential</span>
                  </h2>
                  
                  <p className="text-gray-700 mb-6">
                    Understand what truly drives, limits, and distinguishes your healthcare program. Our archetypes reveal the underlying patterns that explain your unique outcomes, helping you build more effective strategies tailored to your organization's distinctive healthcare characteristics and behavioral tendencies.
                  </p>
                  
                  <p className="text-gray-700 mb-6">
                    After analyzing data from 400+ employers and over 7 million members, we've identified nine distinct healthcare archetypes organized into three families. Each archetype represents a unique pattern of healthcare costs, utilization behaviors, and outcomes that helps explain your program's performance and reveals targeted strategies that similar organizations have successfully implemented.
                  </p>
                </div>
              </div>
            </section>
            
            <section className="mt-20 mb-10">
              <div className="bg-blue-50 rounded-lg p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/3">
                    <img 
                      src="/lovable-uploads/207a4c72-eb25-4e20-9794-c53fdbb4ea68.png" 
                      alt="Gnome Mascot" 
                      className="w-full h-auto max-w-[200px] mx-auto"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-4xl font-bold mb-6">
                      <span>What's Your Company's </span>
                      <span className="text-blue-500">Healthcare Personality?</span>
                    </h2>
                    
                    <p className="text-gray-700 mb-4">
                      Curious why your healthcare program differs from similar companies? Wonder which strategies would work best for your unique workforce?
                    </p>
                    
                    <p className="text-gray-700 mb-4">
                      In just 3 minutes, discover which of our nine healthcare archetypes matches your organization. Based on data from 400+ companies and 7+ million members, these archetypes reveal insights that typical industry benchmarks miss.
                    </p>
                    
                    <p className="text-gray-700 mb-6">
                      Give it a try! Uncover your organization's true healthcare identity and learn what strategies work best for companies just like yours.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button>Find Your Archetype</Button>
                      <Button variant="secondary">Explore All Archetypes</Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

interface ArchetypeCardProps {
  id: string;
  title: string;
  category: string;
  color: 'orange' | 'teal' | 'yellow' | 'blue' | 'purple' | 'green';
  description: string;
  characteristics: string[];
  onSelect: () => void;
}

const ArchetypeCard = ({ id, title, category, color, description, characteristics, onSelect }: ArchetypeCardProps) => {
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
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${colorStyles[color].border} overflow-hidden`}>
      <div className="p-6">
        <div className="mb-4 flex items-center">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${colorStyles[color].category} mr-2`}>
            {category}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${colorStyles[color].badge}`}>
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
            {characteristics.map((item, index) => (
              <li key={index} className="flex items-center">
                <span className={`mr-2 flex-shrink-0 ${colorStyles[color].icon}`}>●</span>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <button 
          onClick={onSelect}
          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
        >
          View Details 
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Helper function to map color values to valid colors in the ArchetypeCardProps
function getColorName(color: string): 'orange' | 'teal' | 'yellow' | 'blue' | 'purple' | 'green' {
  const validColors = {
    orange: 'orange',
    teal: 'teal',
    yellow: 'yellow',
    blue: 'blue',
    purple: 'purple',
    green: 'green',
    red: 'orange',    // Fallback mapping
    indigo: 'purple', // Fallback mapping
    pink: 'purple'    // Fallback mapping
  };
  
  return validColors[color as keyof typeof validColors] || 'blue';
}

export default Insights;
