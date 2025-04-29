
import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight, Database, Table, Code, FileJson } from 'lucide-react';

interface QueryParameter {
  name: string;
  value: string;
}

interface DataTransformation {
  field: string;
  description: string;
  formula?: string;
}

interface TableData {
  tableName: string;
  fields: string[];
  queryParams?: QueryParameter[];
  transformations?: DataTransformation[];
}

interface DataLineagePanelProps {
  isVisible: boolean;
  onClose: () => void;
  dataSources: TableData[];
  queryExecutionTime?: number;
}

const DataLineagePanel: React.FC<DataLineagePanelProps> = ({
  isVisible,
  onClose,
  dataSources,
  queryExecutionTime
}) => {
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});
  
  if (!isVisible) return null;
  
  const toggleTableExpand = (tableName: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };
  
  return (
    <div className="fixed bottom-0 right-0 w-96 bg-gray-900 text-white shadow-lg z-50 rounded-tl-lg overflow-hidden flex flex-col max-h-[80vh]">
      <div className="bg-gray-800 p-3 flex justify-between items-center">
        <div className="flex items-center">
          <Database className="w-4 h-4 mr-2" />
          <h3 className="font-medium">Data Lineage Debug</h3>
        </div>
        <div className="flex items-center">
          {queryExecutionTime && (
            <span className="text-xs text-gray-400 mr-2">{queryExecutionTime}ms</span>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="overflow-auto flex-1">
        {dataSources.map((source, index) => (
          <div key={`${source.tableName}-${index}`} className="border-b border-gray-800">
            <button 
              onClick={() => toggleTableExpand(source.tableName)}
              className="w-full text-left p-2 hover:bg-gray-800 flex items-center"
            >
              {expandedTables[source.tableName] ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}
              <Table className="w-4 h-4 mr-2 text-blue-400" />
              <span>{source.tableName}</span>
              <span className="ml-2 text-xs text-gray-400">({source.fields.length} fields)</span>
            </button>
            
            {expandedTables[source.tableName] && (
              <div className="pl-4 pb-2 text-sm">
                {source.fields.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-gray-400 mb-1 pl-2">Fields</div>
                    <div className="bg-gray-800 rounded p-1">
                      {source.fields.map(field => (
                        <div key={field} className="px-2 py-1 hover:bg-gray-700 rounded flex items-center">
                          <FileJson className="w-3 h-3 mr-2 text-yellow-400" />
                          {field}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {source.queryParams && source.queryParams.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-gray-400 mb-1 pl-2">Query Parameters</div>
                    <div className="bg-gray-800 rounded p-1">
                      {source.queryParams.map((param, idx) => (
                        <div key={idx} className="px-2 py-1 hover:bg-gray-700 rounded flex justify-between">
                          <span className="text-green-400">{param.name}</span>
                          <span className="text-blue-300">{param.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {source.transformations && source.transformations.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-400 mb-1 pl-2">Transformations</div>
                    <div className="bg-gray-800 rounded p-1">
                      {source.transformations.map((transform, idx) => (
                        <div key={idx} className="px-2 py-1 hover:bg-gray-700 rounded">
                          <div className="flex justify-between">
                            <span className="text-purple-400">{transform.field}</span>
                            <Code className="w-3 h-3 text-orange-400" />
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{transform.description}</div>
                          {transform.formula && (
                            <div className="font-mono text-xs bg-gray-900 p-1 mt-1 rounded text-green-300">
                              {transform.formula}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataLineagePanel;
