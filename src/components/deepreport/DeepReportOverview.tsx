
import React from 'react';
import { DeepReportData } from '@/pages/ArchetypeDeepReport';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getArchetypeColorHex } from '@/data/colors';
import { LineChart, Users, BuildingIcon, BarChart4, CircleAlert } from 'lucide-react';

interface DeepReportOverviewProps {
  reportData: DeepReportData;
}

const DeepReportOverview: React.FC<DeepReportOverviewProps> = ({ reportData }) => {
  const { archetypeData, familyData, deepDiveReport } = reportData;
  
  if (!archetypeData) {
    return <div>Loading archetype data...</div>;
  }
  
  const archetypeColor = getArchetypeColorHex(archetypeData.id);
  
  // Extract industries information if available
  const industries = deepDiveReport?.data_details?.Industries || 
    "Information, Professional, Scientific, and Technical Services";
  
  return (
    <div className="mb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Archetype Overview</h1>
        <div 
          className="h-1 w-24 rounded-full mb-6"
          style={{ backgroundColor: archetypeColor }}
        ></div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-8 mb-12">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-6">
              Archetype {archetypeData.id.toUpperCase()}: "{archetypeData.name}"
            </h2>
            
            {familyData && (
              <div className="mb-6">
                <Badge 
                  className="text-white px-3 py-1 text-sm font-semibold" 
                  style={{ backgroundColor: familyData.hexColor }}
                >
                  {familyData.name} Family
                </Badge>
              </div>
            )}
            
            <div className="prose max-w-none text-gray-700">
              {deepDiveReport?.summary_analysis ? (
                <p className="text-lg whitespace-pre-line">{deepDiveReport.summary_analysis}</p>
              ) : archetypeData.standard?.fullDescription ? (
                <p className="text-lg">{archetypeData.standard.fullDescription}</p>
              ) : (
                <p className="text-lg">
                  {archetypeData.name} represents a distinctive healthcare archetype with unique 
                  utilization patterns, cost drivers, and strategic opportunities. Understanding these 
                  characteristics allows for more targeted healthcare strategies and interventions.
                </p>
              )}
            </div>
          </div>
          
          <div className="md:w-1/3">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BuildingIcon className="h-5 w-5 text-gray-500" />
                  Industries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-700">
                  <p>{industries}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Key characteristics */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6">Key Characteristics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {archetypeData.standard?.keyCharacteristics ? (
              archetypeData.standard.keyCharacteristics.map((char: string, index: number) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div 
                    className="h-1 w-8 mb-3 rounded-full"
                    style={{ backgroundColor: archetypeColor }}  
                  ></div>
                  <p className="text-gray-700">{char}</p>
                </div>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                <CircleAlert className="h-8 w-8 text-amber-500 mb-4" />
                <p className="text-gray-500 text-center">No key characteristics available for this archetype</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-blue-600" />
              Distinctive Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {deepDiveReport?.distinctive_metrics_summary ? (
              <p className="text-gray-700">{deepDiveReport.distinctive_metrics_summary}</p>
            ) : (
              <div className="flex flex-col items-center justify-center p-4">
                <CircleAlert className="h-6 w-6 text-amber-500 mb-2" />
                <p className="text-gray-500 text-center">No distinctive insights available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              Population Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            {deepDiveReport?.data_details?.Demographics ? (
              <div className="grid grid-cols-2 gap-4">
                {deepDiveReport.data_details.Demographics.slice(0, 6).map((item: any, i: number) => (
                  <div key={`demo-${i}`} className="border-b pb-2">
                    <span className="text-sm text-gray-500">{item.Metric}</span>
                    <div className="flex justify-between">
                      <span className="font-medium">{Number(item["Archetype Value"]).toFixed(2)}</span>
                      <span className={`text-sm ${item.Difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.Difference > 0 ? '+' : ''}{Number(item.Difference).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4">
                <CircleAlert className="h-6 w-6 text-amber-500 mb-2" />
                <p className="text-gray-500 text-center">No demographic data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Report Structure Preview */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-xl font-bold mb-6">In This Report</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="bg-blue-100 p-2 rounded-lg h-fit">
              <BarChart4 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Detailed Metrics Profile</h4>
              <p className="text-gray-600 text-sm">
                Precise data on costs, utilization, risk, demographics, and clinical patterns
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-green-100 p-2 rounded-lg h-fit">
              <LineChart className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Distinctive Characteristics Analysis</h4>
              <p className="text-gray-600 text-sm">
                What truly sets this archetype apart from others
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-amber-100 p-2 rounded-lg h-fit">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">SWOT Assessment</h4>
              <p className="text-gray-600 text-sm">
                Strategic evaluation of the archetype's strengths, weaknesses, opportunities, and threats
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-purple-100 p-2 rounded-lg h-fit">
              <LineChart className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Strategic Recommendations</h4>
              <p className="text-gray-600 text-sm">
                Specific strategies to optimize healthcare performance
              </p>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-gray-600 text-sm">
          The insights in this report are drawn from comprehensive analysis of hundreds of employer populations,
          representing millions of members and billions in healthcare spend. The resulting archetype framework 
          provides a more precise, meaningful way to understand your healthcare performance and opportunities 
          than traditional benchmarking approaches.
        </p>
      </div>
    </div>
  );
};

export default DeepReportOverview;
