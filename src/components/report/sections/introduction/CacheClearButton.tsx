
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { clearProblematicCache } from '@/utils/reports/reportCache';
import { averageDataService } from '@/services/AverageDataService';

const CacheClearButton = () => {
  const handleClearCache = () => {
    console.log('[CacheClearButton] 🧹 Clearing all problematic cache');
    
    // Clear report cache
    clearProblematicCache();
    
    // Clear average data service cache
    averageDataService.clearCache();
    
    // Reload the page to fetch fresh data
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Only show in development mode
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={handleClearCache}
        variant="destructive"
        size="sm"
        className="flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Clear Cache & Fix Averages
      </Button>
    </div>
  );
};

export default CacheClearButton;
