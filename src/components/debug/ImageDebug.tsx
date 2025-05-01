
import { useEffect, useState } from 'react';
import { supabase, getSupabaseUrl } from '@/integrations/supabase/client';

const ImageDebug = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔎 [ImageDebug] Attempting direct query to gnomi_images table...');
        
        // Direct query to the gnomi_images table
        const { data, error } = await supabase
          .from('gnomi_images')
          .select('*');
          
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
  }, []);
  
  return (
    <div className="p-4 my-4 border-2 border-red-500 bg-red-50 rounded">
      <h2 className="text-xl font-bold mb-2">🛑 BASIC IMAGE DEBUG 🛑</h2>
      
      {isLoading ? (
        <p>Loading image data...</p>
      ) : error ? (
        <div className="p-2 bg-red-200 border border-red-500 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div>
          <p className="mb-2"><strong>Raw Records ({records.length}):</strong></p>
          {records.length === 0 ? (
            <p className="text-red-700 font-bold">No records found in gnomi_images table.</p>
          ) : (
            <div>
              {records.map((record) => (
                <div key={record.id} className="p-2 mb-2 border rounded">
                  <p>ID: {record.id}</p>
                  <p>Name: {record.image_name}</p>
                  <p>URL: {record.image_url}</p>
                  <div className="mt-2">
                    <p>Direct Image Render:</p>
                    <img 
                      src={record.image_url} 
                      alt={record.image_name}
                      className="h-24 border"
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = 'none';
                        img.insertAdjacentHTML('afterend', 
                          `<div class="text-red-500">Failed to load: ${record.image_url}</div>`
                        );
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDebug;
