
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type DebugModeOptions = {
  // Debug levels/modes that can be enabled
  dataSource?: boolean;
  rawValues?: boolean;
  queryParams?: boolean;
  dataLineage?: boolean;
};

export function useDebugMode() {
  const location = useLocation();
  const navigate = useNavigate();
  const [debugOptions, setDebugOptions] = useState<DebugModeOptions>({});
  const [isDebugMode, setIsDebugMode] = useState(false);

  // Parse debug options from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const debugParam = params.get('debug');
    
    if (debugParam) {
      const options: DebugModeOptions = {};
      
      // Parse comma-separated debug options
      debugParam.split(',').forEach(option => {
        switch (option) {
          case 'datasources':
            options.dataSource = true;
            break;
          case 'raw':
            options.rawValues = true;
            break;
          case 'params':
            options.queryParams = true;
            break;
          case 'lineage':
            options.dataLineage = true;
            break;
          case 'all':
            options.dataSource = true;
            options.rawValues = true;
            options.queryParams = true;
            options.dataLineage = true;
            break;
        }
      });
      
      setDebugOptions(options);
      setIsDebugMode(Object.keys(options).length > 0);
      
      console.log('[Debug Mode] Activated with options:', options);
    }
  }, [location]);

  // Setup keyboard shortcut for debug mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+Shift+D to toggle debug mode
      if (e.altKey && e.shiftKey && e.key === 'D') {
        toggleDebugMode();
      }
      
      // Alt+Shift+1 to toggle datasource debugging
      if (isDebugMode && e.altKey && e.shiftKey && e.key === '1') {
        toggleDebugOption('dataSource');
      }
      
      // Alt+Shift+2 to toggle raw values
      if (isDebugMode && e.altKey && e.shiftKey && e.key === '2') {
        toggleDebugOption('rawValues');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDebugMode, debugOptions]);
  
  // Toggle debug mode on/off
  const toggleDebugMode = useCallback(() => {
    if (isDebugMode) {
      // Turn off debug mode - remove debug parameter
      const params = new URLSearchParams(location.search);
      params.delete('debug');
      navigate({ search: params.toString() }, { replace: true });
      setIsDebugMode(false);
      setDebugOptions({});
      console.log('[Debug Mode] Deactivated');
    } else {
      // Turn on debug mode with all options
      const params = new URLSearchParams(location.search);
      params.set('debug', 'all');
      navigate({ search: params.toString() }, { replace: true });
      setIsDebugMode(true);
      setDebugOptions({
        dataSource: true,
        rawValues: true,
        queryParams: true,
        dataLineage: true
      });
      console.log('[Debug Mode] Activated with all options');
    }
  }, [isDebugMode, location.search, navigate]);
  
  // Toggle individual debug options
  const toggleDebugOption = useCallback((option: keyof DebugModeOptions) => {
    setDebugOptions(prev => {
      const updated = { ...prev, [option]: !prev[option] };
      
      // Update URL to reflect current debug options
      const params = new URLSearchParams(location.search);
      const activeOptions = Object.entries(updated)
        .filter(([_, enabled]) => enabled)
        .map(([key]) => {
          switch (key) {
            case 'dataSource': return 'datasources';
            case 'rawValues': return 'raw';
            case 'queryParams': return 'params';
            case 'dataLineage': return 'lineage';
            default: return key;
          }
        });
      
      if (activeOptions.length > 0) {
        params.set('debug', activeOptions.join(','));
      } else {
        params.delete('debug');
        setIsDebugMode(false);
      }
      
      navigate({ search: params.toString() }, { replace: true });
      console.log(`[Debug Mode] Toggled ${option} to ${!prev[option]}`);
      
      return updated;
    });
  }, [location.search, navigate]);

  return {
    isDebugMode,
    debugOptions,
    toggleDebugMode,
    toggleDebugOption
  };
}
