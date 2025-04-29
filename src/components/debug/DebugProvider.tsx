
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDebugMode } from '@/hooks/useDebugMode';
import DataLineagePanel from './DataLineagePanel';

interface TableData {
  tableName: string;
  fields: string[];
  queryParams?: { name: string; value: string }[];
  transformations?: { field: string; description: string; formula?: string }[];
}

interface DebugContextType {
  showDataSource: boolean;
  showRawValues: boolean;
  showQueryParams: boolean;
  addDataSource: (source: TableData) => void;
  trackQueryTime: (tableName: string, time: number) => void;
  resetDataSources: () => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error("useDebug must be used within a DebugProvider");
  }
  return context;
};

interface DebugProviderProps {
  children: React.ReactNode;
}

export const DebugProvider: React.FC<DebugProviderProps> = ({ children }) => {
  const { isDebugMode, debugOptions, toggleDebugMode } = useDebugMode();
  const [dataSources, setDataSources] = useState<TableData[]>([]);
  const [queryTimes, setQueryTimes] = useState<Record<string, number>>({});
  const [showLineagePanel, setShowLineagePanel] = useState(false);
  
  // Show lineage panel when debug mode is activated with lineage option
  useEffect(() => {
    if (isDebugMode && debugOptions.dataLineage) {
      setShowLineagePanel(true);
    } else {
      setShowLineagePanel(false);
    }
  }, [isDebugMode, debugOptions.dataLineage]);

  // Add data source to tracking
  const addDataSource = (source: TableData) => {
    setDataSources(prev => {
      // Check if source already exists by tableName
      const existingIndex = prev.findIndex(s => s.tableName === source.tableName);
      if (existingIndex >= 0) {
        // Update existing source
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          fields: [...new Set([...updated[existingIndex].fields, ...source.fields])],
          queryParams: source.queryParams || updated[existingIndex].queryParams,
          transformations: source.transformations || updated[existingIndex].transformations,
        };
        return updated;
      }
      
      // Add new source
      return [...prev, source];
    });
  };
  
  // Track query execution time
  const trackQueryTime = (tableName: string, time: number) => {
    setQueryTimes(prev => ({
      ...prev,
      [tableName]: (prev[tableName] || 0) + time
    }));
  };
  
  // Reset data sources
  const resetDataSources = () => {
    setDataSources([]);
    setQueryTimes({});
  };
  
  // Calculate total query time
  const totalQueryTime = Object.values(queryTimes).reduce((sum, time) => sum + time, 0);
  
  return (
    <DebugContext.Provider value={{
      showDataSource: isDebugMode && !!debugOptions.dataSource,
      showRawValues: isDebugMode && !!debugOptions.rawValues,
      showQueryParams: isDebugMode && !!debugOptions.queryParams,
      addDataSource,
      trackQueryTime,
      resetDataSources
    }}>
      {children}
      
      {isDebugMode && (
        <>
          <div className="fixed top-0 right-0 bg-gray-900 text-white text-xs p-1 z-50 flex items-center">
            <span className="px-2 py-1 bg-red-600 rounded-l-md">DEBUG MODE</span>
            <button 
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600"
              onClick={() => toggleDebugMode()}
              title="Turn off debug mode"
            >
              OFF
            </button>
            <button 
              className={`px-2 py-1 ${debugOptions.dataSource ? 'bg-green-600' : 'bg-gray-700'} hover:bg-gray-600`}
              onClick={() => toggleDebugOption('dataSource')}
              title="Show data sources"
            >
              DS
            </button>
            <button 
              className={`px-2 py-1 ${debugOptions.rawValues ? 'bg-green-600' : 'bg-gray-700'} hover:bg-gray-600`}
              onClick={() => toggleDebugOption('rawValues')}
              title="Show raw values"
            >
              RAW
            </button>
            <button 
              className={`px-2 py-1 ${debugOptions.dataLineage ? 'bg-green-600' : 'bg-gray-700'} hover:bg-gray-600 rounded-r-md`}
              onClick={() => {
                toggleDebugOption('dataLineage');
                setShowLineagePanel(!showLineagePanel);
              }}
              title="Toggle data lineage panel"
            >
              LINEAGE
            </button>
          </div>
          
          <DataLineagePanel 
            isVisible={showLineagePanel} 
            onClose={() => setShowLineagePanel(false)}
            dataSources={dataSources}
            queryExecutionTime={totalQueryTime}
          />
        </>
      )}
    </DebugContext.Provider>
  );
};
