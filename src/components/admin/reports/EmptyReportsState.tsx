
import React from 'react';
import { DatabaseIcon } from "lucide-react";

const EmptyReportsState = () => {
  return (
    <div className="text-center py-8 bg-gray-50 rounded-md">
      <DatabaseIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
      <h3 className="text-lg font-medium text-gray-900">No reports generated yet</h3>
      <p className="mt-1 text-sm text-gray-500">
        Generate a report for any archetype by clicking one of the buttons above.
      </p>
    </div>
  );
};

export default EmptyReportsState;
