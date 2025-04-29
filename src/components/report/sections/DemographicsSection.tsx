
import React from 'react';
import { Users, Building, Map, User, Calendar, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import { formatNumber } from '@/utils/formatters';
import WorkforceSummaryCard from './demographics/WorkforceSummaryCard';
import WorkforceCompositionChart from './demographics/WorkforceCompositionChart';
import GeographicPresence from './demographics/GeographicPresence';
import DemographicInsights from './demographics/DemographicInsights';
import NavigationButtons from './demographics/NavigationButtons';

interface DemographicsSectionProps {
  reportData: any;
  averageData: any;
}

const DemographicsSection: React.FC<DemographicsSectionProps> = ({ reportData, averageData }) => {
  if (!reportData) {
    return (
      <Section id="demographics">
        <SectionTitle title="Demographics" />
        <Card className="p-6">
          <p>No demographic data available.</p>
        </Card>
      </Section>
    );
  }

  // Get demographic insights text
  const demographicInsights = reportData.demographic_insights || 
    "No specific demographic insights available for this archetype.";
  
  // Gnome image
  const gnomeImage = '/assets/gnomes/gnome_clipboard.png';

  return (
    <Section id="demographics">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <SectionTitle 
            title="Demographics" 
            subtitle="Understanding your workforce demographics is essential for tailoring benefits and wellness programs to your specific population needs."
          />
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <WorkforceSummaryCard 
          title="Employees"
          value={reportData["Demo_Average Employees"] || 0}
          averageValue={averageData["Demo_Average Employees"] || 0}
          icon={<Users className="h-5 w-5" />}
        />
        
        <WorkforceSummaryCard 
          title="Members"
          value={reportData["Demo_Average Members"] || 0}
          averageValue={averageData["Demo_Average Members"] || 0}
          icon={<User className="h-5 w-5" />}
        />
        
        <WorkforceSummaryCard 
          title="Average Family Size"
          value={reportData["Demo_Average Family Size"] || 0}
          averageValue={averageData["Demo_Average Family Size"] || 0}
          icon={<Users className="h-5 w-5" />}
          decimals={1}
        />
        
        <WorkforceSummaryCard 
          title="Average Age"
          value={reportData["Demo_Average Age"] || 0}
          averageValue={averageData["Demo_Average Age"] || 0}
          icon={<Calendar className="h-5 w-5" />}
          suffix="years"
          decimals={1}
        />
        
        <WorkforceSummaryCard 
          title="Female Population"
          value={reportData["Demo_Average Percent Female"] || 0}
          averageValue={averageData["Demo_Average Percent Female"] || 0}
          icon={<User className="h-5 w-5" />}
          isPercent={true}
        />
        
        <WorkforceSummaryCard 
          title="Average Salary"
          value={reportData["Demo_Average Salary"] || 0}
          averageValue={averageData["Demo_Average Salary"] || 0}
          icon={<CreditCard className="h-5 w-5" />}
          isCurrency={true}
        />
      </div>

      {/* Workforce Composition and Geographic Presence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <WorkforceCompositionChart 
          reportData={reportData}
          averageData={averageData}
        />
        
        <GeographicPresence 
          states={reportData["Demo_Average States"] || 0}
          averageStates={averageData["Demo_Average States"] || 0}
        />
      </div>

      {/* Demographic Insights */}
      <DemographicInsights insights={demographicInsights} />
      
      {/* Navigation Buttons */}
      <NavigationButtons 
        previousSection="archetype-profile"
        nextSection="cost-analysis"
        previousSectionName="Archetype Profile"
        nextSectionName="Cost Analysis"
      />
    </Section>
  );
};

export default DemographicsSection;
