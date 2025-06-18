
import React from 'react';
import { Section } from '@/components/shared/Section';
import WebsiteImage from '@/components/common/WebsiteImage';

interface ReportDebugInfoProps {
  reportData?: any;
  userData?: any;
  averageData?: any;
  debugInfo?: any;
}

const ReportDebugInfo: React.FC<ReportDebugInfoProps> = ({
  reportData,
  userData,
  averageData,
  debugInfo
}) => {
  // Extract data from reportData if available
  const archetypeId = reportData?.id || reportData?.archetype_id || 'Unknown';
  const archetypeName = reportData?.name || reportData?.archetype_name || 'Unknown';
  const familyName = reportData?.family_name || 'Unknown';
  const familyId = reportData?.family_id;

  return (
    <Section id="debug-info" className="print:hidden">
      <details className="mt-4 bg-gray-50 p-4 rounded-lg text-sm">
        <summary className="font-medium cursor-pointer">Debug Information</summary>
        <div className="mt-2 font-mono text-xs space-y-1">
          <p>Data Source: level4_report_secure</p>
          <p>Archetype ID: {archetypeId}</p>
          <p>Archetype Name: {archetypeName}</p>
          <p>Family ID: {familyId || 'Not available'}</p>
          <p>Family Name: {familyName}</p>
          <p>Has Report Data: {reportData ? 'Yes' : 'No'}</p>
          <p>Has Average Data: {averageData ? 'Yes' : 'No'}</p>
          <p>User: {userData?.name || 'Not available'}</p>
          <p>Organization: {userData?.organization || 'Not available'}</p>
          <p>Access Token: {userData?.access_token ? `${userData.access_token.substring(0, 5)}...` : 'Not available'}</p>
          <p>Last Accessed: {userData?.last_accessed ? new Date(userData.last_accessed).toLocaleString() : 'Never'}</p>
          {debugInfo && (
            <>
              <p>Debug Info Type: {typeof debugInfo}</p>
              <p>Debug Info Keys: {debugInfo && typeof debugInfo === 'object' ? Object.keys(debugInfo).join(', ') : 'N/A'}</p>
            </>
          )}
        </div>
        <div className="mt-4 flex justify-center">
          <WebsiteImage type="clipboard" altText="Debug information gnome" className="h-24 w-24" />
        </div>
      </details>
    </Section>
  );
};

export default ReportDebugInfo;
