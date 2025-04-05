
import React from 'react';
import { Link } from 'react-router-dom';
import StatCard from '@/components/shared/StatCard';
import Button from '@/components/shared/Button';
import SectionTitle from '@/components/shared/SectionTitle';
import { ArrowRight, Check, Zap, Shield, Heart } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-6 md:px-12 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="inline-block bg-blue-100 text-blue-500 rounded-full px-4 py-1 text-sm font-medium mb-4">
              About Nomi
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span>Pioneering Healthcare </span>
                <span className="text-blue-500">Intelligence</span>
              </h1>

              <p className="text-gray-600 text-lg mb-8">
                Nomi is a healthcare intelligence company dedicated to making healthcare more efficient, effective, and equitable. The gNomi Project represents our commitment to understanding the fundamental structures that drive healthcare outcomes.
              </p>

              <p className="text-gray-600 text-lg mb-8">
                By identifying and analyzing corporate archetypes, we provide organizations with a deeper understanding of their inherent strengths, challenges, and optimal paths forward.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button>
                  Visit Nomi Website
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard value="500+" label="Healthcare Organizations Analyzed" />
              <StatCard value="9" label="Distinct Corporate Archetypes Identified" />
              <StatCard value="$40B+" label="Healthcare Spend Evaluated" />
              <StatCard value="30M+" label="Patient Records Analyzed" />
            </div>
          </div>
        </div>
      </section>

      {/* Archetype Journey Section */}
      <section className="py-16 md:py-24 bg-gray-50 px-6 md:px-12 text-center">
        <div className="max-w-5xl mx-auto">
          <SectionTitle 
            title="Begin Your Archetype Journey"
            subtitle="Discover which archetype best describes your healthcare organization and unlock insights to drive better outcomes."
            center
          />
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Button>Take the Assessment</Button>
            <Button variant="secondary">Explore Archetypes</Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <SectionTitle 
            title="How It Works"
            subtitle="The gNomi Project combines extensive data analysis with expert insights to decode the fundamental structures of healthcare organizations."
            center
          />

          <div className="mt-16 space-y-16">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-4">
                <Zap className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Data Collection & Analysis</h3>
                <p className="text-gray-600">Grounded in datasets spanning hundreds of employers, millions of members, and billions in healthcare spend.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-4">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Pattern Recognition</h3>
                <p className="text-gray-600">Our algorithms identify core archetypes at both the population and member level, revealing underlying traits and characteristics.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-4">
                <Heart className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Practical Application</h3>
                <p className="text-gray-600">Transform insights into actionable strategies that improve healthcare outcomes and efficiency.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <div className="inline-block bg-blue-100 text-blue-500 rounded-full px-4 py-1 text-sm font-medium mb-4">
                Our Mission
              </div>
              <h2 className="text-4xl font-bold mb-6">
                <span>Decoding </span>
                <span className="text-blue-500">Healthcare Structures</span>
              </h2>
              <p className="text-gray-600 mb-6">
                Healthcare isn't just a series of transactions; it's a complex system with hidden patterns, dependencies, and risks. The gNomi Project is our effort to decode these structures—so we can engineer a better future.
              </p>
              <Button className="flex items-center">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="md:w-1/2 bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-2xl font-bold mb-4">The gNomi Project</h3>
              <p className="text-gray-600 mb-6">
                Our research has identified nine fundamental archetypes that shape how healthcare organizations operate, make decisions, and evolve over time.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Check className="text-blue-500 mr-2 h-5 w-5" />
                  <span>Data-driven insights</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-blue-500 mr-2 h-5 w-5" />
                  <span>Strategic clarity</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-blue-500 mr-2 h-5 w-5" />
                  <span>Actionable recommendations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white px-6 md:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <SectionTitle 
            title="Ready to Discover Your Healthcare Archetype?"
            subtitle="Take our 3-minute assessment and unlock insights tailored to your organization. Discover which healthcare archetype matches your company, how you compare to truly similar organizations, and what strategic opportunities have the highest chance of success."
            center
          />
          <p className="text-gray-600 mb-8">
            Give it a try! Companies that have found their healthcare archetype have discovered high-impact opportunities without months of analysis.
          </p>
          <Button>Find Your Healthcare Archetype</Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
