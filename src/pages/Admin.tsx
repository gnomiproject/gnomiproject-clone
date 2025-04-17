
import React from 'react';
import DataMigrationTool from '@/components/admin/DataMigrationTool';
import ReportGenerator from '@/components/admin/ReportGenerator';
import DirectReportLinks from '@/components/admin/DirectReportLinks';
import SectionTitle from '@/components/shared/SectionTitle';

const Admin = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <SectionTitle 
        title="Admin Dashboard" 
        subtitle="Tools for system administration and data management" 
        center
      />
      
      <div className="max-w-5xl mx-auto mt-8 space-y-10">
        {/* Direct Report Links */}
        <DirectReportLinks />
        
        {/* Report Generator */}
        <ReportGenerator />
        
        {/* Data Migration Tool */}
        <DataMigrationTool />
      </div>
    </div>
  );
};

export default Admin;
