
import { useEffect, useState } from 'react';
import { supabase, getSupabaseUrl } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const ImageDebug = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [refreshTimestamp, setRefreshTimestamp] = useState(new Date());
  const [rawResponse, setRawResponse] = useState<any>(null);
  
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔎 [ImageDebug] Attempting direct query to gnomi_images table...');
        
        // Direct query to the gnomi_images table
        const { data, error, count } = await supabase
          .from('gnomi_images')
          .select('*', { count: 'exact' });
          
        // Save raw response for debugging
        setRawResponse({ data, error, count });
          
        console.log('🔎 [ImageDebug] Direct Supabase query result:', { 
          data, 
          error,
          projectUrl: getSupabaseUrl(),
          recordCount: data?.length || 0
        });
        
        if (error) {
          throw new Error(`Database error: ${error.message}`);
        }
        
        setRecords(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('🔎 [ImageDebug] Error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchImages();
  }, [refreshTimestamp]);
  
  const handleManualInsert = async () => {
    try {
      setIsLoading(true);
      
      // Insert sample records
      const { data, error } = await supabase
        .from('gnomi_images')
        .upsert([
          { id: 1, image_name: 'charts', image_url: 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_chart.png' },
          { id: 2, image_name: 'reports', image_url: 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_report.png' },
          { id: 3, image_name: 'healthcare', image_url: 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_healthcare.png' },
          { id: 4, image_name: 'metrics', image_url: 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_metrics.png' },
          { id: 5, image_name: 'analysis', image_url: 'https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_analysis.png' }
        ], { onConflict: 'id' });
      
      if (error) {
        throw new Error(`Insert error: ${error.message}`);
      }
      
      // Refresh data by updating timestamp
      setRefreshTimestamp(new Date());
    } catch (err: any) {
      setError(err.message);
      console.error('🔎 [ImageDebug] Insert error:', err);
    }
  };
  
  return (
    <div className="p-4 my-4 border-2 border-red-500 bg-red-50 rounded">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold mb-2">🛑 IMAGE DATABASE DEBUG 🛑</h2>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setRefreshTimestamp(new Date())}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={handleManualInsert}
            disabled={isLoading}
          >
            Add Test Images
          </Button>
        </div>
      </div>
      
      <div className="bg-white p-2 rounded text-xs mb-3">
        <p>Connection: <code>{getSupabaseUrl() || 'Not connected'}</code></p>
        <p>Table: <code>gnomi_images</code></p>
        <p>Status: <code className={isLoading ? "text-yellow-600" : "text-green-600"}>
          {isLoading ? "Querying..." : "Ready"}
        </code></p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin h-6 w-6 border-2 border-red-500 border-t-transparent rounded-full mr-2"></div>
          <p>Loading image data...</p>
        </div>
      ) : error ? (
        <div className="p-2 bg-red-200 border border-red-500 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div>
          <p className="mb-2"><strong>Raw Records ({records.length}):</strong></p>
          {records.length === 0 ? (
            <div>
              <p className="text-red-700 font-bold">No records found in gnomi_images table.</p>
              <div className="mt-2 p-3 bg-yellow-100 text-yellow-800 rounded">
                <p className="font-bold">Troubleshooting Steps:</p>
                <ol className="list-decimal list-inside mt-1 text-sm space-y-1">
                  <li>Check that the SQL migration has been executed successfully</li>
                  <li>Verify the table exists in your Supabase project</li>
                  <li>Ensure you have the correct permissions set up</li>
                  <li>Try the "Add Test Images" button above to manually insert data</li>
                </ol>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {records.map((record) => (
                  <div key={record.id} className="p-2 mb-2 border rounded bg-white">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{record.image_name}</span>
                      <span className="text-gray-500">ID: {record.id}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate" title={record.image_url}>
                      {record.image_url}
                    </p>
                    <div className="mt-2">
                      <p className="text-xs">Image Preview:</p>
                      <div className="h-20 flex items-center justify-center border bg-gray-50 mt-1">
                        <img 
                          src={record.image_url} 
                          alt={record.image_name}
                          className="max-h-full border"
                          onError={(e) => {
                            const img = e.currentTarget;
                            img.style.display = 'none';
                            img.insertAdjacentHTML('afterend', 
                              `<div class="text-red-500 text-xs">Failed to load image</div>`
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Raw response for deeper debugging */}
          <Separator className="my-3" />
          <details className="text-xs">
            <summary className="cursor-pointer font-medium">Raw Database Response</summary>
            <pre className="mt-2 bg-gray-100 p-2 overflow-auto max-h-40 text-xs">
              {JSON.stringify(rawResponse, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default ImageDebug;
