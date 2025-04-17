
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleDot, Database, LineChart, BarChart2 } from 'lucide-react';

const DeepReportMethodology: React.FC = () => {
  return (
    <div className="mb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Methodology</h1>
        <div className="h-1 w-24 rounded-full bg-blue-600 mb-6"></div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Research Approach</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-8">
            The Healthcare Employer Archetype framework is built on a rigorous, data-driven methodology
            that identifies meaningful patterns across employer populations. This approach enables more
            precise benchmarking and more effective strategic recommendations than traditional methods.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Data Sources</h3>
                <p className="text-gray-700 mb-4">
                  Our analysis is based on comprehensive healthcare data from hundreds of employer populations,
                  including:
                </p>
                <ul className="list-disc pl-8 space-y-2 text-gray-700">
                  <li>Claims data spanning multiple years</li>
                  <li>Population demographics and socioeconomic factors</li>
                  <li>Benefits design and program offerings</li>
                  <li>Utilization patterns across care settings</li>
                  <li>Clinical risk and disease prevalence data</li>
                  <li>Social determinants of health measures</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="bg-teal-100 p-3 rounded-full flex-shrink-0">
                <BarChart2 className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Analytical Process</h3>
                <p className="text-gray-700 mb-4">
                  Our archetype development followed a multi-stage analytical process:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <CircleDot className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Data Standardization</h4>
                      <p className="text-gray-600">
                        Normalizing data across varied employer populations to enable meaningful comparison
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <CircleDot className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Pattern Identification</h4>
                      <p className="text-gray-600">
                        Using advanced statistical methods to identify recurring patterns across metrics
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <CircleDot className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Archetype Definition</h4>
                      <p className="text-gray-600">
                        Creating distinct population profiles based on the most significant pattern differentiators
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <CircleDot className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Validation</h4>
                      <p className="text-gray-600">
                        Testing archetype models against new populations to confirm consistent classification
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <CircleDot className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Strategic Context</h4>
                      <p className="text-gray-600">
                        Developing archetype-specific insights, SWOT analyses, and recommendations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>The Archetype Framework</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">
            The Healthcare Employer Archetype framework consists of nine distinct archetypes organized into three families,
            each representing a distinctive pattern of healthcare utilization, cost, and opportunity.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-bold mb-4">Family A: Strategists</h3>
            <p className="text-gray-700 mb-4">
              Organizations characterized by sophisticated healthcare navigation, higher specialist utilization, 
              and lower emergency/inpatient utilization. They typically have higher-compensated workforces with 
              better digital access and lower SDOH barriers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-4 rounded border">
                <div className="h-1 w-8 bg-[#EC7500] mb-2 rounded-full"></div>
                <h4 className="font-bold">A1: Savvy Healthcare Navigators</h4>
              </div>
              <div className="bg-white p-4 rounded border">
                <div className="h-1 w-8 bg-[#46E0D3] mb-2 rounded-full"></div>
                <h4 className="font-bold">A2: Complex Condition Managers</h4>
              </div>
              <div className="bg-white p-4 rounded border">
                <div className="h-1 w-8 bg-[#FFC600] mb-2 rounded-full"></div>
                <h4 className="font-bold">A3: Proactive Care Consumers</h4>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-bold mb-4">Family B: Pragmatists</h3>
            <p className="text-gray-700 mb-4">
              Organizations with balanced utilization patterns and moderate costs. They typically show average 
              risk profiles and demographic characteristics, with specific opportunities in targeted care management.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-4 rounded border">
                <div className="h-1 w-8 bg-[#7030A0] mb-2 rounded-full"></div>
                <h4 className="font-bold">B1: Resourceful Adapters</h4>
              </div>
              <div className="bg-white p-4 rounded border">
                <div className="h-1 w-8 bg-[#FF8C91] mb-2 rounded-full"></div>
                <h4 className="font-bold">B2: Healthcare Pragmatists</h4>
              </div>
              <div className="bg-white p-4 rounded border">
                <div className="h-1 w-8 bg-[#0D41C0] mb-2 rounded-full"></div>
                <h4 className="font-bold">B3: Care Channel Optimizers</h4>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Family C: Logisticians</h3>
            <p className="text-gray-700 mb-4">
              Organizations with distinctive operational and logistical challenges in healthcare management. 
              They often have higher risk populations with significant access barriers or utilization constraints.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-4 rounded border">
                <div className="h-1 w-8 bg-[#E40032] mb-2 rounded-full"></div>
                <h4 className="font-bold">C1: Scalable Access Architects</h4>
              </div>
              <div className="bg-white p-4 rounded border">
                <div className="h-1 w-8 bg-[#00B0F0] mb-2 rounded-full"></div>
                <h4 className="font-bold">C2: Care Adherence Advocates</h4>
              </div>
              <div className="bg-white p-4 rounded border">
                <div className="h-1 w-8 bg-[#870C0C] mb-2 rounded-full"></div>
                <h4 className="font-bold">C3: Engaged Healthcare Consumers</h4>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Limitations and Considerations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">
            While the archetype framework provides valuable insights, users should be aware of the following considerations:
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-bold mb-1">Archetype Overlap</h4>
              <p className="text-gray-600">
                Some organizations may show characteristics of multiple archetypes, typically with one predominant pattern.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-1">Population Variations</h4>
              <p className="text-gray-600">
                Large or geographically dispersed organizations may have subpopulations that fit different archetypes.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-1">Evolution Over Time</h4>
              <p className="text-gray-600">
                Organizations may shift between archetypes as their workforce, benefits programs, or other factors change.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-1">Contextual Factors</h4>
              <p className="text-gray-600">
                Local healthcare market dynamics, regulatory environments, and other external factors may influence optimal strategies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepReportMethodology;
