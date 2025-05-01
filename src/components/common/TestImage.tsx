
import React, { useState, useEffect } from 'react';
import { getImageByName, testDatabaseAccess } from '@/services/imageService';
import { fallbackGnomeImage } from '@/utils/gnomeImages';
import { Button } from '@/components/ui/button';
import { supabase, getSupabaseUrl } from '@/integrations/supabase/client';

const TestImage = () => {
  const [imageUrls, setImageUrls] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [allImages, setAllImages] = useState<any[] | null>(null);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [directDbQuery, setDirectDbQuery] = useState<any>(null);
  
  useEffect(() => {
    const testImages = async () => {
      setLoading(true);
      setImageError(null);
      
      // Test with both direct name and gnomeImages mapping
      const testNames = ['charts', 'reports', 'analysis', 'healthcare', 'metrics'];
      const results: Record<string, string | null> = {};
      
      for (const name of testNames) {
        try {
          console.log(`[TestImage] Testing image "${name}"...`);
          results[name] = await getImageByName(name);
          console.log(`[TestImage] Result for "${name}":`, results[name]);
          
          if (!results[name]) {
            setImageError(`Failed to load image "${name}"`);
          }
        } catch (error) {
          console.error(`[TestImage] Error loading image "${name}":`, error);
          setImageError(`Error loading "${name}": ${error instanceof Error ? error.message : String(error)}`);
          results[name] = null;
        }
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
    } catch (error) {
      console.error('[TestImage] Error testing database access:', error);
      setImageError(`Database test error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsTestingDb(false);
    }
  };
  
  const handleDirectDbQuery = async () => {
    try {
      // Very direct and simple query to test database connectivity
      const { data, error, count } = await supabase
        .from('gnomi_images')
        .select('*', { count: 'exact' });
        
      setDirectDbQuery({
        data,
        error,
        count,
        url: getSupabaseUrl(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[TestImage] Direct query error:', error);
      setDirectDbQuery({ error: String(error) });
    }
  };
  
  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">Image Service Test</h2>
      
      {/* Database Test Buttons */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <Button 
          onClick={handleTestDbAccess} 
          variant="destructive" 
          disabled={isTestingDb}
        >
          {isTestingDb ? "Testing..." : "Test Database Access"}
        </Button>
        
        <Button 
          onClick={handleDirectDbQuery}
          variant="outline"
        >
          Direct Database Query
        </Button>
      </div>
      
      {/* Direct query results */}
      {directDbQuery && (
        <div className="p-2 bg-gray-100 rounded text-xs mb-4">
          <p className="font-bold">Direct Query Results:</p>
          <div className="mt-1 max-h-40 overflow-auto">
            <pre className="whitespace-pre-wrap">{JSON.stringify(directDbQuery, null, 2)}</pre>
          </div>
        </div>
      )}
      
      {allImages !== null && (
        <div className="p-2 bg-gray-100 rounded text-xs mb-4">
          <p>Found {allImages.length} images in database</p>
          {allImages.length > 0 ? (
            <div className="mt-2 max-h-40 overflow-auto">
              <pre>{JSON.stringify(allImages, null, 2)}</pre>
            </div>
          ) : (
            <p className="text-red-600 font-bold mt-1">
              No images found in database! Check your Supabase connection and data.
            </p>
          )}
        </div>
      )}
      
      {/* Display any errors */}
      {imageError && (
        <div className="p-2 bg-red-100 text-red-700 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{imageError}</p>
        </div>
      )}
      
      {/* Direct image test */}
      <div className="p-4 border border-red-500 bg-red-50 mb-4">
        <h3 className="text-md font-bold">Direct Image Test</h3>
        <p className="mb-2 text-sm">Testing direct image loading from URL:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs mb-1">Fallback SVG path:</p>
            <img 
              src={fallbackGnomeImage}
              alt="Fallback SVG" 
              className="h-32 border-2 border-blue-500" 
              onError={(e) => {
                console.error('[TestImage] Error loading fallback SVG:', e);
                setImageError(`Failed to load fallback SVG: ${fallbackGnomeImage}`);
              }}
            />
            <p className="text-xs mt-1">Source: {fallbackGnomeImage}</p>
          </div>
          
          <div>
            <p className="text-xs mb-1">Sample from Supabase:</p>
            <img 
              src={`https://qsecdncdiykzuimtaosp.supabase.co/storage/v1/object/public/gnome-images/gnome_charts.png`}
              alt="Direct test" 
              className="h-32 border-2 border-green-500" 
              onError={(e) => {
                console.error('[TestImage] Error loading direct Supabase image:', e);
                setImageError('Failed to load image directly from Supabase URL');
              }}
            />
            <p className="text-xs mt-1">Source: supabase/gnome-images/gnome_charts.png</p>
          </div>
        </div>
      </div>
      
      {/* Service test results */}
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="ml-3">Loading image data...</span>
        </div>
      ) : (
        <div>
          <h3 className="text-md font-bold">Image Service Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {Object.entries(imageUrls).map(([name, url]) => (
              <div key={name} className="mb-4 p-2 border rounded">
                <p className="font-medium">Name: {name}</p>
                <p className="text-sm text-gray-600 break-all truncate hover:whitespace-normal">{url || 'Not found'}</p>
                <div className="mt-2 border p-2 h-40 flex items-center justify-center bg-gray-50">
                  {url ? 
                    <img 
                      src={url} 
                      alt={name} 
                      className="h-full object-contain" 
                      onError={(e) => {
                        console.error(`[TestImage] Error loading image from URL: ${url}`, e);
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        target.insertAdjacentHTML('afterend', `<div class="text-red-500">Failed to load</div>`);
                      }}
                    />
                    :
                    <div className="text-red-500">No URL available</div>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestImage;
