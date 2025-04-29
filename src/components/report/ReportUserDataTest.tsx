
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReportUserData } from '@/hooks/useReportUserData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ReportUserDataTest = () => {
  const { archetypeId = '', token = '' } = useParams();
  const { userData, isLoading, isValid, error } = useReportUserData(token, archetypeId);
  const [showRawData, setShowRawData] = useState(false);

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

  // Extract assessment result data if available
  const assessmentResult = userData.assessment_result;
  const primaryArchetype = assessmentResult?.primaryArchetype || {
    id: archetypeId,
    name: 'Unknown',
    matchPercentage: 0
  };
  
  const secondaryArchetype = assessmentResult?.secondaryArchetype || {
    id: '',
    name: 'None',
    matchPercentage: 0
  };

  return (
    <Card className="p-6 m-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Report User Data Test</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowRawData(!showRawData)}
            className="flex items-center gap-1"
          >
            {showRawData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showRawData ? 'Hide Raw Data' : 'Show Raw Data'}
          </Button>
        </div>
        <CardDescription>
          Showing data for token: <code className="bg-gray-100 px-1 rounded">{token}</code>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
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
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Archetype Match</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Primary Archetype</p>
              <div className="flex items-center gap-2">
                <p className="font-medium">{primaryArchetype.name || archetypeId}</p>
                {primaryArchetype.matchPercentage > 0 && (
                  <Badge variant="secondary">{primaryArchetype.matchPercentage}% Match</Badge>
                )}
              </div>
            </div>
            {secondaryArchetype.id && (
              <div>
                <p className="text-gray-500 text-sm">Secondary Archetype</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{secondaryArchetype.name}</p>
                  {secondaryArchetype.matchPercentage > 0 && (
                    <Badge variant="secondary">{secondaryArchetype.matchPercentage}% Match</Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div>
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
        
        {showRawData && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Raw Data</h3>
            <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-xs">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          </div>
        )}
        
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
      </CardContent>
    </Card>
  );
};

export default ReportUserDataTest;
