
import React from 'react';
import { useParams } from 'react-router-dom';
import { useReportUserData } from '@/hooks/useReportUserData';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { JSONTree } from 'react-json-tree';

const ReportUserDataTest = () => {
  const { archetypeId = '', token = '' } = useParams();
  const { userData, isLoading, isValid, error } = useReportUserData(token, archetypeId);

  if (isLoading) {
    return (
      <Card className="p-6 m-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          <span className="ml-2">Loading user data...</span>
        </div>
      </Card>
    );
  }

  if (error || !isValid) {
    return (
      <Card className="p-6 m-4 border-red-200 bg-red-50">
        <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading User Data</h2>
        <p className="text-red-600">{error?.message || 'Invalid or expired access token'}</p>
      </Card>
    );
  }

  if (!userData) {
    return (
      <Card className="p-6 m-4 border-yellow-200 bg-yellow-50">
        <h2 className="text-xl font-semibold text-yellow-700">No User Data Found</h2>
        <p className="text-yellow-600">Could not find user data for this report.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 m-4">
      <h2 className="text-2xl font-bold mb-6">Report User Data Test</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">User Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="font-medium">{userData.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Organization</p>
            <p className="font-medium">{userData.organization || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-medium">{userData.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Employee Count</p>
            <p className="font-medium">{userData.exact_employee_count || 'N/A'}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Report Access Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Report Created</p>
            <p className="font-medium">
              {userData.created_at ? format(new Date(userData.created_at), 'PPP') : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Access Count</p>
            <p className="font-medium">{userData.access_count || 0}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Last Accessed</p>
            <p className="font-medium">
              {userData.last_accessed ? format(new Date(userData.last_accessed), 'PPP p') : 'First view'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Expires</p>
            <p className="font-medium">
              {userData.expires_at ? format(new Date(userData.expires_at), 'PPP') : 'Never'}
            </p>
          </div>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Assessment Result</h3>
        {userData.assessment_result ? (
          <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
            <pre className="text-xs">
              {JSON.stringify(userData.assessment_result, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-gray-500">No assessment result data available</p>
        )}
      </div>
    </Card>
  );
};

export default ReportUserDataTest;
