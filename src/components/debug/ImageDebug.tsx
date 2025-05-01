
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { directImageMap } from '@/utils/gnomeImages';

const ImageDebug = () => {
  const [directImages, setDirectImages] = useState<{name: string, url: string}[]>([]);

  useEffect(() => {
    // Create array from the directImageMap for display
    const images = Object.entries(directImageMap).map(([name, url]) => ({
      name,
      url
    }));
    setDirectImages(images);
  }, []);
  
  return (
    <div className="hidden">
      {/* Component hidden as we're no longer using the database approach */}
    </div>
  );
};

export default ImageDebug;
