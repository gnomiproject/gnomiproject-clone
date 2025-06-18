
import React, { useCallback, useRef } from 'react';
import { getSupabaseUrl } from '@/integrations/supabase/client';

interface TrackingPixelProps {
  archetypeId: string;
  token: string;
  onLoad?: () => void;
  onError?: (error: any) => void;
}

const TrackingPixel: React.FC<TrackingPixelProps> = ({
  archetypeId,
  token,
  onLoad,
  onError
}) => {
  const hasLoadedRef = useRef(false);
  const hasErroredRef = useRef(false);

  const handleLoad = useCallback(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      console.log(`[TrackingPixel] Successfully loaded for ${archetypeId}`);
      onLoad?.();
    }
  }, [archetypeId, onLoad]);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasErroredRef.current) {
      hasErroredRef.current = true;
      console.warn(`[TrackingPixel] Failed to load for ${archetypeId}:`, e);
      onError?.(e);
    }
  }, [archetypeId, onError]);

  // Don't render if we don't have required props
  if (!archetypeId || !token) {
    return null;
  }

  const pixelUrl = `${getSupabaseUrl()}/functions/v1/tracking/${archetypeId}/${token}?t=${Date.now()}`;

  return (
    <img 
      src={pixelUrl}
      alt=""
      style={{ 
        position: 'absolute', 
        width: '1px', 
        height: '1px', 
        opacity: 0,
        pointerEvents: 'none'
      }}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default TrackingPixel;
