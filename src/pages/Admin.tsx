
import React from 'react';
import { Card } from '@/components/ui/card';
import AdminReportsPanel from '@/components/admin/reports/AdminReportsPanel';

const Admin = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <AdminReportsPanel />
    </div>
  );
};

export default Admin;
