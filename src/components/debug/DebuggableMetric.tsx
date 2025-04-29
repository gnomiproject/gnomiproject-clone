
import React from 'react';
import DataSourceInfo from './DataSourceInfo';

interface DebuggableMetricProps {
  tableName: string;
  columnName: string;
  rawValue: any;
  formattedValue: React.ReactNode;
  transformation?: string;
  showRawValues?: boolean;
  className?: string;
}

const DebuggableMetric: React.FC<DebuggableMetricProps> = ({
  tableName,
  columnName,
  rawValue,
  formattedValue,
  transformation,
  showRawValues = false,
  className
}) => {
  return (
    <div className={className}>
      <DataSourceInfo
        tableName={tableName}
        columnName={columnName}
        rawValue={rawValue}
        formattedValue={formattedValue}
        transformation={transformation}
        showRawValues={showRawValues}
      />
    </div>
  );
};

export default DebuggableMetric;
