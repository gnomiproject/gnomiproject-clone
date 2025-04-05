
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/shared/Button';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  // Archetype data for the cards
  const archetypes = [
    {
      family: 'a',
      id: 'a1',
      title: 'Innovation Leaders',
      description: 'Organizations focused on innovation with knowledge workers and significant resources for benefits.',
      characteristics: [
        'Technology-forward approach',
        'High percentage of knowledge workers'
      ],
      color: 'border-orange-400'
    },
    {
      family: 'a',
      id: 'a2',
      title: 'Complex Condition Managers',
      description: 'Adept at managing clinical complexity, these are organizations that face populations with elevated risk scores and high-cost specialty conditions.',
      characteristics: [
        'Effectively manages populations with higher clinical risk',
        'Coordinates care for complex specialty conditions'
      ],
      color: 'border-teal-400'
    },
    {
      family: 'a',
      id: 'a3',
      title: 'Proactive Care Consumers',
      description: 'Focused on prevention and early intervention, these are organizations with younger populations, large families, and high specialty care demand.',
      characteristics: [
        'Focuses intensively on prevention and early intervention',
        'Supports larger families with comprehensive benefits'
      ],
      color: 'border-yellow-400'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-6 md:px-12 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/6 mb-8 md:mb-0">
              {/* Gnome image removed */}
            </div>
            <div className="md:w-full md:pl-8">
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
                <Button variant="secondary">Explore All Archetypes</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DNA Section */}
      <section className="py-16 px-6 md:px-12 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/5">
              {/* DNA image removed */}
            </div>
            <div className="md:w-full">
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
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <SectionTitle 
            title="Meet the Employer Healthcare Archetypes" 
            subtitle="Explore the nine archetype profiles we've identified, each with unique healthcare management patterns and opportunities." 
            center
            className="mb-12"
          />

          <div className="mb-8 flex gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
              <span className="grid place-items-center w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
              </span>
              Grid
            </button>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-md border flex items-center gap-2">
              <span className="grid place-items-center w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </span>
              List
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archetypes.map((archetype) => (
              <Card key={archetype.id} className={`border-t-4 ${archetype.color}`}>
                <CardContent className="pt-6">
                  <div className="flex gap-2 mb-4">
                    <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">Family {archetype.family}</span>
                    <span className={`text-xs px-3 py-1 rounded-full border ${
                      archetype.id === 'a1' ? 'border-orange-400 text-orange-600' : 
                      archetype.id === 'a2' ? 'border-teal-400 text-teal-600' : 
                      'border-yellow-400 text-yellow-600'
                    }`}>{archetype.id}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4">{archetype.title}</h3>
                  <p className="text-gray-600 mb-6">{archetype.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Key Characteristics:</h4>
                    <ul className="space-y-2">
                      {archetype.characteristics.map((characteristic, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className={`mt-1 rounded-full w-4 h-4 ${
                            archetype.id === 'a1' ? 'bg-orange-500' : 
                            archetype.id === 'a2' ? 'bg-teal-500' : 
                            'bg-yellow-500'
                          }`}></span>
                          <span className="text-gray-600">{characteristic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="w-full border border-gray-200 py-3 flex items-center justify-center gap-2 rounded-md hover:bg-gray-50 transition-colors">
                    Learn More <ArrowRight size={16} />
                  </button>
                </CardContent>
              </Card>
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
          
          <div className="flex justify-center mb-10">
            <Link to="/assessment">
              <Button className="text-lg px-8 py-4">Find Your Healthcare Archetype</Button>
            </Link>
          </div>
          
          <div className="flex justify-center">
            {/* Gnome image removed */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
