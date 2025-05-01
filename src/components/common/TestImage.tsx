
import React, { useState, useEffect } from 'react';
import { getImageByName, testDatabaseAccess } from '@/services/imageService';
import { fallbackGnomeImage } from '@/utils/gnomeImages';
import { Button } from '@/components/ui/button';

const TestImage = () => {
  const [imageUrls, setImageUrls] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [allImages, setAllImages] = useState<any[] | null>(null);
  const [isTestingDb, setIsTestingDb] = useState(false);
  
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
  
  const handleTestDbAccess = async () => {
    setIsTestingDb(true);
    try {
      const results = await testDatabaseAccess();
      setAllImages(results);
    } finally {
      setIsTestingDb(false);
    }
  };
  
  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">Image Service Test</h2>
      
      {/* Database Test Button */}
      <div className="mb-4">
        <Button 
          onClick={handleTestDbAccess} 
          variant="destructive" 
          disabled={isTestingDb}
          className="mb-2"
        >
          {isTestingDb ? "Testing..." : "Test Database Access"}
        </Button>
        {allImages !== null && (
          <div className="p-2 bg-gray-100 rounded text-xs">
            <p>Found {allImages.length} images in database</p>
            {allImages.length > 0 && (
              <div className="mt-2 max-h-40 overflow-auto">
                <pre>{JSON.stringify(allImages, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
      
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
