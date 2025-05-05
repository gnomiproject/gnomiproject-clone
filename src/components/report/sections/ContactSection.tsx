
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContactSectionProps {
  userData: any;
}

const ContactSection: React.FC<ContactSectionProps> = ({ userData }) => {
  const contactName = userData?.name || 'Your Healthcare Strategist';
  const contactEmail = userData?.email || 'support@healthcarearchetypes.com';
  const organization = userData?.organization || 'Your Organization';
  
  return (
    <div className="space-y-6">
      {/* About This Report Section (Moved from Introduction) */}
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

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
        <p className="text-gray-600">
          Have questions about this report or need further assistance? Reach out to our team.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Your Report Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-600">Report For:</dt>
                <dd>{contactName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-600">Organization:</dt>
                <dd>{organization}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-600">Contact Email:</dt>
                <dd>
                  <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline">
                    {contactEmail}
                  </a>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex gap-2 items-start">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">1</span>
                <span>Schedule a follow-up call with your healthcare strategist</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">2</span>
                <span>Share this report with your benefits team</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">3</span>
                <span>Review the strategic recommendations and prioritize actions</span>
              </li>
            </ul>
          </CardContent>
        </Card>
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
