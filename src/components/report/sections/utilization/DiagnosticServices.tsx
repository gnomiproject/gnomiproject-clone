
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from 'lucide-react';
import { formatNumber } from '@/utils/formatters';
import { calculatePercentageDifferenceSync } from '@/utils/reports/metricUtils';

interface DiagnosticServicesProps {
  reportData: any;
  averageData: any;
}

const DiagnosticServices = ({
  reportData,
  averageData
}: DiagnosticServicesProps) => {
  // Safety check for data
  if (!reportData || !averageData) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <p className="text-gray-500">No diagnostic services data available.</p>
        </CardContent>
      </Card>
    );
  }

  const labServices = reportData["Util_Lab Services per 1k Members"] || 0;
  const avgLabServices = averageData["Util_Lab Services per 1k Members"] || 0;
  const labDiff = calculatePercentageDifferenceSync(labServices, avgLabServices);
  const labClass = labDiff > 10 ? "text-amber-600" : (labDiff < -10 ? "text-green-600" : "text-gray-600");

  const radiologyServices = reportData["Util_Radiology Services per 1k Members"] || 0;
  const avgRadiologyServices = averageData["Util_Radiology Services per 1k Members"] || 0;
  const radiologyDiff = calculatePercentageDifferenceSync(radiologyServices, avgRadiologyServices);
  const radiologyClass = radiologyDiff > 10 ? "text-amber-600" : (radiologyDiff < -10 ? "text-green-600" : "text-gray-600");

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Search className="mr-2 h-5 w-5 text-blue-600" />
          Diagnostic Services Utilization
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-gray-600 mb-6">
          Analysis of laboratory and radiology service utilization compared to the archetype average.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lab Services */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">Lab Services</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold">{formatNumber(labServices, 'number', 0)}</span>
              <span className="text-gray-500">per 1,000 members</span>
            </div>
            <div className={labClass}>
              {Math.abs(labDiff).toFixed(1)}% {labDiff > 0 ? 'higher' : 'lower'} than average
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>
                Laboratory tests are essential diagnostic tools used to assess patient health status, diagnose conditions, and monitor treatment effectiveness.
              </p>
            </div>
          </div>

          {/* Radiology Services */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">Radiology Services</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold">{formatNumber(radiologyServices, 'number', 0)}</span>
              <span className="text-gray-500">per 1,000 members</span>
            </div>
            <div className={radiologyClass}>
              {Math.abs(radiologyDiff).toFixed(1)}% {radiologyDiff > 0 ? 'higher' : 'lower'} than average
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>
                Radiology services include various imaging techniques such as X-rays, MRIs, CT scans, and ultrasounds used for diagnosis and treatment planning.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg text-sm">
          <h4 className="font-medium mb-2">Diagnostic Service Considerations</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Higher diagnostic service utilization may indicate a population with more complex health needs or better access to preventive care.</li>
            <li>Lower utilization could suggest access barriers, underdiagnosis of conditions, or a healthier population.</li>
            <li>Consider service mix and appropriateness alongside raw utilization numbers.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosticServices;
