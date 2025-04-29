
import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkforceSummaryCard from './demographics/WorkforceSummaryCard';
import WorkforceCompositionChart from './demographics/WorkforceCompositionChart';
import GeographicPresence from './demographics/GeographicPresence';
import DemographicInsights from './demographics/DemographicInsights';
import NavigationButtons from './demographics/NavigationButtons';
import MetricComparisonCard from '../shared/MetricComparisonCard';

interface DemographicsSectionProps {
  reportData: any;
  averageData: any;
  previousSection?: string;
  nextSection?: string;
  previousSectionName?: string;
  nextSectionName?: string;
}

const DemographicsSection: React.FC<DemographicsSectionProps> = ({ 
  reportData, 
  averageData,
  previousSection,
  nextSection,
  previousSectionName,
  nextSectionName 
}) => {
  // Get demographic insights if available
  const demographicInsights = reportData.demographic_insights || 
    "No specific demographic insights available for this archetype.";

  // Gnome image
  const gnomeImage = '/assets/gnomes/gnome_clipboard.png';
  
  // Demographics metrics
  const metrics = {
    employees: reportData["Demo_Average Employees"] || 0,
    members: reportData["Demo_Average Members"] || 0,
    familySize: reportData["Demo_Average Family Size"] || 0,
    states: reportData["Demo_Average States"] || 0,
    percentFemale: reportData["Demo_Average Percent Female"] || 0,
    age: reportData["Demo_Average Age"] || 0,
    salary: reportData["Demo_Average Salary"] || 0
  };
  
  // Get averages for comparison
  const averages = {
    employees: averageData["Demo_Average Employees"] || 0,
    members: averageData["Demo_Average Members"] || 0,
    familySize: averageData["Demo_Average Family Size"] || 0,
    states: averageData["Demo_Average States"] || 0,
    percentFemale: averageData["Demo_Average Percent Female"] || 0,
    age: averageData["Demo_Average Age"] || 0,
    salary: averageData["Demo_Average Salary"] || 0
  };
  
  return (
    <div className="space-y-8">
      {/* Header Section with Image */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-6">Demographics</h1>
          <p className="text-lg mb-6">
            Understanding the demographic composition of your workforce is essential for tailoring 
            healthcare benefits effectively. This section examines key demographic characteristics 
            of the {reportData.archetype_name} archetype and how they influence healthcare needs and costs.
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <img
            src={gnomeImage}
            alt="Demographics Gnome"
            className="max-h-64 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/gnomes/placeholder.svg';
            }}
          />
        </div>
      </div>

      {/* Workforce Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <WorkforceSummaryCard 
          title="Employees"
          value={metrics.employees}
          average={averages.employees}
          icon={<Users className="h-5 w-5" />}
        />
        
        <WorkforceSummaryCard 
          title="Members"
          value={metrics.members}
          average={averages.members}
          icon={<Users className="h-5 w-5" />}
        />
        
        <WorkforceSummaryCard 
          title="Family Size"
          value={metrics.familySize}
          average={averages.familySize}
          decimals={1}
          icon={<Users className="h-5 w-5" />}
        />
        
        <WorkforceSummaryCard 
          title="States"
          value={metrics.states}
          average={averages.states}
          decimals={0}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Workforce Composition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users className="mr-2 h-5 w-5 text-blue-600" />
              Workforce Demographics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WorkforceCompositionChart
              percentFemale={metrics.percentFemale}
              averagePercentFemale={averages.percentFemale}
              averageAge={metrics.age}
              archetype={reportData.archetype_name || reportData.name}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users className="mr-2 h-5 w-5 text-blue-600" />
              Geographic Presence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GeographicPresence 
              states={metrics.states}
              averageStates={averages.states}
            />
          </CardContent>
        </Card>
      </div>

      {/* Additional Demographic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricComparisonCard
          title="Average Age"
          value={metrics.age}
          average={averages.age}
          unit="years"
        />
        
        <MetricComparisonCard
          title="Average Salary"
          value={metrics.salary}
          average={averages.salary}
          unit="USD"
        />
      </div>

      {/* Family Size Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Users className="mr-2 h-5 w-5 text-blue-600" />
            Family Size Impact on Healthcare Costs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-lg mb-2">Per-Employee vs. Per-Member Metrics</h3>
              <p className="text-gray-700">
                With an average family size of <strong>{metrics.familySize.toFixed(1)}</strong> members per employee
                (compared to the archetype average of {averages.familySize.toFixed(1)}), this affects how costs
                are distributed across your population.
              </p>
              <p className="text-gray-700 mt-4">
                Organizations with larger family sizes typically see a greater difference between their 
                per-employee (PEPY) and per-member (PMPY) costs, as benefits extend to more dependents.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Cost Impact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>PEPY/PMPY Ratio:</span>
                  <strong>{calculateRatio(metrics.familySize).toFixed(2)}</strong>
                </li>
                <li className="flex justify-between">
                  <span>Medical Cost per Employee:</span>
                  <strong>${reportData["Cost_Medical Paid Amount PEPY"]?.toLocaleString() || 'N/A'}</strong>
                </li>
                <li className="flex justify-between">
                  <span>Medical Cost per Member:</span>
                  <strong>${reportData["Cost_Medical Paid Amount PMPY"]?.toLocaleString() || 'N/A'}</strong>
                </li>
                <li className="flex justify-between">
                  <span>Rx Cost per Employee:</span>
                  <strong>${reportData["Cost_RX Paid Amount PEPY"]?.toLocaleString() || 'N/A'}</strong>
                </li>
                <li className="flex justify-between">
                  <span>Rx Cost per Member:</span>
                  <strong>${reportData["Cost_RX Paid Amount PMPY"]?.toLocaleString() || 'N/A'}</strong>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demographic Insights */}
      <DemographicInsights insights={demographicInsights} />

      {/* Navigation Buttons */}
      {previousSection && nextSection && (
        <NavigationButtons
          previousSection={previousSection}
          nextSection={nextSection}
          previousSectionName={previousSectionName || "Previous Section"}
          nextSectionName={nextSectionName || "Next Section"}
        />
      )}
    </div>
  );
};

// Helper function to calculate the typical ratio between PEPY and PMPY based on family size
const calculateRatio = (familySize: number): number => {
  if (!familySize || familySize < 1) return 1;
  return familySize;
};

export default DemographicsSection;
