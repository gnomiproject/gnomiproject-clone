
import React, { useEffect, useState } from 'react';

interface RequestLog {
  timestamp: number;
  url: string;
  method: string;
  duration?: number;
}

const ApiRequestMonitor: React.FC = () => {
  const [requests, setRequests] = useState<RequestLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    // Override fetch to track API calls
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const startTime = Date.now();
      const url = args[0] as string;
      
      // Only track Supabase API calls
      if (typeof url === 'string' && url.includes('supabase')) {
        const logEntry: RequestLog = {
          timestamp: startTime,
          url: url.split('?')[0], // Remove query params for cleaner logs
          method: (args[1]?.method || 'GET').toUpperCase()
        };
        
        try {
          const response = await originalFetch(...args);
          logEntry.duration = Date.now() - startTime;
          
          setRequests(prev => [...prev.slice(-19), logEntry]); // Keep last 20 requests
          
          return response;
        } catch (error) {
          logEntry.duration = Date.now() - startTime;
          setRequests(prev => [...prev.slice(-19), logEntry]);
          throw error;
        }
      }
      
      return originalFetch(...args);
    };

    // Cleanup
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Show toggle button in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm shadow-lg hover:bg-blue-700"
        >
          API ({requests.length})
        </button>
      </div>
      
      {isVisible && (
        <div className="fixed bottom-16 right-4 w-96 max-h-80 bg-white border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
            <h3 className="font-medium text-sm">API Request Monitor</h3>
            <button
              onClick={() => setRequests([])}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          <div className="overflow-y-auto max-h-64">
            {requests.length === 0 ? (
              <div className="p-4 text-gray-500 text-sm">No API requests tracked</div>
            ) : (
              requests.map((request, index) => (
                <div key={index} className="px-4 py-2 border-b text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-blue-600">
                      {request.method}
                    </span>
                    <span className="text-gray-500">
                      {request.duration}ms
                    </span>
                  </div>
                  <div className="text-gray-700 mt-1 break-all">
                    {request.url.split('/').pop()}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {new Date(request.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ApiRequestMonitor;
