import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/shared/Section";
import SectionTitle from '@/components/shared/SectionTitle';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import InteractiveDNAExplorer from '@/components/home/InteractiveDNAExplorer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ArrowDown } from 'lucide-react';

interface FamilyData {
  id: string;
  name: string;
  description: string;
  common_traits: string[];
}

const Index = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [families, setFamilies] = useState<FamilyData[]>([]);

  // Fetch families from Supabase - Fixed React Query hook usage
  const { isLoading: isLoadingFamilies } = useQuery({
    queryKey: ['families'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Core_Archetype_Families')
        .select('*');

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load archetype families",
          variant: "destructive"
        });
        throw error;
      }
      return data;
    },
    // Use onSettled instead of onSuccess and onError in newer versions of react-query
    meta: {
      onSettled: (data: any, error: any) => {
        if (error) {
          console.error("Error fetching families:", error);
        } else if (data) {
          setFamilies(data as FamilyData[]);
        }
      }
    }
  });

  // Scroll to archetypes section
  const scrollToArchetypes = (e: React.MouseEvent) => {
    e.preventDefault();
    const archetypeSection = document.getElementById('archetype-section');
    archetypeSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

      {/* Interactive DNA Explorer Section */}
      <InteractiveDNAExplorer />

      {/* Families Section */}
      <Section id="families-section" className="bg-gray-50 py-16">
        <div className="container mx-auto">
          <SectionTitle
            title="Explore the Three Employer Healthcare Families"
            subtitle="Understand the unique characteristics, strengths, and challenges of each family to better identify your organization's approach."
            center
          />

          {isLoadingFamilies ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle><Skeleton className="h-5 w-3/4" /></CardTitle>
                    <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {families.map((family) => {
                // Convert commonTraits from JSON to string array
                const commonTraits = Array.isArray(family.common_traits) 
                  ? family.common_traits.map(trait => String(trait))
                  : [];

                return (
                  <Card key={family.id}>
                    <CardHeader>
                      <CardTitle>{family.name}</CardTitle>
                      <CardDescription>{family.id.toUpperCase()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{family.description}</p>
                      <h4 className="font-semibold text-gray-700 mb-2">Common Traits:</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {commonTraits.map((trait, index) => (
                          <li key={index}>{trait}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Section>

      {/* Archetypes Section */}
      <Section id="archetype-section" className="bg-white py-16">
        <div className="container mx-auto">
          <SectionTitle
            title="Meet the Nine Employer Healthcare Archetypes"
            subtitle="Dive deeper into each archetype to uncover specific strategies, strengths, and areas for improvement."
            center
          />

          {/* Accordion for Mobile */}
          {isMobile && (
            <Accordion type="single" collapsible className="w-full">
              {families.map((family) => {
                // Convert commonTraits from JSON to string array
                const commonTraits = Array.isArray(family.common_traits) 
                  ? family.common_traits.map(trait => String(trait))
                  : [];

                return (
                  <AccordionItem value={family.id} key={family.id}>
                    <AccordionTrigger>
                      {family.name}
                      <ArrowDown className="h-4 w-4 shrink-0 ml-2" />
                    </AccordionTrigger>
                    <AccordionContent>
                      <Card>
                        <CardHeader>
                          <CardTitle>{family.name}</CardTitle>
                          <CardDescription>{family.id.toUpperCase()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">{family.description}</p>
                          <h4 className="font-semibold text-gray-700 mb-2">Common Traits:</h4>
                          <ul className="list-disc list-inside text-gray-600">
                            {commonTraits.map((trait, index) => (
                              <li key={index}>{trait}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}

          {/* Grid for Desktop */}
          {!isMobile && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {families.map((family) => {
                // Convert commonTraits from JSON to string array
                const commonTraits = Array.isArray(family.common_traits) 
                  ? family.common_traits.map(trait => String(trait))
                  : [];

                return (
                  <Card key={family.id}>
                    <CardHeader>
                      <CardTitle>{family.name}</CardTitle>
                      <CardDescription>{family.id.toUpperCase()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{family.description}</p>
                      <h4 className="font-semibold text-gray-700 mb-2">Common Traits:</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {commonTraits.map((trait, index) => (
                          <li key={index}>{trait}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center">
            <Button size="lg" asChild>
              <Link to="/assessment">Discover Your Archetype</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Index;
