
import React from 'react';
import DataMigrationTool from '@/components/admin/DataMigrationTool';

const Admin = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Tools</h1>
      <DataMigrationTool />
    </div>
  );
};

export default Admin;
