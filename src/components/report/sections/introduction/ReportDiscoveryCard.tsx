
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, BarChart3, TrendingUp } from 'lucide-react';

const ReportDiscoveryCard = () => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5 text-blue-600" />
          Discover Your Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Deep Analytics</h4>
              <p className="text-sm text-gray-600">Comprehensive metrics and insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Strategic Guidance</h4>
              <p className="text-sm text-gray-600">Actionable recommendations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Search className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Archetype Benchmarks</h4>
              <p className="text-sm text-gray-600">Compare against archetype averages</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            This report provides insights based on the healthcare archetype that most closely matches your organization. 
            The analysis includes benchmarking against archetype patterns and strategic recommendations 
            for optimization and cost savings based on similar organizations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportDiscoveryCard;
