
import React from 'react';

interface DataSourceInfoProps {
  tableName: string;
  columnName: string;
  rawValue: any;
  formattedValue: any;
  transformation?: string;
  showRawValues?: boolean;
}

const DataSourceInfo: React.FC<DataSourceInfoProps> = ({
  tableName,
  columnName,
  rawValue,
  formattedValue,
  transformation,
  showRawValues = false
}) => {
  return (
    <span className="relative group">
      <span className="cursor-help border-b border-dashed border-blue-400">
        {showRawValues ? rawValue : formattedValue}
      </span>
      <span className="absolute z-50 hidden group-hover:flex flex-col bg-gray-900 text-white text-xs p-2 rounded shadow-lg w-64 bottom-full mb-1 left-0">
        <div className="flex justify-between">
          <span className="font-semibold">Table:</span> 
          <span className="text-green-400">{tableName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Column:</span> 
          <span className="text-yellow-400">{columnName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Raw value:</span> 
          <span className="text-orange-400">{JSON.stringify(rawValue)}</span>
        </div>
        {transformation && (
          <div className="flex justify-between">
            <span className="font-semibold">Transform:</span> 
            <span className="text-blue-400">{transformation}</span>
          </div>
        )}
      </span>
    </span>
  );
};

export default DataSourceInfo;
