
import React from 'react';
import { ArrowRight, ChevronDown, BarChart4, LineChart } from 'lucide-react';
import { DeepReportData } from '@/pages/ArchetypeDeepReport';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getArchetypeColorHex } from '@/data/colors';

interface DeepReportLandingProps {
  reportData: DeepReportData;
}

const DeepReportLanding: React.FC<DeepReportLandingProps> = ({ reportData }) => {
  const { archetypeData, familyData, deepDiveReport, distinctiveMetrics } = reportData;
  
  if (!archetypeData) {
    return <div>Loading archetype data...</div>;
  }
  
  const archetypeColor = getArchetypeColorHex(archetypeData.id);
  
  // Prepare key stats - either use distinctive metrics or fallback to sample data
  const keyStats = distinctiveMetrics && distinctiveMetrics.length >= 3 
    ? distinctiveMetrics.slice(0, 3) 
    : [
        { Metric: "Risk Score", "Archetype Value": 0.92, "Archetype Average": 0.96, Difference: -4.3 },
        { Metric: "Emergency Visits", "Archetype Value": 141, "Archetype Average": 170, Difference: -17.5 },
        { Metric: "Specialist Visits", "Archetype Value": 1453, "Archetype Average": 1327, Difference: 9.6 }
      ];
  
  const scrollToNextSection = () => {
    const element = document.getElementById('deep-report-scroll-target');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="mb-16">
      {/* Hero Section */}
      <div 
        className="min-h-[80vh] flex flex-col justify-center relative rounded-xl overflow-hidden mb-12"
        style={{ 
          backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="absolute inset-0" style={{ 
          background: `linear-gradient(45deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 100%)` 
        }}></div>
        
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-4xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
              <div 
                className="h-24 w-24 rounded-full flex items-center justify-center text-white font-bold text-3xl"
                style={{ backgroundColor: archetypeColor }}
              >
                {archetypeData.id.toUpperCase()}
              </div>
              
              <div>
                <div className="text-sm uppercase tracking-wider font-semibold mb-1" style={{ color: archetypeColor }}>
                  Archetype Report
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {archetypeData.name}
                </h1>
                {familyData && (
                  <div className="text-gray-600">
                    {familyData.name} Family
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mb-8">
              Understanding your organization's healthcare archetype allows for precise benchmarking, 
              targeted interventions, and strategic optimization of your healthcare investments.
            </p>
            
            {/* Curved line divider */}
            <div className="my-10 relative">
              <div 
                className="absolute left-0 h-1 rounded-full w-32"
                style={{ backgroundColor: archetypeColor }}
              ></div>
              <div className="h-px w-full bg-gray-200 mt-3"></div>
            </div>
            
            {/* Key stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {keyStats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-gray-500 mb-2">{stat.Metric}</div>
                    <div className="text-3xl font-bold mb-2">{typeof stat["Archetype Value"] === 'number' ? stat["Archetype Value"].toFixed(1) : stat["Archetype Value"]}</div>
                    <div className={`flex items-center ${Number(stat.Difference) > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      <span>{stat.Difference > 0 ? '+' : ''}{typeof stat.Difference === 'number' ? stat.Difference.toFixed(1) : stat.Difference}%</span>
                      <span className="text-gray-400 ml-2">vs. average</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* CTA button */}
            <Button 
              onClick={scrollToNextSection}
              className="rounded-full px-8 py-6 text-lg flex items-center gap-2"
              style={{ backgroundColor: archetypeColor }}
            >
              Explore the Report <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={scrollToNextSection}>
          <ChevronDown className="h-8 w-8 text-gray-400" />
        </div>
      </div>
      
      <div id="deep-report-scroll-target"></div>
      
      {/* Report Introduction */}
      <div className="bg-white rounded-xl p-8 md:p-12 shadow-md mb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">THE POWER OF HEALTHCARE ARCHETYPES</h2>
          
          <p className="text-lg text-gray-700 mb-8">
            Traditional healthcare benchmarking often relies on broad industry classifications or geographic regions, 
            failing to capture the nuanced patterns that actually drive healthcare costs and outcomes. The Healthcare 
            Employer Archetype framework transcends these limitations, identifying distinctive employer profiles based 
            on workforce characteristics, care patterns, cost drivers, and strategic opportunities.
          </p>
          
          <h3 className="text-xl font-semibold mb-4">By understanding your organization's archetype, you can:</h3>
          <ul className="list-disc pl-8 space-y-3 text-gray-700 mb-8">
            <li>Benchmark against truly comparable peers rather than dissimilar organizations</li>
            <li>Identify strategic priorities that address your specific population's needs</li>
            <li>Implement targeted interventions proven effective for your archetype</li>
            <li>Anticipate future healthcare trends based on patterns observed within your archetype</li>
          </ul>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <Card className="border-0 shadow-md bg-blue-50">
              <CardContent className="p-6">
                <LineChart className="h-8 w-8 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold mb-2">Data-Driven Insights</h3>
                <p className="text-gray-700">
                  This report is based on comprehensive analysis of hundreds of employer populations,
                  representing millions of members and billions in healthcare spend.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md bg-teal-50">
              <CardContent className="p-6">
                <BarChart4 className="h-8 w-8 mb-4 text-teal-600" />
                <h3 className="text-xl font-bold mb-2">Actionable Strategies</h3>
                <p className="text-gray-700">
                  Beyond metrics, this report provides specific, tailored recommendations 
                  designed for your archetype's unique challenges and opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12 italic text-gray-600">
            To find out more or retake your assessment, visit us at <a href="https://g.nomi.com" className="text-blue-600 underline">g.nomi.com</a>
          </div>
        </div>
      </div>
      
      {/* Section Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <LineChart className="h-6 w-6 mb-3 text-blue-600" />
            <h3 className="text-lg font-bold mb-2">Key Findings</h3>
            <p className="text-gray-600 mb-4">Discover the most significant patterns and outliers in your data.</p>
            <Button variant="outline" size="sm" className="w-full">
              View Section
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <PieChart className="h-6 w-6 mb-3 text-teal-600" />
            <h3 className="text-lg font-bold mb-2">SWOT Analysis</h3>
            <p className="text-gray-600 mb-4">Explore strengths, weaknesses, opportunities, and threats for your archetype.</p>
            <Button variant="outline" size="sm" className="w-full">
              View Section
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <List className="h-6 w-6 mb-3 text-indigo-600" />
            <h3 className="text-lg font-bold mb-2">Recommendations</h3>
            <p className="text-gray-600 mb-4">Get actionable strategies tailored to your specific archetype.</p>
            <Button variant="outline" size="sm" className="w-full">
              View Section
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeepReportLanding;
