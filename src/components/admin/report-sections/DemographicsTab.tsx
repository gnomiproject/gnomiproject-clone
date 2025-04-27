
import React from 'react';

interface DemographicsTabProps {
  report: any;
}

export const DemographicsTab = ({ report }: DemographicsTabProps) => {
  if (!report?.demographics) return <p>No demographics data available</p>;
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Demographics Overview</h3>
        <p className="text-gray-700">
          {report.demographic_insights || 'No demographic insights available'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Age Distribution */}
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-medium mb-3">Age Distribution</h4>
          <div className="space-y-2">
            {report["Demo_Average Age"] && (
              <div className="flex justify-between">
                <span>Average Age</span>
                <span className="font-bold">{report["Demo_Average Age"]}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Gender Distribution */}
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-medium mb-3">Gender Distribution</h4>
          <div className="space-y-2">
            {report["Demo_Average Percent Female"] && (
              <div className="flex justify-between">
                <span>Female</span>
                <span className="font-bold">{(report["Demo_Average Percent Female"] * 100).toFixed(1)}%</span>
              </div>
            )}
            {report["Demo_Average Percent Female"] && (
              <div className="flex justify-between">
                <span>Male</span>
                <span className="font-bold">{((1 - report["Demo_Average Percent Female"]) * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Family Size */}
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-medium mb-3">Household Information</h4>
          <div className="space-y-2">
            {report["Demo_Average Family Size"] && (
              <div className="flex justify-between">
                <span>Average Family Size</span>
                <span className="font-bold">{report["Demo_Average Family Size"]}</span>
              </div>
            )}
            {report["Demo_Average Members"] && (
              <div className="flex justify-between">
                <span>Average Members</span>
                <span className="font-bold">{report["Demo_Average Members"]}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Employment Information */}
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-medium mb-3">Employment Information</h4>
          <div className="space-y-2">
            {report["Demo_Average Employees"] && (
              <div className="flex justify-between">
                <span>Average Employees</span>
                <span className="font-bold">{report["Demo_Average Employees"]}</span>
              </div>
            )}
            {report["Demo_Average Salary"] && (
              <div className="flex justify-between">
                <span>Average Salary</span>
                <span className="font-bold">${report["Demo_Average Salary"].toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
