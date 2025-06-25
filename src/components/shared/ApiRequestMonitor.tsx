
import React, { useEffect, useState } from 'react';

interface RequestLog {
  timestamp: number;
  url: string;
  method: string;
  duration?: number;
  count?: number; // Track duplicate requests
}

const ApiRequestMonitor: React.FC = () => {
  const [requests, setRequests] = useState<RequestLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [duplicateCount, setDuplicateCount] = useState(0);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'production') return;

    // Override fetch to track API calls
    const originalFetch = window.fetch;
    const requestCache = new Map(); // Cache to track duplicate requests
    
    window.fetch = async (...args) => {
      const startTime = Date.now();
      const url = args[0] as string;
      
      // Only track Supabase API calls
      if (typeof url === 'string' && url.includes('supabase')) {
        const cleanUrl = url.split('?')[0]; // Remove query params for cleaner logs
        const method = (args[1]?.method || 'GET').toUpperCase();
        const requestKey = `${method}:${cleanUrl}`;
        
        // Check for duplicate requests
        const now = Date.now();
        const lastRequest = requestCache.get(requestKey);
        
        if (lastRequest && (now - lastRequest) < 1000) {
          // Duplicate request within 1 second
          setDuplicateCount(prev => prev + 1);
          console.warn(`[API Monitor] Duplicate request detected: ${requestKey}`);
        }
        
        requestCache.set(requestKey, now);
        
        const logEntry: RequestLog = {
          timestamp: startTime,
          url: cleanUrl,
          method: method
        };
        
        try {
          const response = await originalFetch(...args);
          logEntry.duration = Date.now() - startTime;
          
          setRequests(prev => {
            // Check if this exact request already exists
            const existingIndex = prev.findIndex(r => 
              r.url === logEntry.url && 
              r.method === logEntry.method &&
              Math.abs(r.timestamp - logEntry.timestamp) < 1000
            );
            
            if (existingIndex >= 0) {
              // Update existing entry with count
              const updated = [...prev];
              updated[existingIndex] = {
                ...updated[existingIndex],
                count: (updated[existingIndex].count || 1) + 1
              };
              return updated.slice(-19); // Keep last 20 requests
            } else {
              // Add new entry
              return [...prev.slice(-19), logEntry];
            }
          });
          
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
  if (process.env.NODE_ENV !== 'production') return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className={`px-3 py-2 rounded-md text-sm shadow-lg text-white ${
            duplicateCount > 0 ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          API ({requests.length}) {duplicateCount > 0 && `⚠️ ${duplicateCount}`}
        </button>
      </div>
      
      {isVisible && (
        <div className="fixed bottom-16 right-4 w-96 max-h-80 bg-white border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
            <h3 className="font-medium text-sm">
              API Request Monitor
              {duplicateCount > 0 && (
                <span className="ml-2 text-red-600 text-xs">
                  ({duplicateCount} duplicates)
                </span>
              )}
            </h3>
            <button
              onClick={() => {
                setRequests([]);
                setDuplicateCount(0);
              }}
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
                      {request.count && request.count > 1 && (
                        <span className="ml-1 text-red-600">×{request.count}</span>
                      )}
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
