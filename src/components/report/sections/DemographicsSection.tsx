
import React from 'react';
import { Users, User, Building2, MapPin, Users2, CalendarClock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkforceSummaryCard from './demographics/WorkforceSummaryCard';
import WorkforceCompositionChart from './demographics/WorkforceCompositionChart';
import GeographicPresence from './demographics/GeographicPresence';
import DemographicInsights from './demographics/DemographicInsights';
import { formatNumber } from '@/utils/formatters';
import { calculateCostPerMember } from '@/utils/reports/costUtils';

interface DemographicsSectionProps {
  reportData: any;
  averageData: any;
  previousSection?: string;
  nextSection?: string;
  previousSectionName?: string;
  nextSectionName?: string;
  onNavigate?: (sectionId: string) => void;
}

const DemographicsSection: React.FC<DemographicsSectionProps> = ({ 
  reportData, 
  averageData
}) => {
  // Extract demographic data
  const employees = reportData?.["Demo_Average Employees"] || 0;
  const members = reportData?.["Demo_Average Members"] || 0;
  const familySize = reportData?.["Demo_Average Family Size"] || 0;
  const states = reportData?.["Demo_Average States"] || 0;
  const percentFemale = reportData?.["Demo_Average Percent Female"] || 0;
  const age = reportData?.["Demo_Average Age"] || 0;
  const salary = reportData?.["Demo_Average Salary"] || 0;
  
  // Extract average data for comparison
  const avgEmployees = averageData?.["Demo_Average Employees"] || 0;
  const avgMembers = averageData?.["Demo_Average Members"] || 0;
  const avgFamilySize = averageData?.["Demo_Average Family Size"] || 0;
  const avgStates = averageData?.["Demo_Average States"] || 0;
  const avgPercentFemale = averageData?.["Demo_Average Percent Female"] || 0;
  const avgAge = averageData?.["Demo_Average Age"] || 0;
  const avgSalary = averageData?.["Demo_Average Salary"] || 0;
  
  // Log comparison data for debugging
  console.log('[DemographicsSection] Comparison Data:', {
    employees, avgEmployees,
    members, avgMembers,
    familySize, avgFamilySize,
    states, avgStates,
    age, avgAge,
    salary, avgSalary
  });
  
  // Demographic insights
  const insights = reportData?.demographic_insights || '';
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-4">Demographics</h1>
          
          <p className="text-lg mb-6">
            Understanding your workforce demographics provides valuable context for healthcare needs and 
            utilization patterns. This section analyzes key demographic characteristics of this 
            archetype compared to others.
          </p>
        </div>
      </div>
      
      {/* Demographic Insights - Moved to the top */}
      <DemographicInsights insights={insights} />
      
      {/* Workforce Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <WorkforceSummaryCard 
          title="Employees"
          value={employees}
          average={avgEmployees}
          icon={<Users className="h-5 w-5" />}
        />
        
        <WorkforceSummaryCard 
          title="Members"
          value={members}
          average={avgMembers}
          icon={<Users2 className="h-5 w-5" />}
        />
        
        <WorkforceSummaryCard 
          title="Average Family Size"
          value={familySize}
          average={avgFamilySize}
          decimals={1}
          icon={<User className="h-5 w-5" />}
        />
        
        <WorkforceSummaryCard 
          title="Average Age"
          value={age}
          average={avgAge}
          decimals={1}
          icon={<CalendarClock className="h-5 w-5" />}
        />
        
        <WorkforceSummaryCard 
          title="States Present"
          value={states}
          average={avgStates}
          icon={<MapPin className="h-5 w-5" />}
        />
        
        <WorkforceSummaryCard 
          title="Average Salary"
          value={salary}
          average={avgSalary}
          unit="$"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>
      
      {/* Workforce Composition and Geographic Presence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <WorkforceCompositionChart 
          percentFemale={percentFemale * 100} 
          averagePercentFemale={avgPercentFemale * 100}
          archetype={reportData?.archetype_name || reportData?.name || 'Archetype'}
        />
        
        <GeographicPresence 
          states={states} 
          averageStates={avgStates}
        />
      </div>
      
      {/* Family Size and Cost Impact */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Building2 className="mr-2 h-5 w-5 text-blue-600" />
            Family Size Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The average family size for this archetype is <strong>{familySize.toFixed(1)}</strong> members
            per employee, compared to an average of <strong>{avgFamilySize.toFixed(1)}</strong> across 
            all archetypes.
          </p>
          
          {/* Cost impact section */}
          {reportData["Cost_Medical & RX Paid Amount PEPY"] && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Impact on Cost Metrics</h4>
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Cost per Employee (PEPY)</p>
                    <p className="text-xl font-bold">
                      {formatNumber(reportData["Cost_Medical & RX Paid Amount PEPY"], 'currency')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cost per Member (PMPY)</p>
                    <p className="text-xl font-bold">
                      {formatNumber(reportData["Cost_Medical & RX Paid Amount PMPY"], 'currency')}
                    </p>
                  </div>
                </div>
                <p className="text-sm mt-3">
                  With a family size of {familySize.toFixed(1)}, each employee cost is divided among 
                  {' '}{familySize.toFixed(1)} members, resulting in a per-member cost that is
                  {' '}{((1 / familySize) * 100).toFixed(0)}% of the per-employee cost.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DemographicsSection;
