
import React, { useState, useEffect } from 'react';
import { supabase, getSupabaseUrl } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

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
  
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔴 [ImageDatabaseTest] Fetching all images from gnomi_images table... 🔴');
        
        const { data, error } = await supabase
          .from('gnomi_images')
          .select('*');
        
        console.log('🔴 [ImageDatabaseTest] Query results: 🔴', { 
          data, 
          error,
          count: data ? data.length : 0,
          projectUrl: getSupabaseUrl()
        });
        
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
          variant="secondary" 
          size="sm" 
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>
      
      {loading ? (
        <p>Loading image records...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded">
          <p className="font-bold">Error loading images:</p>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      ) : (
        <div>
          <div className="bg-blue-50 p-2 rounded mb-2">
            <p>Supabase Project: <code>{getSupabaseUrl()}</code></p>
            <p>Table: <code>gnomi_images</code></p>
          </div>
          
          <p>Found {images.length} image records:</p>
          
          {images.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map(img => (
                <div key={img.id} className="border rounded p-2 bg-white">
                  <p className="font-semibold">{img.image_name}</p>
                  <p className="text-xs text-gray-500 truncate">{img.image_url}</p>
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
            <p className="mt-2 text-orange-600">No image records found! The records should have been inserted by the SQL migration.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDatabaseTest;
