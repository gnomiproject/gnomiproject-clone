import React from 'react';
import { Users, Building, Map, User, Calendar, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from '@/utils/formatters';

// Import BarChart from recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DemographicsSectionProps {
  reportData: any;
  averageData: any;
}

const DemographicsSection = ({ reportData, averageData }: DemographicsSectionProps) => {
  // Generate comparison data for charts
  const demographicComparisonData = generateDemographicComparisonData(reportData, averageData);
  
  // Get demographic insights text
  const demographicInsights = reportData.demographic_insights || 
    "No specific demographic insights available for this archetype.";
  
  // Gnome image
  const gnomeImage = '/assets/gnomes/gnome_clipboard.png';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-6">Demographics</h1>
          
          <p className="text-lg mb-6">
            Understanding your workforce demographics is essential for tailoring benefits and 
            wellness programs. Here's how your organization's demographic profile compares to 
            the {reportData.archetype_name} archetype average.
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DemographicCard 
          title="Employees"
          value={formatNumber(reportData["Demo_Average Employees"] || 0, 'number', 0)}
          comparison={formatComparison(reportData["Demo_Average Employees"], averageData["Demo_Average Employees"])}
          icon={<Users className="h-5 w-5" />}
        />
        
        <DemographicCard 
          title="Members"
          value={formatNumber(reportData["Demo_Average Members"] || 0, 'number', 0)}
          comparison={formatComparison(reportData["Demo_Average Members"], averageData["Demo_Average Members"])}
          icon={<User className="h-5 w-5" />}
        />
        
        <DemographicCard 
          title="Average Family Size"
          value={formatNumber(reportData["Demo_Average Family Size"] || 0, 'number', 1)}
          comparison={formatComparison(reportData["Demo_Average Family Size"], averageData["Demo_Average Family Size"])}
          icon={<Users className="h-5 w-5" />}
        />
        
        <DemographicCard 
          title="Average Age"
          value={formatNumber(reportData["Demo_Average Age"] || 0, 'number', 1)}
          suffix="years"
          comparison={formatComparison(reportData["Demo_Average Age"], averageData["Demo_Average Age"])}
          icon={<Calendar className="h-5 w-5" />}
        />
        
        <DemographicCard 
          title="Female Population"
          value={formatNumber(reportData["Demo_Average Percent Female"] || 0, 'percent')}
          comparison={formatComparison(reportData["Demo_Average Percent Female"], averageData["Demo_Average Percent Female"])}
          icon={<User className="h-5 w-5" />}
        />
        
        <DemographicCard 
          title="Average Salary"
          value={formatNumber(reportData["Demo_Average Salary"] || 0, 'currency', 0)}
          comparison={formatComparison(reportData["Demo_Average Salary"], averageData["Demo_Average Salary"])}
          icon={<CreditCard className="h-5 w-5" />}
        />
      </div>

      {/* Demographic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users className="mr-2 h-5 w-5 text-blue-600" />
              Workforce Composition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={demographicComparisonData.filter(d => 
                    ["Employees", "Members", "Female Population"].includes(d.name)
                  )}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatNumber(value as number, 'number', 0)} />
                  <Legend />
                  <Bar dataKey="Your Value" fill="#3b82f6" />
                  <Bar dataKey="Archetype Average" fill="#94a3b8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Map className="mr-2 h-5 w-5 text-blue-600" />
              Geographic & Age Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={demographicComparisonData.filter(d => 
                    ["States", "Average Age", "Average Family Size"].includes(d.name)
                  )}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatNumber(value as number, 'number', 1)} />
                  <Legend />
                  <Bar dataKey="Your Value" fill="#3b82f6" />
                  <Bar dataKey="Archetype Average" fill="#94a3b8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demographic Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Building className="mr-2 h-5 w-5 text-blue-600" />
            Key Demographic Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p>{demographicInsights}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Reusable demographic card component
const DemographicCard = ({ 
  title, 
  value, 
  suffix = '', 
  comparison, 
  icon 
}: { 
  title: string; 
  value: string; 
  suffix?: string; 
  comparison: string; 
  icon: React.ReactNode 
}) => {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center mb-2">
        <div className="bg-blue-100 p-2 rounded-lg mr-3">
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold">
          {value} {suffix && <span className="text-sm font-normal">{suffix}</span>}
        </div>
        <p className="text-sm text-gray-600 mt-1">{comparison}</p>
      </div>
    </div>
  );
};

// Format comparison text
const formatComparison = (value: number, benchmark: number): string => {
  if (!value || !benchmark) return 'No comparison data';
  
  const diff = value - benchmark;
  const percentDiff = (diff / benchmark) * 100;
  
  if (Math.abs(percentDiff) < 1) return 'On par with archetype average';
  
  // Format the benchmark/average value
  const formattedAverage = benchmark.toLocaleString();
  
  return `${percentDiff > 0 ? '+' : ''}${percentDiff.toFixed(1)}% vs. archetype average (${formattedAverage})`;
};

// Generate data for comparison charts
const generateDemographicComparisonData = (reportData: any, averageData: any) => {
  return [
    {
      name: 'Employees',
      'Your Value': reportData["Demo_Average Employees"] || 0,
      'Archetype Average': averageData["Demo_Average Employees"] || 0
    },
    {
      name: 'Members',
      'Your Value': reportData["Demo_Average Members"] || 0,
      'Archetype Average': averageData["Demo_Average Members"] || 0
    },
    {
      name: 'Female Population',
      'Your Value': (reportData["Demo_Average Percent Female"] || 0) * 100,
      'Archetype Average': (averageData["Demo_Average Percent Female"] || 0) * 100
    },
    {
      name: 'States',
      'Your Value': reportData["Demo_Average States"] || 0,
      'Archetype Average': averageData["Demo_Average States"] || 0
    },
    {
      name: 'Average Age',
      'Your Value': reportData["Demo_Average Age"] || 0,
      'Archetype Average': averageData["Demo_Average Age"] || 0
    },
    {
      name: 'Average Family Size',
      'Your Value': reportData["Demo_Average Family Size"] || 0,
      'Archetype Average': averageData["Demo_Average Family Size"] || 0
    }
  ];
};

export default DemographicsSection;
