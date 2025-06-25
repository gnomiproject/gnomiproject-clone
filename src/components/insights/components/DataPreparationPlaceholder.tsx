
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DataPreparationPlaceholderProps {
  dataType: string;
}

const DataPreparationPlaceholder: React.FC<DataPreparationPlaceholderProps> = ({ dataType }) => (
  <div className="py-12 text-center">
    <Badge variant="outline" className="mb-2 bg-yellow-50 text-yellow-800 hover:bg-yellow-100">
      Data Availability
    </Badge>
    <h3 className="text-xl font-medium text-gray-800">{dataType} data is being prepared</h3>
    <p className="text-gray-600 mt-2 max-w-md mx-auto">
      Your {dataType.toLowerCase()} data is being processed and will be available soon. Please check back later.
    </p>
  </div>
);

export default DataPreparationPlaceholder;
