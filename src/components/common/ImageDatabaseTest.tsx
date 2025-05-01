
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
          projectUrl: supabase.getUrl()
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
            <p>Supabase Project: <code>{supabase.getUrl()}</code></p>
            <p>Table: <code>gnomi_images</code></p>
          </div>
          
          <p>Found {images.length} image records:</p>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(images, null, 2)}
          </pre>
          
          {images.length > 0 ? (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Image List:</h3>
              <ul className="list-disc pl-5">
                {images.map(img => (
                  <li key={img.id}>
                    <strong>{img.image_name}:</strong> {img.image_url ? img.image_url.substring(0, 60) + '...' : 'No URL'}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-2 text-orange-600">No image records found! Possible permission/access issue.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDatabaseTest;
