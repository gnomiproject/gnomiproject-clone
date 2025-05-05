import React, { useState } from 'react';
import { useReportUserData } from '@/hooks/useReportUserData';
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Clipboard, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const ReportUserDataTest = () => {
  const { token, archetypeId } = useParams<{ token: string; archetypeId: string }>();
  const { userData, isLoading, error, isValid } = useReportUserData(token, archetypeId);
  const [showRawData, setShowRawData] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Loading User Data...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !isValid) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading User Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error?.message || "Invalid or expired access token"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle possible nulls for assessment data - safely access nested properties
  const assessmentResult = userData?.assessment_result || {};
  
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Report User Data Test</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRawData(!showRawData)}
          >
            {showRawData ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide Raw Data
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Show Raw Data
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">User Information</h3>
              <div className="space-y-2">
                <InfoItem label="Name" value={userData?.name || 'N/A'} />
                <InfoItem label="Organization" value={userData?.organization || 'N/A'} />
                <InfoItem label="Email" value={userData?.email || 'N/A'} />
                <InfoItem 
                  label="Created At" 
                  value={userData?.created_at ? new Date(userData.created_at).toLocaleString() : 'N/A'} 
                />
                <InfoItem label="Access Count" value={String(userData?.access_count || '0')} />
                <InfoItem
                  label="Last Accessed"
                  value={userData?.last_accessed ? new Date(userData.last_accessed).toLocaleString() : 'N/A'}
                />
                {userData?.expires_at && (
                  <InfoItem
                    label="Expires At"
                    value={new Date(userData.expires_at).toLocaleString()}
                    highlight={new Date(userData.expires_at) < new Date()}
                  />
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assessment Results</h3>
              <div className="space-y-2">
                <InfoItem 
                  label="Archetype ID" 
                  value={userData?.archetype_id || 'N/A'} 
                  badge 
                />
                {assessmentResult && typeof assessmentResult === 'object' && 'primaryArchetype' in assessmentResult && (
                  <InfoItem 
                    label="Primary Archetype" 
                    value={String(assessmentResult.primaryArchetype)} 
                    badge 
                  />
                )}
                {assessmentResult && typeof assessmentResult === 'object' && 'percentageMatch' in assessmentResult && (
                  <InfoItem 
                    label="Match Percentage" 
                    value={`${assessmentResult.percentageMatch}%`}
                  />
                )}
                {assessmentResult && typeof assessmentResult === 'object' && 'secondaryArchetype' in assessmentResult && (
                  <InfoItem 
                    label="Secondary Archetype" 
                    value={String(assessmentResult.secondaryArchetype)}
                    badge
                  />
                )}
                {assessmentResult && typeof assessmentResult === 'object' && 'tertiaryArchetype' in assessmentResult && (
                  <InfoItem 
                    label="Tertiary Archetype" 
                    value={String(assessmentResult.tertiaryArchetype)}
                    badge
                  />
                )}
                {assessmentResult && typeof assessmentResult === 'object' && 'resultTier' in assessmentResult && (
                  <InfoItem
                    label="Result Tier"
                    value={String(assessmentResult.resultTier)}
                  />
                )}
                <InfoItem
                  label="Exact Employee Count"
                  value={userData?.exact_employee_count?.toString() || 'N/A'}
                />
              </div>
            </div>
          </div>
          
          {userData && 'access_url' in userData && userData.access_url && (
            <div className="p-4 bg-muted rounded-md">
              <div className="flex flex-col space-y-2">
                <h3 className="text-md font-medium">Report Access URL</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={userData.access_url}
                    className="flex-1 p-2 text-sm bg-background border rounded"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(userData.access_url as string)}
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                  >
                    <a href={userData.access_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {showRawData && (
            <div>
              <h3 className="text-lg font-semibold my-4">Raw Data</h3>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96 text-xs">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
  badge?: boolean;
  highlight?: boolean;
}

const InfoItem = ({ label, value, badge = false, highlight = false }: InfoItemProps) => (
  <div className="flex flex-col">
    <span className="text-sm text-muted-foreground">{label}</span>
    {badge ? (
      <Badge variant="outline" className="w-fit mt-1">
        {value}
      </Badge>
    ) : (
      <span className={`font-medium ${highlight ? 'text-destructive' : ''}`}>{value}</span>
    )}
  </div>
);

export default ReportUserDataTest;
