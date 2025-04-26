
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { DatabaseIcon } from "lucide-react";

const DeepDiveReportsAccess: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Deep Dive Reports</h2>
        <p className="text-gray-600">
          Access and manage detailed archetype deep dive reports.
        </p>
      </div>
      
      <Alert>
        <DatabaseIcon className="h-4 w-4" />
        <AlertTitle>Coming Soon</AlertTitle>
        <AlertDescription>
          Deep dive reports functionality is under development and will be available soon.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DeepDiveReportsAccess;
