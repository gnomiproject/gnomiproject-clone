
import React from 'react';
import { Section } from '@/components/shared/Section';
import GnomeImage from '@/components/common/GnomeImage';

interface ReportDebugInfoProps {
  archetypeId: string;
  archetypeName: string;
  familyName: string;
  familyId?: string;
  swotAnalysis?: any;
  strengths?: any;
  weaknesses?: any;
  userData?: any;
}

const ReportDebugInfo: React.FC<ReportDebugInfoProps> = ({
  archetypeId,
  archetypeName,
  familyName,
  familyId,
  swotAnalysis,
  strengths,
  weaknesses,
  userData
}) => {
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
          <p>Has SWOT Analysis Field: {swotAnalysis ? 'Yes' : 'No'}</p>
          <p>SWOT Analysis Type: {swotAnalysis ? typeof swotAnalysis : 'None'}</p>
          <p>Has Individual SWOT Fields: {(strengths || weaknesses) ? 'Yes' : 'No'}</p>
          <p>User: {userData?.name || 'Not available'}</p>
          <p>Organization: {userData?.organization || 'Not available'}</p>
          <p>Access Token: {userData?.access_token ? `${userData.access_token.substring(0, 5)}...` : 'Not available'}</p>
          <p>Last Accessed: {userData?.last_accessed ? new Date(userData.last_accessed).toLocaleString() : 'Never'}</p>
        </div>
        <div className="mt-4 flex justify-center">
          <GnomeImage type="clipboard" showDebug={true} />
        </div>
      </details>
    </Section>
  );
};

export default ReportDebugInfo;
