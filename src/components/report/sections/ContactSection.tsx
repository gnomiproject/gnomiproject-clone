
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SectionTitle from '@/components/shared/SectionTitle';

interface ContactSectionProps {
  userData: any;
}

const ContactSection: React.FC<ContactSectionProps> = ({ userData }) => {
  return (
    <div className="space-y-6">
      
      {/* About This Report Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">About This Report</h2>
        
        <p className="text-gray-700 mb-4">
          This comprehensive deep dive report provides an in-depth analysis of your organization's healthcare profile, 
          including detailed metrics, strategic recommendations, and actionable insights tailored to your specific needs.
        </p>
        
        <p className="text-gray-700 mb-4">
          The report examines key health factors across demographics, utilization patterns, risk factors, 
          cost analysis, care gaps, and disease management. Each section includes comparison data against 
          population averages to provide context for the findings, with special attention to areas where your organization may excel or face challenges.
        </p>
        
        <div className="mt-5">
          <h3 className="text-lg font-semibold mb-2">How to Use This Report</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Review each section for detailed analysis relevant to your organization</li>
            <li>Use the navigation sidebar to jump between sections</li>
            <li>Focus on the Strategic Recommendations for actionable steps</li>
            <li>Use the SWOT Analysis to understand strengths and opportunities</li>
          </ul>
        </div>
      </div>
      
      <Card className="mt-6 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-2">Thank You</h3>
          <p>
            Thank you for using our Healthcare Archetype Analysis tool. We're committed to helping you improve 
            healthcare outcomes for your organization.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactSection;
