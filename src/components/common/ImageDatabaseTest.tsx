
import React, { useState, useEffect } from 'react';
import { supabase, getSupabaseUrl } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';

interface ImageRecord {
  id: number;
  image_name: string;
  image_url: string;
}

const ImageDatabaseTest: React.FC = () => {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [queryLog, setQueryLog] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔴 [ImageDatabaseTest] Fetching all images from gnomi_images table... 🔴');
        const startTime = performance.now();
        
        // More detailed query with timing
        const { data, error, count } = await supabase
          .from('gnomi_images')
          .select('*', { count: 'exact' });
        
        const endTime = performance.now();
        const queryTime = (endTime - startTime).toFixed(2);
        
        const logInfo = {
          timestamp: new Date().toISOString(),
          data, 
          error,
          count: data ? data.length : 0,
          projectUrl: getSupabaseUrl(),
          queryTime: `${queryTime}ms`,
          status: error ? 'error' : 'success'
        };
        
        console.log('🔴 [ImageDatabaseTest] Query results: 🔴', logInfo);
        setQueryLog(JSON.stringify(logInfo, null, 2));
        
        if (error) {
          setError(error);
          console.error('🔴 [ImageDatabaseTest] Error fetching images: 🔴', error);
        } else if (data) {
          setImages(data);
        }
      } catch (e) {
        setError(e);
        console.error('🔴 [ImageDatabaseTest] Unexpected error: 🔴', e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImages();
  }, [refreshCounter]);
  
  const handleRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };
  
  return (
    <div className="p-4 border border-green-500 bg-green-50 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Database Image Records</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Refresh Data'
          )}
        </Button>
      </div>
      
      {/* Database connection info */}
      <div className="bg-blue-50 p-2 rounded mb-2 text-xs">
        <p>Supabase Project: <code>{getSupabaseUrl()}</code></p>
        <p>Table: <code>gnomi_images</code></p>
        <p>Status: <code className={loading ? "text-yellow-600" : "text-green-600"}>
          {loading ? "Querying..." : "Ready"}
        </code></p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="ml-3">Loading image records...</span>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded">
          <p className="font-bold">Error loading images:</p>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      ) : (
        <div>
          {/* Query log */}
          {queryLog && (
            <details className="mb-3 text-xs">
              <summary className="cursor-pointer font-medium">Query Details</summary>
              <pre className="mt-1 p-2 bg-gray-100 overflow-auto max-h-40 rounded">{queryLog}</pre>
            </details>
          )}
          
          <p>Found <span className="font-bold">{images.length}</span> image records:</p>
          
          {images.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map(img => (
                <div key={img.id} className="border rounded p-2 bg-white">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{img.image_name}</p>
                    <span className="text-xs text-gray-500">ID: {img.id}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate" title={img.image_url}>{img.image_url}</p>
                  <div className="mt-2 h-32 flex items-center justify-center border bg-gray-50">
                    <img 
                      src={img.image_url} 
                      alt={img.image_name}
                      className="max-h-28 max-w-full object-contain"
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = 'none';
                        img.insertAdjacentHTML('afterend', 
                          `<div class="text-red-500 text-xs p-2">Failed to load image</div>`
                        );
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2 p-3 bg-red-100 text-red-800 rounded">
              <p className="font-bold">No image records found!</p>
              <p className="text-sm mt-1">The gnomi_images table appears to be empty or inaccessible. Check that:</p>
              <ul className="text-sm mt-1 list-disc list-inside">
                <li>The SQL migration has been run successfully</li>
                <li>The user has the necessary permissions to access the table</li>
                <li>Your Supabase project configuration is correct</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDatabaseTest;
