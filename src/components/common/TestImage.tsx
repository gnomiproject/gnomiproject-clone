
import React, { useState, useEffect } from 'react';
import { getImageByName, testDatabaseAccess } from '@/services/imageService';
import { fallbackGnomeImage } from '@/utils/gnomeImages';
import { Button } from '@/components/ui/button';
import { supabase, getSupabaseUrl } from '@/integrations/supabase/client';

// Hide the component completely since we're not using the database approach anymore
const TestImage = () => {
  const [imageUrls, setImageUrls] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const testImages = async () => {
      setLoading(true);
      
      // Test with direct name mappings
      const testNames = ['charts', 'reports', 'analysis', 'healthcare', 'metrics'];
      const results: Record<string, string | null> = {};
      
      for (const name of testNames) {
        try {
          results[name] = await getImageByName(name);
          console.log(`[TestImage] Result for "${name}":`, results[name]);
        } catch (error) {
          console.error(`[TestImage] Error loading image "${name}":`, error);
          results[name] = null;
        }
      }
      
      setImageUrls(results);
      setLoading(false);
    };
    
    testImages();
  }, []);
  
  // Return empty div to hide this component
  return <div className="hidden"></div>;
};

export default TestImage;
