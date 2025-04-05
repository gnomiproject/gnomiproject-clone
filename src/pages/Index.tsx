
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/shared/Button';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Grid, List } from 'lucide-react';
import { useArchetypes } from '@/hooks/useArchetypes';
import ArchetypeCard from '@/components/home/ArchetypeCard';

const Index = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { getAllArchetypeSummaries } = useArchetypes();
  const archetypeSummaries = getAllArchetypeSummaries;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-6 md:px-12 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
              <img 
                src="/lovable-uploads/3efcc8b7-0e2d-4a2b-bb23-fa686f18c691.png" 
                alt="Gnome character" 
                className="h-28 md:h-32 animate-fade-in"
              />
            </div>
            <div className="md:w-3/4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                What's Your Company's <span className="text-blue-500">Healthcare Personality?</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6">
                Curious why your healthcare program differs from similar companies? Wonder which strategies would work best for your unique workforce?
              </p>
              <p className="text-lg md:text-xl text-gray-600 mb-6">
                In just 3 minutes, discover which of our nine healthcare archetypes matches your organization. Based on data from 400+ companies and 7+ million members, these archetypes reveal insights that typical industry benchmarks miss.
              </p>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Give it a try! Uncover your organization's true healthcare identity and learn what strategies work best for companies just like yours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/assessment">
                  <Button>Find Your Archetype</Button>
                </Link>
                <Link to="#archetype-section">
                  <Button variant="secondary">Explore All Archetypes</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DNA Section */}
      <section className="py-16 px-6 md:px-12 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-8">
            <div className="w-full">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Archetypes Unlock Your Healthcare Program's Hidden Potential
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Understand what truly drives, limits, and distinguishes your healthcare program. Our archetypes reveal the underlying patterns that explain your unique outcomes, helping you build more effective strategies tailored to your organization's distinctive healthcare characteristics and behavioral tendencies.
              </p>
              <p className="text-lg text-gray-600">
                After analyzing data from 400+ employers and over 7 million members, we've identified nine distinct healthcare archetypes organized into three families. Each archetype represents a unique pattern of healthcare costs, utilization behaviors, and outcomes that helps explain your program's performance and reveals targeted strategies that similar organizations have successfully implemented.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Archetypes Section */}
      <section id="archetype-section" className="py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <SectionTitle 
            title="Meet the Employer Healthcare Archetypes" 
            subtitle="Explore the nine archetype profiles we've identified, each with unique healthcare management patterns and opportunities." 
            center
            className="mb-12"
          />

          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-medium text-gray-700">
              {archetypeSummaries.length} Archetypes
            </h3>
            <div className="bg-white border rounded-lg flex overflow-hidden shadow-sm">
              <button
                className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setView('grid')}
                aria-label="Grid view"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                className={`p-2.5 transition-colors ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setView('list')}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className={`grid ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {archetypeSummaries.map(archetype => (
              <ArchetypeCard 
                key={archetype.id}
                id={archetype.id}
                title={archetype.name}
                category={`Family ${archetype.familyId}`}
                color={archetype.color}
                description={archetype.description}
                characteristics={archetype.keyCharacteristics}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-12 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Discover Your Healthcare Archetype?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Take our 3-minute assessment and unlock insights tailored to your organization. 
            Discover which healthcare archetype matches your company, how you compare to 
            truly similar organizations, and what strategic opportunities have the highest 
            chance of success.
          </p>
          <p className="text-lg text-gray-600 mb-10">
            Give it a try! Companies that have found their healthcare archetype have discovered 
            high-impact opportunities without months of analysis.
          </p>
          
          <div className="flex justify-center">
            <Link to="/assessment">
              <Button className="text-lg px-8 py-4">Find Your Healthcare Archetype</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
