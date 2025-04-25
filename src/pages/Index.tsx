
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import SectionTitle from '@/components/shared/SectionTitle';
import InteractiveDNAExplorer from '@/components/home/InteractiveDNAExplorer';
import ArchetypesGridSection from '@/components/home/ArchetypesGridSection';
import { Section } from '@/components/shared/Section';

const Index = () => {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-white py-24">
        <div className="container mx-auto text-center">
          <SectionTitle
            title="Unlock the DNA of Your Organization's Healthcare Strategy"
            subtitle="Discover how your approach to healthcare benefits compares to other employers and gain actionable insights to optimize your strategy."
            center
          />
          <Button size="lg" asChild>
            <Link to="/assessment">Take the Free Assessment</Link>
          </Button>
        </div>
      </Section>

      {/* Interactive DNA Explorer */}
      <InteractiveDNAExplorer />

      {/* Archetypes Grid */}
      <ArchetypesGridSection />
    </>
  );
};

export default Index;
