
import React from 'react';

interface UtilizationTabProps {
  report: any;
}

export const UtilizationTab = ({ report }: UtilizationTabProps) => {
  if (!report) return <p>No utilization data available</p>;
  
  // Extract utilization metrics if they exist
  const utilizationMetrics = report.detailed_metrics?.utilization || {};
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Utilization Overview</h3>
        <p className="text-gray-700">
          {report.utilization_insights || 'No utilization insights available'}
        </p>
      </div>
      
      {Object.keys(utilizationMetrics).length > 0 ? (
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-medium mb-3">Utilization Metrics</h4>
          <div className="space-y-4">
            {Object.entries(utilizationMetrics).map(([metricName, metricData]: [string, any]) => (
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
      ) : (
        <div className="border rounded-lg p-4 text-center">
          <p className="text-gray-500 italic">No utilization metrics available</p>
        </div>
      )}
      
      {/* Conditional rendering of utilization patterns if available */}
      {report.utilization_patterns && (
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-medium mb-3">Utilization Patterns</h4>
          <div className="space-y-2">
            {Array.isArray(report.utilization_patterns) ? (
              report.utilization_patterns.map((pattern: string, idx: number) => (
                <div key={idx} className="bg-gray-50 p-3 rounded">
                  <p>{pattern}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No utilization patterns available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
