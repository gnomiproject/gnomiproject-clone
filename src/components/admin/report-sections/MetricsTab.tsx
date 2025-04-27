
import React from 'react';

interface MetricsTabProps {
  report: any;
}

export const MetricsTab = ({ report }: MetricsTabProps) => {
  if (!report?.detailed_metrics) return <p>No detailed metrics available</p>;
  
  return (
    <div className="space-y-6">
      {Object.entries(report.detailed_metrics).map(([category, metrics]: [string, any]) => (
        <div key={category} className="border rounded-lg p-4">
          <h4 className="text-lg font-medium mb-3 capitalize">{category} Metrics</h4>
          <div className="space-y-4">
            {Object.entries(metrics).map(([metricName, metricData]: [string, any]) => (
              <div key={metricName} className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between">
                  <span className="font-medium">{metricName}</span>
                  <span className="font-bold">{metricData.value}</span>
                </div>
                {metricData.average && (
                  <div className="text-sm flex justify-between mt-1">
                    <span className="text-gray-500">Average: {metricData.average}</span>
                    <span className={metricData.percentDifference > 0 ? "text-green-600" : "text-amber-600"}>
                      {metricData.formattedDifference}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
