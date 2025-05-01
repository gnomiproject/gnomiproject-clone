
import React, { useEffect, useState } from 'react';
import { getImageByName } from '@/services/imageService';

const TestImage = () => {
  const [imageUrls, setImageUrls] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const testImages = async () => {
      const testNames = ['gnome_chart', 'charts'];
      const results: Record<string, string | null> = {};
      
      for (const name of testNames) {
        results[name] = await getImageByName(name);
      }
      
      setImageUrls(results);
      setLoading(false);
    };
    
    testImages();
  }, []);
  
  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">Image Service Test</h2>
      {loading ? (
        <p>Loading image data...</p>
      ) : (
        <div>
          {Object.entries(imageUrls).map(([name, url]) => (
            <div key={name} className="mb-4">
              <p>Name: {name}</p>
              <p>URL: {url || 'Not found'}</p>
              {url && <img src={url} alt={name} className="max-w-md mt-2 border" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestImage;
