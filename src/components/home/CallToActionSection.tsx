
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trackingService } from '@/services/trackingService';

const CallToActionSection = () => {
  const handleCtaClick = () => {
    trackingService.ctaClicked('Find Your Free Healthcare Archetype', 'call-to-action-section', '/assessment');
  };

  return (
    <section className="bg-gradient-to-b from-white to-blue-50/30 py-20">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-3">
          Ready to Discover Your Healthcare Archetype?
        </h2>
        
        <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed">
          Take our 3-minute assessment and unlock insights tailored to your organization. Discover which healthcare archetype matches your company, how you compare to truly similar organizations, and what strategic opportunities have the highest chance of success.
        </p>
        
        <p className="text-gray-600 text-lg md:text-xl mb-12">
          Give it a try! Companies that have found their healthcare archetype have discovered high-impact opportunities without months of analysis.
        </p>
        
        <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full" onClick={handleCtaClick}>
          <Link to="/assessment">Find Your Free Healthcare Archetype</Link>
        </Button>
      </div>
    </section>
  );
};

export default CallToActionSection;
