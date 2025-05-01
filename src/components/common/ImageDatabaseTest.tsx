
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ImageRecord {
  id: number;
  image_name: string;
  image_url: string;
}

const ImageDatabaseTest: React.FC = () => {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('gnomi_images')
        .select('*');
      
      console.log('IMAGES DB TEST:', { data, error });
      
      if (data) {
        setImages(data);
      }
      
      setLoading(false);
    };
    
    fetchImages();
  }, []);
  
  return (
    <div className="p-4 border border-green-500 bg-green-50 mb-4">
      <h2 className="text-lg font-bold">Database Image Records</h2>
      {loading ? (
        <p>Loading image records...</p>
      ) : (
        <div>
          <p>Found {images.length} image records:</p>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(images, null, 2)}
          </pre>
          <ul className="mt-2 list-disc pl-5">
            {images.map(img => (
              <li key={img.id}>
                {img.image_name}: {img.image_url ? img.image_url.substring(0, 60) + '...' : 'No URL'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageDatabaseTest;
