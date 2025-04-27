
import React from 'react';
import { ArrowRight, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from '@/utils/formatters';
import { gnomeImages } from '@/utils/gnomeImages';
import { getMetricComparisonText } from '@/utils/reports/metricUtils';

interface ReportIntroductionProps {
  reportData: any;
  userData: any;
  averageData: any;
}

interface MetricCardProps {
  title: string;
  value: number;
  average: number;
  metricName: string;
  icon: React.ReactNode;
  positive?: boolean;
}

const MetricCard = ({ 
  title, 
  value, 
  average,
  metricName,
  icon, 
  positive = true 
}: MetricCardProps) => {
  const { text, color } = getMetricComparisonText(value, average, metricName);
  
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-600">{title}</h4>
        <div className={`rounded-full p-2 ${positive ? 'bg-green-100' : 'bg-amber-100'}`}>
          {icon}
        </div>
      </div>
      <div className="mb-1">
        <span className="text-2xl font-bold">{formatNumber(value, 'currency')}</span>
      </div>
      <p className={color}>
        {text}
      </p>
    </div>
  );
};

const ReportIntroduction = ({ reportData, userData, averageData }: ReportIntroductionProps) => {
  const formatArchetypeLabel = (id: string) => {
    const formattedId = id.toLowerCase();
    const familyId = formattedId[0];
    return `${formattedId} ${reportData.archetype_name}`;
  };

  // Extract secondary archetype from assessment results if available
  const assessmentResult = userData.assessment_result || {};
  const secondaryArchetype = assessmentResult.secondaryArchetype || 'A2';
  
  // Gnome image
  const gnomeImage = '/assets/gnomes/gnome_lefthand.png';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Healthcare Deep Dive</h1>
          <h2 className="text-xl text-blue-700 font-medium mb-6">
            Personalized insights for {userData.name} at {userData.organization}
          </h2>
          <p className="text-lg mb-4">
            Based on your assessment, your organization most closely matches the{' '}
            <span className="font-bold">{formatArchetypeLabel(reportData.archetype_id)}</span>.
          </p>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                Primary Match
              </Badge>
              <span className="font-medium">{reportData.archetype_name}</span>
              <span className="text-sm text-gray-600">(90% match)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-gray-600">
                Secondary Match
              </Badge>
              <span className="font-medium">{secondaryArchetype.toUpperCase()}</span>
              <span className="text-sm text-gray-600">(65% match)</span>
            </div>
          </div>
          <p className="mb-6">
            {reportData.short_description}
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <img
            src={gnomeImages.welcome}
            alt="Welcome Gnome"
            className="max-h-64 object-contain"
          />
        </div>
      </div>

      {/* Key Metrics Preview */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Your Key Healthcare Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Annual Cost PEPY"
          value={reportData["Cost_Medical & RX Paid Amount PEPY"] || 0}
          average={averageData["Cost_Medical & RX Paid Amount PEPY"] || 0}
          metricName="Cost_Medical & RX Paid Amount PEPY"
          icon={<TrendingUp className="h-5 w-5" />}
          positive={reportData["Cost_Medical & RX Paid Amount PEPY"] < averageData["Cost_Medical & RX Paid Amount PEPY"]}
        />
        
        <MetricCard 
          title="Risk Score"
          value={reportData["Risk_Average Risk Score"] || 0}
          average={averageData["Risk_Average Risk Score"] || 0}
          metricName="Risk_Average Risk Score"
          icon={<Award className="h-5 w-5" />}
          positive={reportData["Risk_Average Risk Score"] < averageData["Risk_Average Risk Score"]}
        />
        
        <MetricCard 
          title="ER Visits"
          value={reportData["Util_Emergency Visits per 1k Members"] || 0}
          average={averageData["Util_Emergency Visits per 1k Members"] || 0}
          metricName="Util_Emergency Visits per 1k Members"
          icon={<Award className="h-5 w-5" />}
          positive={reportData["Util_Emergency Visits per 1k Members"] < averageData["Util_Emergency Visits per 1k Members"]}
        />
        
        <MetricCard 
          title="Specialist Visits"
          value={reportData["Util_Specialist Visits per 1k Members"] || 0}
          average={averageData["Util_Specialist Visits per 1k Members"] || 0}
          metricName="Util_Specialist Visits per 1k Members"
          icon={<Award className="h-5 w-5" />}
          positive={reportData["Util_Specialist Visits per 1k Members"] < averageData["Util_Specialist Visits per 1k Members"]}
        />
      </div>

      {/* What You'll Discover Section */}
      <Card className="mt-8">
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4">What You'll Discover in This Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                  <span className="block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                </div>
                <span>Detailed analysis of your population's health risk factors</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                  <span className="block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                </div>
                <span>Cost and utilization patterns compared to similar organizations</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                  <span className="block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                </div>
                <span>Disease prevalence insights specific to your employee population</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                  <span className="block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                </div>
                <span>Care gap opportunities for improving health outcomes</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                  <span className="block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                </div>
                <span>Social determinants affecting your members' healthcare</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                  <span className="block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                </div>
                <span>Strategic recommendations tailored to your specific challenges</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button size="lg" className="gap-2">
              Start Exploring
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportIntroduction;
