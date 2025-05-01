
import React, { useState, useEffect } from 'react';
import { getImageByName } from '@/services/imageService';
import { fallbackGnomeImage } from '@/utils/gnomeImages';

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
      
      {/* Direct image test */}
      <div className="p-4 border border-red-500 bg-red-50 mb-4">
        <h3 className="text-md font-bold">Direct Image Test</h3>
        <p className="mb-2 text-sm">Testing direct image loading from URL:</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs mb-1">Fallback SVG path:</p>
            <img 
              src={fallbackGnomeImage}
              alt="Fallback SVG" 
              className="h-32 border-2 border-blue-500" 
            />
            <p className="text-xs mt-1">Source: {fallbackGnomeImage}</p>
          </div>
          
          <div>
            <p className="text-xs mb-1">Sample from Supabase:</p>
            <img 
              src="https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_chart.png" 
              alt="Direct test" 
              className="h-32 border-2 border-green-500" 
            />
            <p className="text-xs mt-1">Source: supabase/gnome-images/gnome_chart.png</p>
          </div>
        </div>
      </div>
      
      {/* Service test results */}
      {loading ? (
        <p>Loading image data...</p>
      ) : (
        <div>
          <h3 className="text-md font-bold">Image Service Results:</h3>
          {Object.entries(imageUrls).map(([name, url]) => (
            <div key={name} className="mb-4 p-2 border rounded">
              <p className="font-medium">Name: {name}</p>
              <p className="text-sm text-gray-600 break-all">URL: {url || 'Not found'}</p>
              {url && 
                <div className="mt-2 border p-2">
                  <img src={url} alt={name} className="h-32 object-contain mx-auto" />
                </div>
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestImage;
